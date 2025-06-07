import React, { useState } from 'react';
import { toast } from 'sonner';
import useApi from '../../../hook/apiHook';

const CreateAdmin = ({ setNewAdminOTPToken }) => {
  const { request } = useApi();
  const initialFormData = {
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
    role: 'admin',
    aggriedToTerms: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await request({
        endpoint: '/users/createUser',
        method: 'POST',
        body: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
          aggriedToTerms: formData.aggriedToTerms,
        },
      });

      if (res.ok && res.data?.data?.token) {
        setNewAdminOTPToken(res.data.data.token);
        toast.success('✅ Check your email for OTP!');
        setFormData(initialFormData);
      } else {
        toast.error(res.data.message || 'Admin creation failed');
        console.error('Admin creation failed', res);
      }
    } catch (err) {
      console.error('Admin creation error', err);
      toast.error('An error occurred during admin creation.');
    }
  };

  return (
    <div className="text-black w-full px-4 py-8 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Create Admin</h2>

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
            placeholder="Your name"
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
            placeholder="you@example.com"
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
            placeholder="Your phone number"
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
            placeholder="Create a password"
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
            placeholder="Confirm your password"
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
          className="w-full py-3 px-4 bg-[#37B874] text-white rounded-md hover:bg-[#2ea664] transition duration-200 hover:shadow-md"
        >
          Create Admin
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;