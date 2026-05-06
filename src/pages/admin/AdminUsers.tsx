import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useNotifications } from '../../context/NotificationContext';
import { Shield, ShieldOff, UserCheck, UserX, Star, Search } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils';

interface AdminUser {
  id: string;
  phone: string;
  name: string;
  role: string;
  is_verified: boolean;
  is_blocked: boolean;
  created_at: string;
  avg_rating: number | null;
  rating_count: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { addToast } = useNotifications();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleVerify = async (id: string) => {
    try {
      await api.put(`/admin/users/${id}/verify`);
      addToast('Updated', 'User verification toggled.', 'success');
      fetchUsers();
    } catch {
      addToast('Error', 'Failed to update user.', 'error');
    }
  };

  const toggleBlock = async (id: string) => {
    try {
      await api.put(`/admin/users/${id}/block`);
      addToast('Updated', 'User block status toggled.', 'success');
      fetchUsers();
    } catch {
      addToast('Error', 'Failed to update user.', 'error');
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
            placeholder="Search by name or phone..."
          />
        </div>
        <div className="flex gap-2">
          {['all', 'donor', 'receiver', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                roleFilter === r ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users list */}
      <div className="space-y-3">
        {filtered.map((u) => (
          <div key={u.id} className={`card flex items-center gap-4 ${u.is_blocked ? 'opacity-50' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
              u.role === 'donor' ? 'bg-green-100 text-green-700' :
              u.role === 'receiver' ? 'bg-warmOrange-100 text-warmOrange-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {u.role === 'donor' ? '🥗' : u.role === 'receiver' ? '🙋' : '🛡️'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                {u.is_verified && <span className="text-green-500 text-xs">✅</span>}
                {u.is_blocked && <span className="text-red-500 text-xs font-medium">BLOCKED</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{u.phone}</span>
                <span className="capitalize">{u.role}</span>
                {u.avg_rating && (
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-500" /> {u.avg_rating} ({u.rating_count})
                  </span>
                )}
                <span>{formatTimeAgo(u.created_at)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleVerify(u.id)}
                className={`p-2 rounded-lg transition-colors ${
                  u.is_verified ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title={u.is_verified ? 'Unverify' : 'Verify'}
              >
                {u.is_verified ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => toggleBlock(u.id)}
                className={`p-2 rounded-lg transition-colors ${
                  u.is_blocked ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title={u.is_blocked ? 'Unblock' : 'Block'}
              >
                {u.is_blocked ? <ShieldOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-gray-500">No users found.</p>
        </div>
      )}
    </div>
  );
}
