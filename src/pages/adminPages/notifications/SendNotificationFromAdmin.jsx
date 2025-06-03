import React, { useEffect, useState } from 'react';
import { LoaderCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import useApi from '../../../hook/apiHook';

const SendNotificationFromAdmin = () => {
  const { user } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState(['all']);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.approvalToken) {
        toast.error('You must be logged in to fetch users.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      try {
        const response = await request({
          endpoint: '/users/getAlluser',
          method: 'GET',
          headers: { Authorization: user.approvalToken },
        });

        const userData = response.data?.data;
        if (response.ok && Array.isArray(userData)) {
          setUsers(userData);
        } else {
          toast.error(response.message || 'Failed to fetch users.');
        }
      } catch (err) {
        toast.error('Error fetching users.', { description: err.message });
      }
    };

    fetchUsers();
  }, [user?.approvalToken]);

  const toggleRecipient = (id) => {
    if (id === 'all') {
      setSelectedRecipients(['all']);
    } else {
      const isAlreadySelected = selectedRecipients.includes(id);
      let updated = isAlreadySelected
        ? selectedRecipients.filter((r) => r !== id)
        : [...selectedRecipients.filter((r) => r !== 'all'), id];

      if (updated.length === 0) updated = ['all'];
      setSelectedRecipients(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Message is required.');
      return;
    }
  
    const body = {
      receiverList: selectedRecipients.includes('all') ? 'all' : selectedRecipients,
      notificationMessage: message,
    };
  
    // Log the request details before sending
    console.log('Sending Request:', {
      endpoint: '/notifications/sendNotificationFromAdmin',
      method: 'POST',
      headers: { Authorization: user.approvalToken },
      body,
    });
  
    setLoading(true);
    try {
      const response = await request({
        endpoint: '/notifications/sendNotificationFromAdmin',
        method: 'POST',
        body, // Pass plain object
        headers: {
          Authorization: user.approvalToken,
        },
      });
  
      if (response.ok) {
        toast.success('Notification sent successfully!');
        setMessage('');
        setSelectedRecipients(['all']);
      } else {
        toast.error(response.message || 'Failed to send notification.');
      }
    } catch (err) {
      toast.error('Error sending notification.', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Create New Notification</h2>

      <form onSubmit={handleSubmit} className="bg-white text-black   p-6 rounded-lg shadow-md space-y-6">
        {/* Dropdown */}
        <div className="relative">
          <label className="block mb-2 font-medium">Recipients</label>
          <div
            className="border rounded p-2 cursor-pointer flex justify-between items-center"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <span className="text-gray-800">
              {selectedRecipients.includes('all')
                ? 'All'
                : selectedRecipients
                    .map((id) => users.find((u) => u._id === id)?.name)
                    .filter(Boolean)
                    .join(', ') || 'Select recipients'}
            </span>
            {dropdownOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full border bg-white rounded shadow max-h-72 overflow-y-auto">
              <div
                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                  selectedRecipients.includes('all') ? 'font-bold' : ''
                }`}
                onClick={() => toggleRecipient('all')}
              >
                All
              </div>
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    selectedRecipients.includes(user._id) ? 'font-bold text-green-600' : ''
                  }`}
                  onClick={() => toggleRecipient(user._id)}
                >
                  {user.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#37B874] focus:outline-none text-black"
            rows={4}
            placeholder="Enter your notification message..."
            disabled={loading}
          />
        </div>

        {/* Submit */}
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
  );
};

export default SendNotificationFromAdmin;
