import React, { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import useApi from '../../../hook/apiHook';

const SendNotificationFromAdmin = () => {
  const { user } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();

  const [selectedRecipients, setSelectedRecipients] = useState<[]>([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.approvalToken) {
        toast.error('You must be logged in to fetch users.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await request({
          endpoint: '/users/getAlluser',
          method: 'GET',
          headers: {
            Authorization: user.approvalToken,
          },
        });

        console.log('Full API response:', response); // Debug full response
        const userData = response.data?.data;
        console.log('User data:', userData); // Debug userData

        if (response.ok) {
          setUsers(
            Array.isArray(userData) && userData !== false
              ? userData
              : []
          ); // Explicitly handle false
        } else {
          setError(response.message || 'Failed to fetch users.');
          toast.error(response.message || 'Failed to fetch users.', {
            description: response.data?.error || 'Please try again.',
          });
        }
      } catch (err) {
        console.error('Fetch users error:', err);
        setError('Error fetching users.');
        toast.error('Error fetching users.', {
          description: err.message || 'Something went wrong.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.approvalToken]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.approvalToken) {
      toast.error('You must be logged in to send notifications.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!message.trim()) {
      setError('Message is required.');
      toast.error('Message is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const body = {
      receiverList: selectedRecipients.length > 0 ? selectedRecipients : 'all',
      notificationMessage: message,
    };

    try {
      const response = await request({
        endpoint: '/notifications/sendNotificationFromAdmin',
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Authorization: user.approvalToken,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Notification sent successfully!');
        setMessage('');
        setSelectedRecipients([]);
      } else {
        setError(response.message || 'Failed to send notification.');
        toast.error(response.message || 'Failed to send notification.', {
          description: response.data?.error || 'Please try again.',
        });
      }
    } catch (err) {
      console.error('Send notification error:', err);
      setError('Error sending notification.');
      toast.error('Error sending notification.', {
        description: err.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle recipient selection with toggle behavior
  const handleRecipientChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    if (selectedOptions.includes('all')) {
      setSelectedRecipients([]); // Selecting "all" clears specific users
      return;
    }
    setSelectedRecipients((prev) => {
      const newSelections = selectedOptions.filter((id) => id !== 'all');
      return newSelections.filter((id) => {
        if (prev.includes(id)) {
          return false; // Remove if already selected
        }
        return true; // Add if not selected
      });
    });
  };

  // Get comma-separated names of selected recipients
  const getSelectedNames = () => {
    if (selectedRecipients.length === 0) return 'All';
    return selectedRecipients
      .map((id) => users.find((user) => user._id === id)?.name || 'Unknown')
      .join(', ');
  };

  return (
    <div className="w-full max-w-[1444px] mx-auto mt-10 mb-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-black">Create New Notification</h2>
      <div className="p-4 sm:p-6 rounded-lg shadow-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Dropdown */}
          <div>
            <label htmlFor="recipient" className="block text-gray-700 font-medium mb-2">
              Recipient
            </label>
            <select
              id="recipient"
              value={selectedRecipients} // Bind to selectedRecipients for multi-select
              onChange={handleRecipientChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B874]"
              disabled={loading}
              multiple
              size={users.length + 1} // Show all options
            >
              <option value="all">All</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            {selectedRecipients.length > 0 && (
              <p className="mt-2 text-sm text-gray-700">
                Selected: {getSelectedNames()}
              </p>
            )}
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B874]"
              rows={4}
              placeholder="Enter your notification message..."
              disabled={loading}
            />
            {error && <p className="text-sm mt-1 italic text-red-600">{error}</p>}
          </div>

          {/* Send Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading && <LoaderCircle className="animate-spin w-4 h-4" />}
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationFromAdmin;