import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationsAPI } from '../../services/api';
import MaterialIcon from '../common/MaterialIcon';
import Button from '../common/Button';

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getNotifications({ limit: 50 });
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      await loadNotifications();
      // Trigger event to update Header unread count
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      await loadNotifications();
      // Trigger event to update Header unread count
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      await loadNotifications();
      // Trigger event to update Header unread count
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-layout-lg">
      <div className="flex items-center justify-between">
        <div className="flex gap-layout-xs items-center text-heading3 font-semibold font-display">
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <div>
              ({unreadCount})
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-caption text-black hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-body1">No notifications</p>
        </div>
      ) : (
        <div className="flex flex-col gap-layout-normal">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-layout-sm rounded-xl ${
                notification.read
                  ? 'bg-gray-50'
                  : 'bg-secondary'
              }`}
            >
              <div className="flex flex-col items-start gap-layout-xs">
                <div className="flex items-center justify-between w-full">
                  <h3 className="font-semibold text-body2 truncate mr-2">{notification.title}</h3>
                  <div className="flex items-center gap-layout-xs">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-overline text-info-bg hover:opacity-90"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className=" text-red hover:opacity-90"
                    >
                      <MaterialIcon icon="delete" size={24} />
                    </button>
                  </div>

                </div>

                <div className="flex-1 w-full">
                  <p className="text-caption text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-overline text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {notification.relatedId && notification.relatedModel === 'Order' && (
                      <Link
                        to={`/orders/${notification.relatedId}`}
                      >
                        <Button size="sm" variant="text" className="text-caption">
                          View Order
                          <MaterialIcon icon="arrow_forward" size={16} />
                        </Button>
                      </Link>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;

