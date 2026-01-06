import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { X } from 'lucide-react';


export const NotificationCenter: React.FC = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    state.notifications.forEach(notification => {
      const timer = setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, [state.notifications, dispatch]);

  if (state.notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {state.notifications.map(notification => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
            notification.type === 'success' ? 'bg-green-600' :
            notification.type === 'error' ? 'bg-red-600' :
            'bg-blue-600'
          }`}
        >
          <span className="text-white text-sm">{notification.message}</span>
          <button
            onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })}
            className="text-white hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};