import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP & new password
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="relative max-w-md w-full">
        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Forgot Password</h2>
              <p className="text-gray-600 dark:text-slate-400">Enter your email to receive a reset code.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 py-8 px-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg">
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Email address</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" required className="mt-1 w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg disabled:opacity-50">
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Reset Your Password</h2>
              <p className="text-gray-600 dark:text-slate-400">An OTP has been sent to <span className="font-semibold text-blue-600 dark:text-blue-400">{email}</span></p>
            </div>
            <div className="bg-white dark:bg-slate-800 py-8 px-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg">
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Verification Code (OTP)</label>
                  <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" required maxLength="6" className="mt-1 w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 text-center tracking-wider font-mono" />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">New Password</label>
                  <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter your new password" required minLength="6" className="mt-1 w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold shadow-lg disabled:opacity-50">
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;