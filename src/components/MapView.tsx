import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../lib/translations';
import type { FoodListing } from '../../shared/types';

// Fix for default marker icons in Leaflet + Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function createFoodIcon(quantity: number) {
  return L.divIcon({
    className: 'custom-food-icon',
    html: `
      <div style="position:relative;display:inline-flex;align-items:center;justify-content:center;">
        <div style="font-size:32px;">🍽️</div>
        <span style="position:absolute;top:-4px;right:-8px;background:#22c55e;color:white;
          border-radius:9999px;width:22px;height:22px;display:flex;align-items:center;
          justify-content:center;font-size:12px;font-weight:700;border:2px solid white;
          box-shadow:0 1px 3px rgba(0,0,0,0.3);">${quantity}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: 'custom-food-icon',
    html: `<div style="font-size:28px;">📍</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}

interface MapViewProps {
  listings?: FoodListing[];
  userLocation?: { lat: number; lng: number } | null;
  center?: [number, number];
  zoom?: number;
  onListingClick?: (listing: FoodListing) => void;
  otherUserLocation?: { lat: number; lng: number } | null;
  showRoute?: boolean;
  className?: string;
}

export default function MapView({
  listings = [],
  userLocation,
  center,
  zoom = 13,
  onListingClick,
  otherUserLocation,
  showRoute,
  className = 'w-full h-[60vh] md:h-[70vh]',
}: MapViewProps) {
  const { lang } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const defaultCenter: [number, number] = center || [33.6844, 73.0479]; // Islamabad
    mapRef.current = L.map(containerRef.current).setView(defaultCenter, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    // Add user location marker
    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], { icon: createUserIcon() })
        .addTo(markersRef.current)
        .bindPopup(`<b>${t('mapYourLocation', lang)}</b>`);
    }

    // Add listing markers
    listings.forEach((listing) => {
      const marker = L.marker([listing.latitude, listing.longitude], {
        icon: createFoodIcon(listing.remaining_quantity),
      }).addTo(markersRef.current!);

      marker.bindPopup(`
        <div style="min-width:180px;padding:4px;">
          <h3 style="font-weight:700;font-size:14px;margin-bottom:4px;">${listing.title}</h3>
          <p style="color:#666;font-size:12px;">${t('mapServingsLabel', lang)}: <b>${listing.remaining_quantity}</b></p>
          ${listing.donor_name ? `<p style="color:#666;font-size:12px;">${t('mapByLabel', lang)}: ${listing.donor_name}</p>` : ''}
          <p style="color:#888;font-size:11px;margin-top:4px;">${listing.address || ''}</p>
        </div>
      `);

      if (onListingClick) {
        marker.on('click', () => onListingClick(listing));
      }
    });

    // Other user location (for tracking)
    if (otherUserLocation) {
      L.marker([otherUserLocation.lat, otherUserLocation.lng], { icon: defaultIcon })
        .addTo(markersRef.current)
        .bindPopup(`<b>${t('mapOtherUser', lang)}</b>`);
    }

    // Route line
    if (showRoute && userLocation && otherUserLocation) {
      if (routeRef.current) {
        routeRef.current.remove();
      }
      routeRef.current = L.polyline(
        [
          [userLocation.lat, userLocation.lng],
          [otherUserLocation.lat, otherUserLocation.lng],
        ],
        { color: '#22c55e', weight: 4, dashArray: '10, 10' }
      ).addTo(mapRef.current!);
    }
  }, [listings, userLocation, otherUserLocation, showRoute, onListingClick]);

  // Fit bounds when listings change
  useEffect(() => {
    if (!mapRef.current || listings.length === 0) return;

    const points: [number, number][] = listings.map((l) => [l.latitude, l.longitude]);
    if (userLocation) {
      points.push([userLocation.lat, userLocation.lng]);
    }

    if (points.length > 1) {
      mapRef.current.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
    }
  }, [listings.length]);

  return <div ref={containerRef} className={`rounded-2xl overflow-hidden ${className}`} />;
}
