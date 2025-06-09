// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { useAuth } from '../../../context/AuthProvider';
// import useApi from '../../../hook/apiHook';
// import Container from '../../../container/container';
// import { LoaderCircle } from 'lucide-react';
// import ConfirmModal from './ConfirmModal';


// const Settings = () => {
//   const { user, logout } = useAuth();
//   const { request } = useApi();
//   const navigate = useNavigate();

//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errors, setErrors] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   const onChangePasswordSubmit = async (e) => {
//     e.preventDefault();

//     let hasError = false;
//     const newErrors = { oldPassword: '', newPassword: '', confirmPassword: '' };

//     if (!oldPassword) {
//       newErrors.oldPassword = 'Old password is required';
//       hasError = true;
//     }

//     if (!newPassword) {
//       newErrors.newPassword = 'New password is required';
//       hasError = true;
//     } else if (newPassword.length < 6) {
//       newErrors.newPassword = 'Password must be at least 6 characters';
//       hasError = true;
//     }

//     if (!confirmPassword) {
//       newErrors.confirmPassword = 'Confirm password is required';
//       hasError = true;
//     } else if (confirmPassword.length < 6) {
//       newErrors.confirmPassword = 'Password must be at least 6 characters';
//       hasError = true;
//     } else if (confirmPassword !== newPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//       hasError = true;
//     }

//     setErrors(newErrors);
//     if (hasError) return;

//     if (!user?.approvalToken) {
//       toast.error('You must be logged in to change your password.');
//       setTimeout(() => navigate('/login'), 1500);
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await request({
//         endpoint: '/auth/changePassword',
//         method: 'POST',
//         headers: {
//           Authorization: user.approvalToken,
//           'Content-Type': 'application/json',
//         },
//         body: { oldPassword, newPassword },
//       });

//       if (res?.ok) {
//         toast.success('Password changed successfully!');
//         setOldPassword('');
//         setNewPassword('');
//         setConfirmPassword('');
//       } else {
//         toast.error(res?.message || 'Failed to change password.');
//       }
//     } catch (error) {
//       console.error('Change password error:', error);
//       toast.error('Error changing password.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAccount = () => {
//     if (!user?.approvalToken) {
//       toast.error('You must be logged in to delete your account.');
//       setTimeout(() => navigate('/login'), 1500);
//       return;
//     }

//     setShowConfirmModal(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       setLoading(true);
//       const res = await request({
//         endpoint: '/users/selfDistuct',
//         method: 'DELETE',
//         headers: {
//           Authorization: user.approvalToken,
//         },
//       });

//       if (res?.ok) {
//         toast.success('Account deleted successfully.');
//         logout();
//         setTimeout(() => navigate('/login'), 1500);
//       } else {
//         toast.error(res?.message || 'Failed to delete account.');
//       }
//     } catch (error) {
//       console.error('Delete account error:', error);
//       toast.error('Error deleting account.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container>
//       <div className="min-h-screen flex justify-center w-full max-w-[1444px] mx-auto text-gray-900">
//         <div className="md:w-[80%] lg:w-[80%] space-y-6 mt-10">
//           {
//             user?.role === "user" &&(<h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>)
//           }
//           <h2 className="text-3xl font-bold mb-4 text-center">Account Settings</h2>

//           {/* Change Password Section */}
//           <div className="p-6 rounded-lg shadow-md bg-white w-full">
//             <h3 className="text-xl font-semibold mb-4">Change Password</h3>
//             <form onSubmit={onChangePasswordSubmit} className="space-y-4">
//               {/* Old Password */}
//               <div className="relative">
//                 <label className="block">Old Password</label>
//                 <input
//                   type={showOldPassword ? 'text' : 'password'}
//                   value={oldPassword}
//                   onChange={(e) => setOldPassword(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowOldPassword(!showOldPassword)}
//                   className="absolute right-2 top-9 text-sm hover:underline"
//                 >
//                   {showOldPassword ? 'Hide' : 'Show'}
//                 </button>
//                 {errors.oldPassword && (
//                   <p className="text-sm mt-1 italic text-red-600">{errors.oldPassword}</p>
//                 )}
//               </div>

//               {/* New Password */}
//               <div className="relative">
//                 <label className="block">New Password</label>
//                 <input
//                   type={showNewPassword ? 'text' : 'password'}
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowNewPassword(!showNewPassword)}
//                   className="absolute right-2 top-9 text-sm hover:underline"
//                 >
//                   {showNewPassword ? 'Hide' : 'Show'}
//                 </button>
//                 {errors.newPassword && (
//                   <p className="text-sm mt-1 italic text-red-600">{errors.newPassword}</p>
//                 )}
//               </div>

//               {/* Confirm Password */}
//               <div className="relative">
//                 <label className="block">Confirm Password</label>
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-2 top-9 text-sm hover:underline"
//                 >
//                   {showConfirmPassword ? 'Hide' : 'Show'}
//                 </button>
//                 {errors.confirmPassword && (
//                   <p className="text-sm mt-1 italic text-red-600">{errors.confirmPassword}</p>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <div className="text-center flex justify-center items-center">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors disabled:opacity-50"
//                 >
//                   {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : null}
//                   Change Password
//                 </button>
//               </div>
//             </form>
//           </div>

//           {user?.role !== 'admin' && (
//             <div className="p-6 rounded-lg shadow-md bg-white">
//               <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
//               <p className="mb-4 text-gray-600">Deleting your account is permanent and cannot be undone.</p>
//               <div className="text-center">
//                 <button
//                   onClick={handleDeleteAccount}
//                   disabled={loading}
//                   className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
//                 >
//                   {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : null}
//                   Delete Account
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Confirm Deletion Modal */}
//       <ConfirmModal
//         isOpen={showConfirmModal}
//         onClose={() => setShowConfirmModal(false)}
//         onConfirm={confirmDelete}
//         title="Delete Account"
//         description="Are you sure you want to delete your account? This action is irreversible."
//       />
//     </Container>
//   );
// };

// export default Settings;



import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthProvider';
import useApi from '../../../hook/apiHook';
import Container from '../../../container/container';
import { LoaderCircle } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import OtpCrossCheck from '../../OtpCrosscheck/OtpCrossCheck';

const Settings = () => {
  const { user, logout } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();
  const otpTokenRef = useRef(null); // Ref to store OTP token for instant access

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null); // State to trigger rendering

  const onChangePasswordSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { oldPassword: '', newPassword: '', confirmPassword: '' };

    if (!oldPassword) {
      newErrors.oldPassword = 'Old password is required';
      hasError = true;
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      hasError = true;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
      hasError = true;
    } else if (confirmPassword.length < 6) {
      newErrors.confirmPassword = 'Password must be at least 6 characters';
      hasError = true;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    if (!user?.approvalToken) {
      toast.error('You must be logged in to change your password.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      setLoading(true);
      const res = await request({
        endpoint: '/auth/changePassword',
        method: 'POST',
        headers: {
          Authorization: user.approvalToken,
          'Content-Type': 'application/json',
        },
        body: { oldPassword, newPassword },
      });

      if (res?.ok) {
        toast.success('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res?.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('Error changing password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!user?.approvalToken) {
      toast.error('You must be logged in to delete your account.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const res = await request({
        endpoint: '/users/selfDistuct',
        method: 'DELETE',
        headers: {
          Authorization: user.approvalToken,
        },
      });

      if (res?.ok) {
        toast.success('Account deleted successfully.');
        logout();
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(res?.message || 'Failed to delete account.');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Error deleting account.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!user?.approvalToken) {
      toast.error('You must be logged in to request OTP verification.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      setLoading(true);
      const res = await request({
        endpoint: '/auth/send_OTP',
        method: 'POST',
        headers: {
          Authorization: user.approvalToken
        },
      });

      console.log('Full OTP Response:', JSON.stringify(res, null, 2)); // Detailed debug log

      // Try multiple possible token locations, based on provided response
      const token = res?.body?.token || res?.data?.body?.token || res?.data?.token || res?.token;

      if (res?.ok && token && typeof token === 'string') {
        toast.success('OTP sent successfully!');
        otpTokenRef.current = token; // Update ref for instant access
        setOtpToken(token); // Update state to trigger render
        console.log('OTP Token Set:', token); // Confirm token is set

      } else {
        toast.error(res?.message || 'Failed to send OTP. No valid token received.');
        console.error('No valid token in response:', res);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Error sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="min-h-screen flex justify-center w-full max-w-[1444px] mx-auto text-gray-900">
        <div className="md:w-[80%] lg:w-[80%] space-y-6 mt-10">
          {user?.role === 'user' && <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>}
          <h2 className="text-3xl font-bold mb-4 text-center">Account Settings</h2>

          {/* Change Password Section */}
          <div className="p-6 rounded-lg shadow-md bg-white w-full">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={onChangePasswordSubmit} className="space-y-4">
              {/* Old Password */}
              <div className="relative">
                <label className="block">Old Password</label>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-2 top-9 text-sm hover:underline"
                >
                  {showOldPassword ? 'Hide' : 'Show'}
                </button>
                {errors.oldPassword && (
                  <p className="text-sm mt-1 italic text-red-600">{errors.oldPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block">New Password</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-9 text-sm hover:underline"
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
                {errors.newPassword && (
                  <p className="text-sm mt-1 italic text-red-600">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-9 text-sm hover:underline"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
                {errors.confirmPassword && (
                  <p className="text-sm mt-1 italic text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center flex justify-center items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors disabled:opacity-50"
                >
                  {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : null}
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* OTP Verification Section */}
          <div className="p-6 rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-4">OTP Verification</h3>
            <p className="mb-4 text-gray-600">Be OTP verified to get all the access</p>
            <div className="text-center">
              <button
                onClick={handleOTPVerification}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : null}
                Get OTP
              </button>
            </div>
            {otpToken && otpTokenRef.current && typeof otpTokenRef.current === 'string' && (
              <div className="mt-4">
                <OtpCrossCheck adminOTPToken={otpTokenRef.current} navigateTo={'/userDashBoard/mockInterview'}/>
              </div>
            )}
          </div>

          {user?.role !== 'admin' && (
            <div className="p-6 rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
              <p className="mb-4 text-gray-600">Deleting your account is permanent and cannot be undone.</p>
              <div className="text-center">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : null}
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action is irreversible."
      />
    </Container>
  );
};

export default Settings;