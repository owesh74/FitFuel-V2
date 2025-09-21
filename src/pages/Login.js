import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="relative max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Welcome back</h2>
          <p className="text-gray-600 dark:text-slate-400">Sign in to continue to your account</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 py-8 px-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={onChange}
                value={formData.email}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-slate-700 dark:text-slate-200"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                  Password
                </label>
                {/* --- FORGOT PASSWORD LINK ADDED HERE --- */}
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                onChange={onChange}
                value={formData.password}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-slate-700 dark:text-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : ( 'Sign in' )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-600"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400">New to our platform?</span></div>
            </div>
            
            <div className="mt-4">
              <Link 
                to="/signup" 
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;