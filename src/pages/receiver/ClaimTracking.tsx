import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useNotifications } from '../../context/NotificationContext';
import { getSocket } from '../../lib/socket';
import MapView from '../../components/MapView';
import { ArrowLeft, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { getPickupTimeRemaining, formatDistance } from '../../lib/utils';
import type { Claim } from '../../../shared/types';

interface ExtendedClaim extends Claim {
  listing_title?: string;
  listing_latitude?: number;
  listing_longitude?: number;
  donor_name?: string;
  donor_phone?: string;
}

export default function ClaimTracking() {
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();
  const { addToast } = useNotifications();
  const [claim, setClaim] = useState<ExtendedClaim | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [donorLocation, setDonorLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch claim data
  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await api.get('/claims/my');
        const found = res.data.data.find((c: ExtendedClaim) => c.id === claimId);
        if (found) {
          setClaim(found);
          if (found.listing_latitude && found.listing_longitude) {
            setDonorLocation({ lat: found.listing_latitude, lng: found.listing_longitude });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaim();
  }, [claimId]);

  // Watch user location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);

        // Send location via socket
        const socket = getSocket();
        if (socket && claimId) {
          socket.emit('location_update', {
            userId: claim?.receiver_id,
            claimId,
            latitude: loc.lat,
            longitude: loc.lng,
          });
        }
      },
      () => setUserLocation({ lat: 33.6844, lng: 73.0479 }),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [claimId, claim?.receiver_id]);

  // Listen for donor location updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !claimId) return;

    socket.emit('join_claim', claimId);

    socket.on('location_updated', (data: { userId: string; latitude: number; longitude: number }) => {
      if (data.userId !== claim?.receiver_id) {
        setDonorLocation({ lat: data.latitude, lng: data.longitude });
      }
    });

    return () => {
      socket.off('location_updated');
    };
  }, [claimId, claim?.receiver_id]);

  const notifyArrival = async () => {
    if (!claimId) return;
    try {
      await api.put(`/claims/${claimId}/arrived`);
      addToast('Donor Notified! 📍', 'They know you have arrived.', 'success');
    } catch (err: any) {
      addToast('Error', err.response?.data?.error || 'Failed', 'error');
    }
  };

  const openExternalNav = () => {
    if (!donorLocation) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${donorLocation.lat},${donorLocation.lng}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Claim not found.</p>
        <button onClick={() => navigate('/receiver/claims')} className="btn-secondary mt-4">
          Back to Claims
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-3.5rem)] md:h-screen">
      {/* Map */}
      <MapView
        userLocation={userLocation}
        otherUserLocation={donorLocation}
        showRoute={true}
        className="w-full h-full"
      />

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 flex items-center gap-3">
          <button onClick={() => navigate('/receiver/claims')} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h3 className="font-bold text-sm">{claim.listing_title}</h3>
            <p className="text-xs text-gray-500">Navigate to pickup location</p>
          </div>
          {claim.expires_at && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Time left</p>
              <TimerDisplay expiresAt={claim.expires_at} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl shadow-2xl p-5">
          {/* Pickup code */}
          <div className="bg-green-50 rounded-xl p-3 mb-4 text-center">
            <p className="text-xs text-green-600">Pickup Code</p>
            <p className="text-2xl font-mono font-bold text-green-800 tracking-widest">{claim.pickup_code}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-2.5 text-center">
              <p className="text-xs text-gray-500">Donor</p>
              <p className="font-semibold text-sm truncate">{claim.donor_name}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-2.5 text-center">
              <p className="text-xs text-gray-500">Distance</p>
              <p className="font-semibold text-sm">
                {userLocation && donorLocation
                  ? formatDistance(userLocation.lat, userLocation.lng, donorLocation.lat, donorLocation.lng)
                  : '—'}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl p-3 mb-4">
            <p className="text-xs text-blue-800 text-center">
              📍 <strong>When you arrive:</strong> Tap "I've Arrived" to notify the donor. No need to call or ring the doorbell!
            </p>
          </div>

          <div className="space-y-2">
            {/* Primary Arrival Button */}
            <button 
              onClick={notifyArrival} 
              className="w-full btn-primary py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <MapPin className="w-5 h-5" /> I've Arrived - Notify Donor
            </button>
            
            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={openExternalNav} className="btn-secondary py-2.5 text-sm flex items-center justify-center gap-1">
                <Navigation className="w-4 h-4" /> Navigate
              </button>
              {claim.donor_phone && (
                <a href={`tel:${claim.donor_phone}`} className="btn-secondary py-2.5 text-sm flex items-center justify-center gap-1">
                  <Phone className="w-4 h-4" /> Call
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimerDisplay({ expiresAt }: { expiresAt: string }) {
  const [time, setTime] = useState(getPickupTimeRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getPickupTimeRemaining(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return <span className="font-mono font-bold text-amber-600 text-sm">{time}</span>;
}
