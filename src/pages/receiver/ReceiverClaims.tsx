import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../lib/translations';
import { Clock, MapPin, Star, X, Navigation } from 'lucide-react';
import { formatTimeAgo, getPickupTimeRemaining } from '../../lib/utils';
import type { Claim } from '../../../shared/types';

interface ExtendedClaim extends Claim {
  listing_title?: string;
  listing_latitude?: number;
  listing_longitude?: number;
  donor_name?: string;
  donor_phone?: string;
}

export default function ReceiverClaims() {
  const [claims, setClaims] = useState<ExtendedClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingClaim, setRatingClaim] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { addToast } = useNotifications();
  const { lang } = useLanguage();

  const fetchClaims = async () => {
    try {
      const res = await api.get('/claims/my');
      setClaims(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
    const interval = setInterval(fetchClaims, 15000);
    return () => clearInterval(interval);
  }, []);

  const cancelClaim = async (id: string) => {
    if (!confirm(t('rcCancelConfirm', lang))) return;
    try {
      await api.put(`/claims/${id}/cancel`);
      addToast(t('rcCancelled', lang).split('.')[0], t('rcCancelled', lang), 'info');
      fetchClaims();
    } catch (err: any) {
      addToast(t('error', lang), err.response?.data?.error || t('rcFailedCancel', lang), 'error');
    }
  };

  const notifyArrival = async (id: string) => {
    try {
      await api.put(`/claims/${id}/arrived`);
      addToast(t('rcDonorNotified', lang).split('.')[0], t('rcDonorNotified', lang), 'success');
    } catch (err: any) {
      addToast(t('error', lang), err.response?.data?.error || t('rcFailedNotify', lang), 'error');
    }
  };

  const submitRating = async (claimId: string) => {
    try {
      await api.post('/ratings', { claim_id: claimId, rating, comment: comment || undefined });
      addToast(t('rcThankYouRating', lang).split('.')[0], t('rcThankYouRating', lang), 'success');
      setRatingClaim(null);
      setRating(5);
      setComment('');
      fetchClaims();
    } catch (err: any) {
      addToast(t('error', lang), err.response?.data?.error || t('rcFailedRate', lang), 'error');
    }
  };

  const active = claims.filter((c) => ['pending', 'accepted'].includes(c.status));
  const completed = claims.filter((c) => c.status === 'picked_up');
  const other = claims.filter((c) => ['rejected', 'cancelled', 'expired'].includes(c.status));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-warmOrange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('rcTitle', lang)} 🙋</h1>
      <p className="text-gray-500 mb-6">{t('rcTrack', lang)}</p>

      {/* Active claims */}
      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-primary-600 mb-4">{t('rcActive', lang)} ({active.length})</h2>
          <div className="space-y-4">
            {active.map((claim) => (
              <div key={claim.id} className={`card border-l-4 ${claim.status === 'accepted' ? 'border-l-green-500' : 'border-l-amber-400'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{claim.listing_title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        claim.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {claim.status === 'pending' ? t('rcWaitingDonor', lang) : t('rcAccepted', lang)}
                      </span>
                    </div>
                    {claim.donor_name && (
                      <p className="text-sm text-gray-500 mt-1">{t('rcDonor', lang, { name: claim.donor_name })}</p>
                    )}
                  </div>
                  <button
                    onClick={() => cancelClaim(claim.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title={t('cancel', lang)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {claim.status === 'accepted' && (
                  <>
                    {/* Pickup code */}
                    <div className="bg-green-50 rounded-xl p-4 mb-3 text-center">
                      <p className="text-sm text-green-700 mb-1">{t('rcPickupCode', lang)}</p>
                      <p className="text-3xl font-mono font-bold text-green-800 tracking-widest">
                        {claim.pickup_code}
                      </p>
                      <p className="text-xs text-green-600 mt-1">{t('rcShowCode', lang)}</p>
                    </div>

                    {/* Timer */}
                    {claim.expires_at && (
                      <div className="flex items-center justify-center gap-2 text-amber-600 mb-3">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('rcTimeRemaining', lang)} </span>
                        <TimerDisplay expiresAt={claim.expires_at} lang={lang} />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => notifyArrival(claim.id)}
                        className="btn-primary py-2.5 text-sm flex items-center justify-center gap-1"
                      >
                        <MapPin className="w-4 h-4" /> {t('rcIveArrived', lang)}
                      </button>
                      <Link
                        to={`/receiver/tracking/${claim.id}`}
                        className="btn-secondary py-2.5 text-sm flex items-center justify-center gap-1"
                      >
                        <Navigation className="w-4 h-4" /> {t('rcNavigate', lang)}
                      </Link>
                    </div>
                  </>
                )}

                {claim.status === 'pending' && (
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <div className="animate-pulse text-amber-600 text-sm">
                      ⏳ {t('rcWaitingAccept', lang)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-green-600 mb-4">{t('rcCompleted', lang)} ({completed.length})</h2>
          <div className="space-y-3">
            {completed.map((claim) => (
              <div key={claim.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{claim.listing_title}</p>
                    <p className="text-xs text-gray-500">
                      {claim.donor_name} · {formatTimeAgo(claim.picked_up_at || claim.created_at, lang)}
                    </p>
                  </div>
                  <button
                    onClick={() => setRatingClaim(claim.id)}
                    className="flex items-center gap-1 text-sm text-amber-500 hover:text-amber-600 font-semibold"
                  >
                    <Star className="w-4 h-4" /> {t('rcRate', lang)}
                  </button>
                </div>

                {ratingClaim === claim.id && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4 animate-slide-up">
                    <p className="text-sm font-medium text-gray-700 mb-3">{t('rcRateExperience', lang)}</p>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'opacity-100' : 'opacity-30'}`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="input-field text-sm mb-3"
                      rows={2}
                      placeholder={t('rcOptionalComment', lang)}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => submitRating(claim.id)} className="btn-primary py-2 text-sm flex-1">
                        {t('rcSubmitRating', lang)}
                      </button>
                      <button onClick={() => setRatingClaim(null)} className="btn-secondary py-2 text-sm">
                        {t('cancel', lang)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other */}
      {other.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-400 mb-4">{t('rcPast', lang)} ({other.length})</h2>
          <div className="space-y-2">
            {other.map((claim) => (
              <div key={claim.id} className="card py-3 opacity-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{claim.listing_title}</p>
                  <span className="text-xs text-gray-400">{claim.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {claims.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-900">{t('rcNoClaims', lang)}</h3>
          <p className="text-gray-500 mt-1">{t('rcFindNearby', lang)}</p>
          <Link to="/receiver" className="btn-orange mt-4 inline-flex items-center gap-2">
            <MapPin className="w-5 h-5" /> {t('rcOpenMap', lang)}
          </Link>
        </div>
      )}
    </div>
  );
}

function TimerDisplay({ expiresAt, lang }: { expiresAt: string; lang: 'en' | 'ur' }) {
  const [time, setTime] = useState(getPickupTimeRemaining(expiresAt, lang));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getPickupTimeRemaining(expiresAt, lang));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, lang]);

  return <span className="font-mono font-bold">{time}</span>;
}
