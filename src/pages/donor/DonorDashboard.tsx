import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../lib/translations';
import { PlusCircle, Eye, EyeOff, Trash2, Clock, Users, ChefHat } from 'lucide-react';
import { formatExpiry, formatTimeAgo } from '../../lib/utils';
import type { FoodListing } from '../../../shared/types';

export default function DonorDashboard() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [listings, setListings] = useState<(FoodListing & { pending_claims?: number; active_claims?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await api.get('/listings/my');
      setListings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const toggleListing = async (id: string) => {
    try {
      await api.put(`/listings/${id}/toggle`);
      fetchListings();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm(t('donorDeleteConfirm', lang))) return;
    try {
      await api.delete(`/listings/${id}`);
      fetchListings();
    } catch (err) {
      console.error(err);
    }
  };

  const activeCount = listings.filter((l) => l.status === 'active').length;
  const totalServed = listings.reduce(
    (acc, l) => acc + (l.quantity - l.remaining_quantity),
    0
  );

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('donorWelcome', lang, { name: user?.name || '' })} 🥗
        </h1>
        <p className="text-gray-500 mt-1">{t('donorManageListings', lang)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <ChefHat className="w-6 h-6 text-primary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
          <p className="text-xs text-gray-500">{t('donorTotalListings', lang)}</p>
        </div>
        <div className="card text-center">
          <Eye className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
          <p className="text-xs text-gray-500">{t('donorActiveNow', lang)}</p>
        </div>
        <div className="card text-center">
          <Users className="w-6 h-6 text-warmOrange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalServed}</p>
          <p className="text-xs text-gray-500">{t('donorPeopleServed', lang)}</p>
        </div>
      </div>

      {/* Add button */}
      <Link
        to="/donor/create"
        className="btn-primary w-full flex items-center justify-center gap-2 mb-8"
      >
        <PlusCircle className="w-5 h-5" />
        {t('donorAddListing', lang)}
      </Link>

      {/* Listings */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : listings.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold text-gray-900">{t('donorNoListings', lang)}</h3>
          <p className="text-gray-500 mt-1">{t('donorStartSharing', lang)}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className={`card transition-all ${
                listing.is_available && listing.status === 'active'
                  ? 'border-l-4 border-l-green-500'
                  : 'border-l-4 border-l-gray-300 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{listing.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        listing.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : listing.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : listing.status === 'expired'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t('status' + listing.status.charAt(0).toUpperCase() + listing.status.slice(1), lang)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      🍽️ <strong>{listing.remaining_quantity}</strong>/{listing.quantity} {t('donorServings', lang)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatExpiry(listing.expires_at, lang)}
                    </span>
                    <span>{formatTimeAgo(listing.created_at, lang)}</span>
                  </div>

                  {(listing.pending_claims && listing.pending_claims > 0) ? (
                    <Link
                      to="/donor/claims"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-warmOrange-600 font-semibold hover:underline"
                    >
                      🔔 {t('donorPendingRequests', lang, { count: listing.pending_claims })}
                    </Link>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleListing(listing.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      listing.is_available
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={listing.is_available ? t('donorTurnOff', lang) : t('donorTurnOn', lang)}
                  >
                    {listing.is_available ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => deleteListing(listing.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    title={t('delete', lang)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
