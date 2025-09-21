import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintain'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        height: user.height || '',
        weight: user.weight || '',
        age: user.age || '',
        gender: user.gender || 'male',
        activityLevel: user.activityLevel || 'sedentary',
        goal: user.goal || 'maintain'
      });
    }
  }, [user]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', formData);
      setUser(data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-slate-100">
        {user?.name ? `${user.name}'s Profile` : 'Your Profile'}
      </h1>
      <p className="text-center text-gray-600 dark:text-slate-400 mb-8 font-medium">Update your details to get accurate fitness calculations.</p>
      
      <div className="max-w-md mx-auto bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-slate-300 mb-2">Height (cm)</label>
            <input 
              type="number" 
              name="height" 
              value={formData.height} 
              onChange={onChange} 
              required 
              min="50" 
              max="250" 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-600 transition-all duration-200 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-slate-300 mb-2">Weight (kg)</label>
            <input 
              type="number" 
              name="weight" 
              value={formData.weight} 
              onChange={onChange} 
              required 
              min="20" 
              max="300" 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-600 transition-all duration-200 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-slate-300 mb-2">Age</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={onChange} 
              required 
              min="12" 
              max="120" 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-600 transition-all duration-200 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-slate-300 mb-2">Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={onChange} 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-600 transition-all duration-200 shadow-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-slate-300 mb-2">Activity Level</label>
            <select 
              name="activityLevel" 
              value={formData.activityLevel} 
              onChange={onChange} 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-600 transition-all duration-200 shadow-sm"
            >
              <option value="sedentary">Sedentary (little to no exercise)</option>
              <option value="light">Lightly active (1-3 days/week)</option>
              <option value="moderate">Moderately active (3-5 days/week)</option>
              <option value="active">Very active (6-7 days/week)</option>
              <option value="veryActive">Extra active (physical job & hard exercise)</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-slate-300 mb-2">Your Goal</label>
            <select 
              name="goal" 
              value={formData.goal} 
              onChange={onChange} 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-600 transition-all duration-200 shadow-sm"
            >
              <option value="lose">Weight Loss</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Weight Gain</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;