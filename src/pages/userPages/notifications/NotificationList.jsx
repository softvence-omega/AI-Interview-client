import React, { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import useApi from '../../../hook/apiHook';

const NotificationList = () => {
  const { user } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  useEffect(() => {
    let intervalId;
  
    const fetchNotifications = async (showLoading = true) => {
      if (!user?.approvalToken) {
        toast.error('You must be logged in to view notifications.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }
  
      if (showLoading) setLoading(true);
  
      try {
        const res = await request({
          endpoint: '/notifications/getAllNotifications',
          method: 'GET',
          headers: {
            Authorization: user.approvalToken,
          },
        });
  
        if (res.ok) {
          setNotifications(res.data.data.notificationList || []);
          setError(null);
        } else {
          setError(res.message || 'Failed to fetch notifications.');
          toast.error(res.message || 'Failed to fetch notifications.');
        }
      } catch (err) {
        setError('Error fetching notifications.');
        toast.error('Error fetching notifications.');
        console.error('Fetch notifications error:', err);
      } finally {
        if (showLoading) setLoading(false);
      }
    };
  
    fetchNotifications(); // Initial load with loading
  
    // Auto-refetch every 30 seconds, no loading UI
    intervalId = setInterval(() => {
      fetchNotifications(false);
    }, 3000);
  
    return () => clearInterval(intervalId);
  }, [user?.approvalToken, navigate]);
  

  const handleNotificationClick = async (notificationId) => {
    if (selectedNotificationId === notificationId) {
      setSelectedNotificationId(null); // Close dropdown if clicked again
      return;
    }

    setSelectedNotificationId(notificationId);

    try {
      const res = await request({
        endpoint: `/notifications/viewSpecificNotification?notification_id=${notificationId}`,
        method: 'GET',
        headers: {
          Authorization: user.approvalToken,
        },
      });

      if (res.ok) {
        // Update the notification's isSeen status locally
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, isSeen: true } : notif
          )
        );
      } else {
        toast.error(res.message || 'Failed to mark notification as seen.');
      }
    } catch (err) {
      toast.error('Error marking notification as seen.');
      console.error('View notification error:', err);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="w-full max-w-[1444px] mx-auto md:p-6 lg:p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#37B874]">Notifications</h2>
      {loading ? (
        <div className="flex justify-center">
          <LoaderCircle className="animate-spin w-8 h-8 text-gray-600" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-600">No notifications available.</p>
      ) : (


<div className="space-y-2">
  {notifications.map((notification) => (
    <div key={notification._id} className="relative">
      <div
        onClick={() => handleNotificationClick(notification._id)}
        className={`p-4 rounded-lg shadow-md bg-[#37B874] flex items-start cursor-pointer hover:bg-gray-50 hover:text-[#37B874] transition-colors ${
          notification.isSeen ? 'opacity-75' : 'font-semibold'
        }`}
      >
        <div className="flex-1">
          <p className="font-medium">
            {truncateText(notification.notificationDetail, 50)}
          </p>
          <p className="text-sm mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            notification.isSeen ? 'bg-gray-200 text-gray-600' : 'bg-red-600 text-white'
          }`}
        >
          {notification.isSeen ? 'Seen' : 'New'}
        </span>
      </div>

      <div
        className={` bg-gray-100 rounded-lg shadow-inner transition-all duration-[1000ms] ease-in-out ${
          selectedNotificationId === notification._id ? 'opacity-100 max-h-96 p-4' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        <p className="text-gray-900">{notification.notificationDetail}</p>
        <p className="text-sm text-gray-400 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      
    </div>
  ))}
</div>



      )}
    </div>
  );
};

export default NotificationList;