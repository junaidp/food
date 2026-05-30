import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../lib/translations';
import { Trash2, Clock, MapPin, User } from 'lucide-react';
import { formatTimeAgo, formatExpiry } from '../../lib/utils';
import type { FoodListing } from '../../../shared/types';

interface AdminListing extends FoodListing {
  donor_name?: string;
  donor_phone?: string;
}

export default function AdminListings() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotifications();
  const { lang } = useLanguage();

  const fetchListings = async () => {
    try {
      const res = await api.get('/admin/listings');
      setListings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const deleteListing = async (id: string) => {
    if (!confirm(t('adminDeleteConfirm', lang))) return;
    try {
      await api.delete(`/admin/listings/${id}`);
      addToast(t('adminDeleted', lang), t('adminListingRemoved', lang), 'success');
      fetchListings();
    } catch {
      addToast(t('error', lang), t('adminFailedDelete', lang), 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('adminAllListings', lang)}</h1>

      {listings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">{t('adminNoListingsFound', lang)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div key={listing.id} className={`card flex items-start gap-4 ${
              listing.status !== 'active' ? 'opacity-60' : ''
            }`}>
              <div className="relative flex-shrink-0">
                <span className="text-3xl">🍽️</span>
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {listing.remaining_quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 truncate">{listing.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    listing.status === 'active' ? 'bg-green-100 text-green-700' :
                    listing.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    listing.status === 'expired' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {t('status' + listing.status.charAt(0).toUpperCase() + listing.status.slice(1), lang)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {listing.donor_name}</span>
                  <span>{listing.remaining_quantity}/{listing.quantity} {t('donorServings', lang)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatExpiry(listing.expires_at, lang)}</span>
                  <span>{formatTimeAgo(listing.created_at, lang)}</span>
                  {listing.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {listing.address}</span>}
                </div>
              </div>

              <button
                onClick={() => deleteListing(listing.id)}
                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex-shrink-0"
                title={t('delete', lang)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
