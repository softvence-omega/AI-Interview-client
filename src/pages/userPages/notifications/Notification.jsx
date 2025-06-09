import React, { useState, useEffect } from 'react';

import { Bell, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import useApi from "../../../hook/apiHook"

const Notification = () => {
  const { user } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(null);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("just to remove the red line",notifications)
  console.log(loading, error)

  const fetchNotifications = async () => {
    if (!user?.approvalToken) {
      toast.error('You must be logged in to view notifications.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setLoading(true);
    try {
      const res = await request({
        endpoint: '/notifications/getNotificationForNotificationBell',
        method: 'GET',
        headers: {
          Authorization: user.approvalToken,
        },
      });

      if (res.ok) {
        console.log("Notification fetched successfully:",res.data.data)
        setNotifications(res.data.data.notifications || []);
        setNewNotificationCount(res.data.data.newNotification || 0);
        setError(null);
      } 
      else {
        setError(res.message || 'Failed to fetch notifications.');
        toast.error(res.message || 'Failed to fetch notifications.');
      }
    } catch (err) {
      setError('Error fetching notifications.');
      toast.error('Error fetching notifications.');
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch notifications on mount
    fetchNotifications();

    // Set up interval to fetch every 2 minutes (120,000 ms)
    const intervalId = setInterval(fetchNotifications, 120000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [user?.approvalToken]); // Re-run if approvalToken changes

  return (
    <div className="relative">
        <div className="relative" onClick={()=>navigate("notificationList")}>
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          {newNotificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {newNotificationCount}
            </span>
          )}
        </div>
    </div>
  );
};

export default Notification;
