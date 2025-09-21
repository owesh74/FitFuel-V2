import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { verifyAndLogin } = useAuth();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/signup', formData);
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { email } = formData;
      await verifyAndLogin(email, otp);
      toast.success('Account verified successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Verification failed.');
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
              <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Create Account</h2>
              <p className="text-gray-600 dark:text-slate-400">Join us today and get started</p>
            </div>
            <div className="bg-white dark:bg-slate-800 py-8 px-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg">
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Full Name</label>
                  <input id="name" name="name" type="text" onChange={onChange} value={formData.name} placeholder="Enter your full name" required className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Email address</label>
                  <input id="email" name="email" type="email" onChange={onChange} value={formData.email} placeholder="Enter your email" required className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Password</label>
                  <input id="password" name="password" type="password" onChange={onChange} value={formData.password} placeholder="Create a password (min. 6 characters)" minLength="6" required className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center">
                  {isLoading ? ( <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating account...</> ) : ( 'Create Account' )}
                </button>
              </form>
              <div className="mt-8 text-center">
                <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-600"></div></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400">Already have an account?</span></div></div>
                <div className="mt-4">
                  <Link to="/login" className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold">
                    Sign in instead
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Verify Your Email</h2>
              <p className="text-gray-600 dark:text-slate-400">We sent a verification code to</p>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">{formData.email}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 py-8 px-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg">
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Verification Code</label>
                  <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" required maxLength="6" className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-slate-700 dark:text-slate-200 text-center text-lg font-mono tracking-wider" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center">
                  {isLoading ? ( <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Verifying...</> ) : ( <> <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Verify Account</> )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;