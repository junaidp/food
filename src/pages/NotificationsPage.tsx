import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { formatTimeAgo } from '../lib/utils';

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'claim_request': return '🔔';
      case 'claim_accepted': return '✅';
      case 'claim_rejected': return '❌';
      case 'receiver_arrived': return '📍';
      case 'pickup_confirmed': return '🎉';
      case 'listing_expired': return '⏰';
      case 'new_rating': return '⭐';
      default: return '📢';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn-secondary py-2 px-4 text-sm flex items-center gap-1">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No notifications yet</h3>
          <p className="text-gray-500 mt-1">You'll receive updates about your food activities here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`card py-4 cursor-pointer transition-all hover:shadow-md ${
                !n.is_read ? 'bg-blue-50/50 border-l-4 border-l-primary-500' : ''
              }`}
              onClick={() => !n.is_read && markAsRead(n.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{getIcon(n.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!n.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {n.title}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatTimeAgo(n.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                </div>
                {!n.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
