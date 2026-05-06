import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useNotifications } from '../../context/NotificationContext';
import { Check, X, KeyRound, AlertTriangle, Clock, User, Phone } from 'lucide-react';
import { formatTimeAgo, getPickupTimeRemaining } from '../../lib/utils';
import type { Claim } from '../../../shared/types';

interface ExtendedClaim extends Claim {
  receiver_name?: string;
  receiver_phone?: string;
  listing_title?: string;
  receiver_lat?: number;
  receiver_lng?: number;
}

export default function DonorClaims() {
  const [claims, setClaims] = useState<ExtendedClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickupCode, setPickupCode] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const { addToast } = useNotifications();

  const fetchClaims = async () => {
    try {
      const res = await api.get('/claims/incoming');
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

  const acceptClaim = async (id: string) => {
    try {
      await api.put(`/claims/${id}/accept`);
      addToast('Accepted!', 'Request accepted. Receiver has been notified.', 'success');
      fetchClaims();
    } catch (err: any) {
      addToast('Error', err.response?.data?.error || 'Failed to accept', 'error');
    }
  };

  const rejectClaim = async (id: string) => {
    try {
      await api.put(`/claims/${id}/reject`);
      addToast('Rejected', 'Request has been rejected.', 'info');
      fetchClaims();
    } catch (err: any) {
      addToast('Error', err.response?.data?.error || 'Failed to reject', 'error');
    }
  };

  const confirmPickup = async (id: string) => {
    try {
      await api.put(`/claims/${id}/pickup`, { code: pickupCode });
      addToast('Pickup Confirmed! 🎉', 'Food has been picked up successfully.', 'success');
      setConfirmingId(null);
      setPickupCode('');
      fetchClaims();
    } catch (err: any) {
      addToast('Error', err.response?.data?.error || 'Invalid code', 'error');
    }
  };

  const reportUser = async (userId: string) => {
    const reason = prompt('Please describe the issue:');
    if (!reason) return;
    try {
      await api.post('/reports', { reported_user_id: userId, reason });
      addToast('Reported', 'Report submitted to admin.', 'info');
    } catch {
      addToast('Error', 'Failed to submit report', 'error');
    }
  };

  const blockUser = async (userId: string) => {
    if (!confirm('Block this receiver? They won\'t see your listings anymore.')) return;
    try {
      await api.post('/reports/block', { blocked_id: userId });
      addToast('Blocked', 'User has been blocked.', 'info');
    } catch {
      addToast('Error', 'Failed to block user', 'error');
    }
  };

  const pending = claims.filter((c) => c.status === 'pending');
  const accepted = claims.filter((c) => c.status === 'accepted');
  const completed = claims.filter((c) => ['picked_up', 'rejected', 'cancelled', 'expired'].includes(c.status));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Food Requests 📋</h1>
      <p className="text-gray-500 mb-6">Manage incoming food requests</p>

      {/* Pending */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-warmOrange-600 mb-4 flex items-center gap-2">
            🔔 Pending Requests ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((claim) => (
              <div key={claim.id} className="card border-l-4 border-l-warmOrange-400 animate-slide-up">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{claim.listing_title}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {claim.receiver_name}</span>
                      <span>{formatTimeAgo(claim.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => acceptClaim(claim.id)} className="p-2.5 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-colors" title="Accept">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={() => rejectClaim(claim.id)} className="p-2.5 rounded-xl bg-red-100 text-red-500 hover:bg-red-200 transition-colors" title="Reject">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Accepted (waiting for pickup) */}
      {accepted.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
            ✅ Accepted - Awaiting Pickup ({accepted.length})
          </h2>
          <div className="space-y-3">
            {accepted.map((claim) => (
              <div key={claim.id} className="card border-l-4 border-l-green-500">
                <div className="mb-3">
                  <p className="font-bold text-gray-900">{claim.listing_title}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {claim.receiver_name}</span>
                    {claim.receiver_phone && (
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {claim.receiver_phone}</span>
                    )}
                  </div>
                  {claim.expires_at && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-amber-600">
                      <Clock className="w-3.5 h-3.5" />
                      <TimerDisplay expiresAt={claim.expires_at} />
                    </div>
                  )}
                </div>

                {/* Pickup code verification */}
                {confirmingId === claim.id ? (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Enter receiver's pickup code:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pickupCode}
                        onChange={(e) => setPickupCode(e.target.value)}
                        className="input-field text-center text-lg tracking-widest font-mono"
                        placeholder="123456"
                        maxLength={6}
                      />
                      <button onClick={() => confirmPickup(claim.id)} className="btn-primary px-6" disabled={pickupCode.length !== 6}>
                        Confirm
                      </button>
                      <button onClick={() => { setConfirmingId(null); setPickupCode(''); }} className="btn-secondary px-4">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmingId(claim.id)} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
                      <KeyRound className="w-4 h-4" /> Verify Pickup Code
                    </button>
                    <button onClick={() => reportUser(claim.receiver_id)} className="btn-secondary py-2.5 px-3" title="Report">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-400 mb-4">Past Requests ({completed.length})</h2>
          <div className="space-y-2">
            {completed.slice(0, 10).map((claim) => (
              <div key={claim.id} className="card py-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">{claim.listing_title}</p>
                    <p className="text-xs text-gray-400">{claim.receiver_name} · {formatTimeAgo(claim.created_at)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    claim.status === 'picked_up' ? 'bg-green-100 text-green-700' :
                    claim.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {claim.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {claims.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-900">No requests yet</h3>
          <p className="text-gray-500 mt-1">When someone requests your food, it will appear here.</p>
        </div>
      )}
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

  return <span className="font-mono font-semibold">{time}</span>;
}
