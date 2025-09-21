import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { cartItems, removeFromCart, clearCart, totals } = useCart();
  const { user } = useAuth();
  const { todaysWorkouts, removeWorkout, totalCaloriesBurned } = useWorkout();
  const [activeTab, setActiveTab] = useState('overview');

  // --- FITNESS & GOAL CALCULATIONS ---
  let bmi = 0, bmiCategory = { label: 'N/A', color: 'text-gray-500' }, healthyWeightRange = { lower: 0, upper: 0 }, dailyCalories = 0;

  const activityFactors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
  
  const getBmiCategory = (bmiValue) => {
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmiValue <= 24.9) return { label: 'Normal Weight', color: 'text-emerald-600' };
    if (bmiValue <= 29.9) return { label: 'Overweight', color: 'text-orange-500' };
    return { label: 'Obesity', color: 'text-red-500' };
  };

  if (user?.height > 0 && user?.weight > 0 && user?.age > 0 && user?.gender) {
    const heightInMeters = user.height / 100;
    bmi = user.weight / (heightInMeters * heightInMeters);
    bmiCategory = getBmiCategory(bmi);
    healthyWeightRange.lower = 18.5 * (heightInMeters * heightInMeters);
    healthyWeightRange.upper = 24.9 * (heightInMeters * heightInMeters);
    const bmr = user.gender === 'male' 
      ? 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
      : 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    const tdee = bmr * (activityFactors[user.activityLevel] || 1.2);
    dailyCalories = user.goal === 'lose' ? tdee - 500 : user.goal === 'gain' ? tdee + 500 : tdee;
  }

  const netCalories = totals.calories - totalCaloriesBurned;
  const caloriesRemaining = dailyCalories - netCalories;
  const netCalorieProgress = dailyCalories > 0 ? (netCalories / dailyCalories) * 100 : 0;

  if (!user || user.height === 0 || user.age === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-sm border border-white/20 dark:border-slate-700/50 animate-[fadeInUp_0.6s_ease-out]">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl animate-bounce">⚙️</div>
          <h1 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">Set Up Your Profile</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Add your details to calculate your daily goals.</p>
          <Link to="/profile" className="inline-flex items-center bg-gradient-to-r from-slate-800 to-slate-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl">
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  const TabButton = ({ tabName, label, badgeCount }) => (
    <button onClick={() => setActiveTab(tabName)} className={`relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex-shrink-0 transform hover:scale-105 ${activeTab === tabName ? 'bg-gradient-to-r from-slate-800 to-slate-600 text-white shadow-lg scale-105' : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/50 hover:shadow-md'}`}>
      {label}
      {badgeCount > 0 && (<span className="absolute -top-2 -right-2 w-5 h-5 text-xs font-bold text-red-100 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">{badgeCount}</span>)}
    </button>
  );

  const StatCard = ({ title, value, subtitle, gradient, textColor = "text-gray-800 dark:text-white" }) => (
    <div className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${gradient ? `bg-gradient-to-br ${gradient}` : ''}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2 tracking-wide">{title}</p>
      <p className={`font-bold text-3xl mb-2 ${textColor}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{subtitle}</p>}
    </div>
  );

  const ItemCard = ({ item, onRemove, type = 'meal' }) => (
    <div className="group flex justify-between items-center bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-slate-600/30 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
      <div className="flex-1">
        <p className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">{type === 'meal' ? item.itemName : item.name}</p>
        <p className="text-orange-600 dark:text-orange-400 font-semibold">
          {type === 'meal' ? `${item.calories} kcal` : `${item.duration ? `${item.duration} mins` : `${item.sets} sets × ${item.reps} reps`} • ~${item.caloriesBurned} kcal`}
        </p>
      </div>
      <button onClick={onRemove} className="w-12 h-12 bg-red-100/80 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full font-bold text-xl flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-500/30 transform hover:scale-110 transition-all duration-200 opacity-70 group-hover:opacity-100">×</button>
    </div>
  );

  const goalEmoji = user.goal === 'lose' ? '🔥' : user.goal === 'gain' ? '💪' : '⚖️';
  const goalTitle = user.goal === 'lose' ? 'Fat Loss Journey' : user.goal === 'gain' ? 'Muscle Gain Journey' : 'Maintenance Dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto animate-[fadeInUp_0.8s_ease-out]">
        <div className="mb-8 transform hover:scale-[1.02] transition-transform duration-300">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-slate-200 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">
            {goalEmoji} {goalTitle}
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full animate-[slideInLeft_0.8s_ease-out]"></div>
        </div>
        
        <div className="mb-8 animate-[slideInDown_0.6s_ease-out]">
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-3 rounded-2xl border border-white/30 dark:border-slate-700/30 inline-flex flex-wrap gap-3 shadow-lg">
            <TabButton tabName="overview" label="Overview" />
            <TabButton tabName="meals" label="Meals" badgeCount={cartItems.length} />
            <TabButton tabName="workouts" label="Workouts" badgeCount={todaysWorkouts.length} />
            <TabButton tabName="goals" label="Goals" />
          </div>
        </div>

        <div className="animate-[fadeIn_1s_ease-out]">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50 transform hover:scale-[1.01] transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl animate-pulse">📊</span> Today's Net Calorie Balance
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="transform hover:scale-110 transition-transform duration-200"><p className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">{totals.calories.toFixed(0)}</p><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Consumed</p></div>
                  <div className="transform hover:scale-110 transition-transform duration-200"><p className="font-bold text-3xl text-red-500 dark:text-red-400">- {totalCaloriesBurned.toFixed(0)}</p><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Burned</p></div>
                  <div className="transform hover:scale-110 transition-transform duration-200"><p className="font-bold text-3xl text-blue-600 dark:text-blue-400">= {netCalories.toFixed(0)}</p><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Net Intake</p></div>
                </div>
                <div className="relative overflow-hidden bg-gray-200 dark:bg-slate-700 rounded-full h-6 shadow-inner">
                  <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 h-6 rounded-full transition-all duration-1000 ease-out animate-[slideInLeft_1.5s_ease-out] shadow-lg" style={{ width: `${Math.min(netCalorieProgress, 100)}%` }}></div>
                </div>
                <p className="text-sm text-center mt-3 text-gray-600 dark:text-gray-400 font-medium">Goal: {dailyCalories.toFixed(0)} kcal</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Your BMI" 
                  value={bmi.toFixed(1)} 
                  subtitle={<div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-2 ${bmiCategory.color.replace('text-','bg-').replace('-500','-100 dark:bg-opacity-20')} ${bmiCategory.color.replace('-600','-700')}`}>{bmiCategory.label}</div>}
                />
                <StatCard title="Daily Goal" value={dailyCalories.toFixed(0)} subtitle={`For your ${user.goal} goal`} />
                <StatCard 
                  title="Remaining" 
                  value={caloriesRemaining.toFixed(0)} 
                  subtitle="Calories Today" 
                  textColor={caloriesRemaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}
                />
              </div>
            </div>
          )}

          {activeTab === 'meals' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                  Current Meal Summary
                </h2>
                {cartItems.length > 0 && (
                  <button onClick={clearCart} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:scale-105 transform transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">Clear Meal</button>
                )}
              </div>
              {cartItems.length === 0 ? (
                <div className="text-center py-20"><p className="text-2xl text-gray-500 dark:text-gray-400 flex items-center justify-center gap-3"><span className="text-4xl animate-bounce">🍽️</span> No items in your meal yet</p></div>
              ) : (
                <div className="grid gap-4 mb-6">{cartItems.map((item, index) => <ItemCard key={index} item={item} onRemove={() => removeFromCart(index)} />)}</div>
              )}
              <Link to="/outlets" className="w-full block text-center bg-gradient-to-r from-slate-800 to-slate-600 text-white px-6 py-4 rounded-xl font-medium hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl">+ Add More Items</Link>
            </div>
          )}
          
          {activeTab === 'workouts' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    Today's Workouts
                </h2>
                <div className="text-right transform hover:scale-110 transition-transform duration-200">
                  <p className="font-bold text-2xl text-red-500 dark:text-red-400">{totalCaloriesBurned.toFixed(0)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Calories Burned</p>
                </div>
              </div>
              {todaysWorkouts.length === 0 ? (
                <div className="text-center py-20"><p className="text-2xl text-gray-500 dark:text-gray-400 flex items-center justify-center gap-3"><span className="text-4xl animate-bounce">💪</span> No workouts logged yet today.</p></div>
              ) : (
                <div className="grid gap-4 mb-6">{todaysWorkouts.map((w) => <ItemCard key={w._id} item={w} onRemove={() => removeWorkout(w._id)} type="workout" />)}</div>
              )}
              <Link to="/workouts" className="w-full block text-center bg-gradient-to-r from-slate-800 to-slate-600 text-white px-6 py-4 rounded-xl font-medium hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl">+ Log a New Workout</Link>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-t-4 border-emerald-500 border border-white/20 dark:border-slate-700/50">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center justify-center gap-3">
                  <span className="text-3xl animate-pulse">🎯</span> Your Healthy Range Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                  <div className="bg-emerald-50/80 dark:bg-emerald-500/20 backdrop-blur-sm p-8 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 uppercase font-semibold mb-4 tracking-wide">Target BMI</p>
                    <p className="font-bold text-4xl text-emerald-600 dark:text-emerald-400">18.5 - 24.9</p>
                  </div>
                  <div className="bg-emerald-50/80 dark:bg-emerald-500/20 backdrop-blur-sm p-8 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 uppercase font-semibold mb-4 tracking-wide">Target Weight</p>
                    <p className="font-bold text-4xl text-emerald-600 dark:text-emerald-400">{healthyWeightRange.lower.toFixed(1)} - {healthyWeightRange.upper.toFixed(1)} kg</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0%, 100% { background-position: -200% 0; }
          50% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;