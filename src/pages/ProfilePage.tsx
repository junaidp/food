import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../lib/api';
import { User, Phone, Star, Shield, LogOut, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { addToast } = useNotifications();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [ratings, setRatings] = useState<{ average: number; total: number }>({ average: 0, total: 0 });

  useEffect(() => {
    if (!user) return;
    api.get(`/ratings/user/${user.id}`).then((res) => {
      setRatings({ average: res.data.data.average, total: res.data.data.total });
    }).catch(() => {});
  }, [user]);

  const saveName = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', { name });
      updateUser(res.data.data);
      addToast('Saved', 'Profile updated.', 'success');
    } catch {
      addToast('Error', 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const roleEmoji = user.role === 'donor' ? '🥗' : user.role === 'receiver' ? '🙋' : '🛡️';

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      {/* Avatar & Role */}
      <div className="card text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-4xl mx-auto mb-3">
          {roleEmoji}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
        <p className="text-gray-500 capitalize">{user.role}</p>

        <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{ratings.average || '—'}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1"><Star className="w-3 h-3" /> Rating</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{ratings.total}</p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{user.is_verified ? '✅' : '⏳'}</p>
            <p className="text-xs text-gray-500">Verified</p>
          </div>
        </div>
      </div>

      {/* Edit name */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Edit Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-11"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={user.phone} disabled className="input-field pl-11 bg-gray-50 text-gray-500" />
            </div>
          </div>
          <button
            onClick={saveName}
            disabled={saving || name === user.name}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <><Save className="w-5 h-5" /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="btn-danger w-full flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>

      <p className="text-center text-xs text-gray-400 mt-8">
        FoodShare v1.0 · Islamabad Food Charity Initiative
      </p>
    </div>
  );
}
