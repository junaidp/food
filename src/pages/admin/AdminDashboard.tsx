import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Users, UtensilsCrossed, ClipboardList, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { AdminStats } from '../../../shared/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!stats) return <p className="p-8 text-gray-500">Failed to load stats.</p>;

  const cards = [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'bg-blue-100 text-blue-600', link: '/admin/users' },
    { label: 'Donors', value: stats.total_donors, icon: UtensilsCrossed, color: 'bg-green-100 text-green-600' },
    { label: 'Receivers', value: stats.total_receivers, icon: Users, color: 'bg-warmOrange-100 text-warmOrange-600' },
    { label: 'Total Listings', value: stats.total_listings, icon: ClipboardList, color: 'bg-purple-100 text-purple-600', link: '/admin/listings' },
    { label: 'Active Listings', value: stats.active_listings, icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Total Claims', value: stats.total_claims, icon: ClipboardList, color: 'bg-cyan-100 text-cyan-600' },
    { label: 'Completed Pickups', value: stats.completed_claims, icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
    { label: 'Pending Reports', value: stats.pending_reports, icon: AlertTriangle, color: 'bg-red-100 text-red-600', link: '/admin/reports' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard 🛡️</h1>
      <p className="text-gray-500 mb-8">Overview of FoodShare platform</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const content = (
            <div key={card.label} className="card hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          );
          return card.link ? <Link to={card.link} key={card.label}>{content}</Link> : <div key={card.label}>{content}</div>;
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Link to="/admin/users" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-500">Verify, block, or review users</p>
          </div>
        </Link>
        <Link to="/admin/reports" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Handle Reports</h3>
            <p className="text-sm text-gray-500">{stats.pending_reports} pending reports</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
