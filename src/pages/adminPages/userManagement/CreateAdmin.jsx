import React, { useState } from 'react';
import { toast } from 'sonner';
import useApi from '../../../hook/apiHook';

const CreateAdmin = ({ setNewAdminOTPToken }) => {
  const initialFormData = {
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
    role: 'admin',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { request } = useApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.password) return 'Password is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    // Construct JSON payload directly
    const payload = {
      name: formData.name,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword, // Include confirmPassword
      email: formData.email,
      role: formData.role,
      aggriedToTerms: true,
      OTPverified: false, // OTP verification handled by OtpCrossCheck
    };

    try {
      setLoading(true);
      setError(null);

      // Log payload and headers for debugging
      console.log('Submitting payload:', payload);
      console.log('Request headers:', { 'Content-Type': 'application/json' });

      const res = await request({
        endpoint: '/users/createUser',
        method: 'POST',
        data: payload
      });

      if (res.ok) {
        toast.success('Admin creation initiated! Please verify OTP.');
        setFormData(initialFormData); // Reset form
        console.log('API response:', res.data);
        if (res.data?.token) {
          setNewAdminOTPToken(res.data.token); // Set OTP token for OtpCrossCheck
        } else {
          toast.error('No OTP token received. Please try again.');
        }
      } else {
        throw new Error(res.message || 'Failed to create admin');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to create admin';
      setError(errorMessage);
      toast.error('Error creating admin.', {
        description: errorMessage,
      });
      console.error('Create admin error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black w-full px-4 py-8 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Create Admin</h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-md transition-all duration-300">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 p-3 w-full border border-gray-300 rounded-md hover:border-[#37B874] focus:border-[#37B874] focus:ring-2 focus:ring-[#37B874] transition duration-200"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 p-3 w-full border border-gray-300 rounded-md hover:border-[#37B874] focus:border-[#37B874] focus:ring-2 focus:ring-[#37B874] transition duration-200"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 p-3 w-full border border-gray-300 rounded-md hover:border-[#37B874] focus:border-[#37B874] focus:ring-2 focus:ring-[#37B874] transition duration-200"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 p-3 w-full border border-gray-300 rounded-md hover:border-[#37B874] focus:border-[#37B874] focus:ring-2 focus:ring-[#37B874] transition duration-200"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 p-3 w-full border border-gray-300 rounded-md hover:border-[#37B874] focus:border-[#37B874] focus:ring-2 focus:ring-[#37B874] transition duration-200"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            readOnly
            className="mt-1 p-3 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-[#37B874] text-white rounded-md hover:bg-[#2ea664] transition duration-200 hover:shadow-md flex items-center justify-center ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : null}
          {loading ? 'Creating...' : 'Create Admin'}
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;