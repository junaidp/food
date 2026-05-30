import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../lib/translations';
import { MapPin, Clock, ArrowLeft } from 'lucide-react';
import L from 'leaflet';

export default function CreateListing() {
  const navigate = useNavigate();
  const { addToast } = useNotifications();
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    food_type: '',
    quantity: 1,
    address: '',
    hours: 2,
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get user location
  useEffect(() => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGettingLocation(false);
      },
      () => {
        // Default to Islamabad
        setLocation({ lat: 33.6844, lng: 73.0479 });
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Init map
  useEffect(() => {
    if (!containerRef.current || !location || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView([location.lat, location.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapRef.current);

    markerRef.current = L.marker([location.lat, location.lng], { draggable: true }).addTo(mapRef.current);
    markerRef.current.bindPopup('Drag me to set food location').openPopup();

    markerRef.current.on('dragend', () => {
      const pos = markerRef.current?.getLatLng();
      if (pos) {
        setLocation({ lat: pos.lat, lng: pos.lng });
      }
    });

    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      markerRef.current?.setLatLng(e.latlng);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [location !== null]);

  // Update marker when location changes
  useEffect(() => {
    if (markerRef.current && location) {
      markerRef.current.setLatLng([location.lat, location.lng]);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      addToast(t('error', lang), t('createSetLocationError', lang), 'error');
      return;
    }

    setLoading(true);
    try {
      const expiresAt = new Date(Date.now() + form.hours * 60 * 60 * 1000).toISOString();
      await api.post('/listings', {
        title: form.title,
        description: form.description || undefined,
        food_type: form.food_type || undefined,
        quantity: form.quantity,
        latitude: location.lat,
        longitude: location.lng,
        address: form.address || undefined,
        expires_at: expiresAt,
      });
      addToast(t('success', lang), t('createSuccess', lang), 'success');
      navigate('/donor');
    } catch (err: any) {
      addToast(t('error', lang), err.response?.data?.error || t('createFailed', lang), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button onClick={() => navigate('/donor')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-5 h-5" /> {t('back', lang)}
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('createTitle', lang)} 🥗</h1>
      <p className="text-gray-500 mb-6">{t('createSubtitle', lang)}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('createWhatFood', lang)}
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
            placeholder={t('createFoodPlaceholder', lang)}
            required
          />
        </div>

        {/* Quantity - Main feature with big buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('createHowMany', lang)}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
              className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-colors"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <span className="text-5xl">🍽️</span>
                <span className="absolute -top-1 -right-3 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg">
                  {form.quantity}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {form.quantity} {form.quantity === 1 ? t('createPerson', lang) : t('createPeople', lang)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, quantity: Math.min(20, form.quantity + 1) })}
              className="w-12 h-12 rounded-xl bg-primary-100 hover:bg-primary-200 text-xl font-bold text-primary-700 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Description (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('createDescription', lang)} <span className="text-gray-400">({t('optional', lang)})</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
            rows={2}
            placeholder={t('createDescPlaceholder', lang)}
          />
        </div>

        {/* Food type (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('createFoodType', lang)} <span className="text-gray-400">({t('optional', lang)})</span>
          </label>
          <input
            type="text"
            value={form.food_type}
            onChange={(e) => setForm({ ...form, food_type: e.target.value })}
            className="input-field"
            placeholder={t('createTypePlaceholder', lang)}
          />
        </div>

        {/* Expiry time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            {t('createAvailableFor', lang)}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 4, 6].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setForm({ ...form, hours: h })}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                  form.hours === h
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('createAddress', lang)} <span className="text-gray-400">({t('optional', lang)})</span>
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="input-field"
            placeholder={t('createAddressPlaceholder', lang)}
          />
        </div>

        {/* Map */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            {t('createPinLocation', lang)}
          </label>
          {gettingLocation ? (
            <div className="h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto mb-2" />
                <p className="text-sm text-gray-500">{t('createGettingLocation', lang)}</p>
              </div>
            </div>
          ) : (
            <div ref={containerRef} className="h-64 rounded-2xl overflow-hidden" />
          )}
          {location && (
            <p className="text-xs text-gray-400 mt-1">
              📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)} — {t('createClickDrag', lang)}
            </p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            `🥗 ${t('createPublish', lang)}`
          )}
        </button>
      </form>
    </div>
  );
}
