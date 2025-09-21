import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { cartItems, removeFromCart, clearCart, totals } = useCart();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // --- FITNESS & GOAL CALCULATIONS ---
  let bmi = 0;
  let bmiCategory = { label: 'N/A', color: 'text-gray-500' };
  let healthyWeightRange = { lower: 0, upper: 0 };
  let dailyCalories = 0;

  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  const getBmiCategory = (bmiValue) => {
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmiValue >= 18.5 && bmiValue <= 24.9) return { label: 'Normal Weight', color: 'text-emerald-600' };
    if (bmiValue >= 25 && bmiValue <= 29.9) return { label: 'Overweight', color: 'text-orange-500' };
    return { label: 'Obesity', color: 'text-red-500' };
  };

  if (user && user.height > 0 && user.weight > 0 && user.age > 0 && user.gender) {
    const heightInMeters = user.height / 100;
    bmi = user.weight / (heightInMeters * heightInMeters);
    bmiCategory = getBmiCategory(bmi);
    healthyWeightRange.lower = 18.5 * (heightInMeters * heightInMeters);
    healthyWeightRange.upper = 24.9 * (heightInMeters * heightInMeters);
    let bmr;
    if (user.gender === 'male') {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }
    const tdee = bmr * (activityFactors[user.activityLevel] || 1.2);
    if (user.goal === 'lose') {
      dailyCalories = tdee - 500;
    } else if (user.goal === 'gain') {
      dailyCalories = tdee + 500;
    } else {
      dailyCalories = tdee;
    }
  }

  const caloriesRemaining = dailyCalories - totals.calories;
  const calorieProgress = dailyCalories > 0 ? (totals.calories / dailyCalories) * 100 : 0;

  // Prompt to set up profile if data is missing
  if (!user || user.height === 0 || user.age === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-sm mx-auto border border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">Set Up Your Profile</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Add your details to calculate your daily goals.</p>
            <Link to="/profile" className="inline-flex items-center bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const TabButton = ({ tabName, label, badgeCount }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === tabName ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
    >
      {label}
      {badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
          {badgeCount}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {user.goal === 'lose' ? '🔥 Fat Loss Journey' : user.goal === 'gain' ? '💪 Muscle Gain Journey' : '⚖️ Maintenance Dashboard'}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
        </div>
        
        <div className="mb-6 bg-white/60 dark:bg-slate-800/30 backdrop-blur-sm p-2 rounded-xl border border-gray-200 dark:border-slate-700 inline-flex space-x-2">
          <TabButton tabName="overview" label="Overview" />
          <TabButton tabName="meals" label="Meals" badgeCount={cartItems.length} />
          <TabButton tabName="goals" label="Goals" />
        </div>

        <div>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 text-center"><p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-2">Your BMI</p><p className="font-bold text-4xl text-gray-800 dark:text-white mb-2">{bmi.toFixed(1)}</p><div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${bmiCategory.color.replace('text-','bg-').replace('-500','-100')} ${bmiCategory.color.replace('-600','-700')}`}>{bmiCategory.label}</div></div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 text-center"><p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-2">Daily Calorie Goal</p><p className="font-bold text-4xl text-gray-800 dark:text-white mb-2">{dailyCalories.toFixed(0)}</p><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">For your {user.goal} goal</p></div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 text-center"><p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-2">Calories Remaining</p><p className={`font-bold text-4xl mb-2 ${caloriesRemaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>{caloriesRemaining.toFixed(0)}</p><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Today</p></div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border-gray-100 dark:border-slate-700"><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">Today's Calorie Progress</h3><div className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-lg"><p className="text-lg font-bold text-gray-800 dark:text-gray-200">{totals.calories.toFixed(0)} / {dailyCalories.toFixed(0)} kcal</p></div></div><div className="relative"><div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-6 overflow-hidden"><div className="bg-gradient-to-r from-purple-500 to-emerald-500 h-6 rounded-full transition-all duration-700" style={{ width: `${Math.min(calorieProgress, 100)}%` }}></div></div><div className="text-center mt-2"><span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{calorieProgress.toFixed(1)}% Complete</span></div></div></div>
            </div>
          )}

          {activeTab === 'meals' && (
             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">Current Meal Summary</h2>{cartItems.length > 0 && (<button onClick={clearCart} className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-semibold transition-transform transform hover:scale-105 shadow-lg flex items-center">Clear Meal</button>)}</div>
                {cartItems.length === 0 ? (<div className="text-center py-16"><p className="text-xl text-gray-500 dark:text-gray-400 mb-4">No items in your meal yet</p><p className="text-gray-400 dark:text-gray-500">Add items from restaurant menus to build your perfect meal</p></div>) : (<div className="grid gap-4">{cartItems.map((item, index) => (<div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-slate-700 p-6 rounded-xl border-l-4 border-blue-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors transform hover:scale-[1.02]"><div><p className="font-bold text-lg text-gray-800 dark:text-gray-100">{item.itemName}</p><p className="text-orange-600 dark:text-orange-400 font-semibold">{item.calories} kcal</p></div><button onClick={() => removeFromCart(index)} className="w-12 h-12 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/40 text-red-600 dark:text-red-400 rounded-full font-bold text-xl transition-transform hover:scale-110 flex items-center justify-center">×</button></div>))}</div>)}
                <Link to="/outlets" className="mt-6 w-full block text-center bg-slate-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors">+ Add More Items</Link>
            </div>
          )}
          
          {activeTab === 'goals' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border-t-4 border-emerald-500 dark:border-emerald-500">
              <div className="text-center"><h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center justify-center">Your Healthy Range Goals</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"><div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-xl border border-emerald-200 dark:border-emerald-500/20"><p className="text-sm text-emerald-700 dark:text-emerald-300 uppercase tracking-wider font-semibold mb-3">Target BMI</p><p className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">18.5 - 24.9</p></div><div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-xl border border-emerald-200 dark:border-emerald-500/20"><p className="text-sm text-emerald-700 dark:text-emerald-300 uppercase tracking-wider font-semibold mb-3">Target Weight</p><p className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">{healthyWeightRange.lower.toFixed(1)} - {healthyWeightRange.upper.toFixed(1)} kg</p></div></div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;