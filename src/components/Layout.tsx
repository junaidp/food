import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Home, PlusCircle, ClipboardList, MapPin, Bell,
  User, LogOut, Shield, Users, AlertTriangle, UtensilsCrossed
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const donorNav = [
    { path: '/donor', icon: Home, label: 'Dashboard' },
    { path: '/donor/create', icon: PlusCircle, label: 'Add Food' },
    { path: '/donor/claims', icon: ClipboardList, label: 'Requests' },
  ];

  const receiverNav = [
    { path: '/receiver', icon: MapPin, label: 'Find Food' },
    { path: '/receiver/claims', icon: ClipboardList, label: 'My Claims' },
  ];

  const adminNav = [
    { path: '/admin', icon: Shield, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/listings', icon: UtensilsCrossed, label: 'Listings' },
    { path: '/admin/reports', icon: AlertTriangle, label: 'Reports' },
  ];

  const navItems = user.role === 'donor' ? donorNav : user.role === 'receiver' ? receiverNav : adminNav;

  const roleIcon = user.role === 'donor' ? '🥗' : user.role === 'receiver' ? '🙋' : '🛡️';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pl-64">
      {/* Top bar (mobile) */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{roleIcon}</span>
            <h1 className="text-lg font-bold text-gray-900">FoodShare</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative p-2">
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="p-2">
              <User className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex-col z-40">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{roleIcon}</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FoodShare</h1>
              <p className="text-sm text-gray-500 capitalize">{user.role} Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}

          <Link
            to="/notifications"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive('/notifications')
                ? 'bg-primary-50 text-primary-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            Notifications
          </Link>

          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive('/profile')
                ? 'bg-primary-50 text-primary-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500">{user.phone}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="mt-14 md:mt-0 min-h-screen">
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-lg ${
                isActive(item.path) ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
