import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useNotifications } from '../../context/NotificationContext';
import MapView from '../../components/MapView';
import { MapPin, Clock, User, Navigation, X } from 'lucide-react';
import { formatDistance, formatExpiry } from '../../lib/utils';
import type { FoodListing } from '../../../shared/types';

export default function ReceiverMap() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [selected, setSelected] = useState<FoodListing | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const { addToast } = useNotifications();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 33.6844, lng: 73.0479 }),
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/listings');
      setListings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    const interval = setInterval(fetchListings, 20000);
    return () => clearInterval(interval);
  }, []);

  const claimFood = async (listingId: string) => {
    setClaiming(true);
    try {
      await api.post('/claims', { listing_id: listingId });
      addToast('Request Sent! 🙏', 'The donor has been notified. Please wait for acceptance.', 'success');
      setSelected(null);
      fetchListings();
    } catch (err: any) {
      addToast('Error', err.response?.data?.error || 'Failed to claim food', 'error');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-3.5rem)] md:h-screen">
      {/* Map */}
      <MapView
        listings={listings}
        userLocation={userLocation}
        onListingClick={(listing) => setSelected(listing)}
        className="w-full h-full"
      />

      {/* Top overlay - count */}
      <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg pointer-events-auto">
          <MapPin className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-semibold">
            {loading ? 'Loading...' : `${listings.length} food available nearby`}
          </span>
        </div>
      </div>

      {/* Listings bottom sheet */}
      {!selected && listings.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl shadow-2xl border-t border-gray-100 p-4 max-h-[35vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
            <div className="space-y-2">
              {listings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => setSelected(listing)}
                  className="w-full text-left bg-white rounded-xl p-3 border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="text-2xl">🍽️</span>
                        <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {listing.remaining_quantity}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{listing.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          {listing.donor_name && <span>By {listing.donor_name}</span>}
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {formatExpiry(listing.expires_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {userLocation && (
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                        {formatDistance(userLocation.lat, userLocation.lng, listing.latitude, listing.longitude)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected listing detail panel */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 z-20 animate-slide-up">
          <div className="bg-white rounded-t-2xl shadow-2xl border-t border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-4xl">🍽️</span>
                  <span className="absolute -top-1 -right-2 bg-primary-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow">
                    {selected.remaining_quantity}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selected.title}</h3>
                  <p className="text-sm text-gray-500">
                    {selected.remaining_quantity} serving{selected.remaining_quantity !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {selected.donor_name && (
                <div className="text-center p-2 bg-gray-50 rounded-xl">
                  <User className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Donor</p>
                  <p className="text-sm font-semibold truncate">{selected.donor_name}</p>
                </div>
              )}
              <div className="text-center p-2 bg-gray-50 rounded-xl">
                <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Expires</p>
                <p className="text-sm font-semibold">{formatExpiry(selected.expires_at)}</p>
              </div>
              {userLocation && (
                <div className="text-center p-2 bg-gray-50 rounded-xl">
                  <Navigation className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Distance</p>
                  <p className="text-sm font-semibold">
                    {formatDistance(userLocation.lat, userLocation.lng, selected.latitude, selected.longitude)}
                  </p>
                </div>
              )}
            </div>

            {selected.description && (
              <p className="text-sm text-gray-600 mb-4">{selected.description}</p>
            )}
            {selected.address && (
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {selected.address}
              </p>
            )}

            <button
              onClick={() => claimFood(selected.id)}
              disabled={claiming}
              className="btn-orange w-full flex items-center justify-center gap-2 text-lg py-4"
            >
              {claiming ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                '🙋 Request This Food'
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              One person, one serving. The donor will be notified immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
