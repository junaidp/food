import { X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-enter rounded-xl p-4 shadow-lg border flex items-start gap-3 ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">{toast.title}</p>
            <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
