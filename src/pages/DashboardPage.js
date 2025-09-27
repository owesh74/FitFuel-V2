import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { VscGraph} from "react-icons/vsc";
import { FaBurn } from "react-icons/fa";
import { FaDumbbell } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { GiMeal } from "react-icons/gi";
import api from '../services/api';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { cartItems, removeFromCart, clearCart, totals } = useCart();
  const { user, setUser } = useAuth();
  const { todaysWorkouts, removeWorkout, totalCaloriesBurned } = useWorkout();
  const [activeTab, setActiveTab] = useState('overview');

  // State for the new planner form and the calculated plan
  const [goalForm, setGoalForm] = useState({ goalWeight: '', goalDuration: 12 });

  // --- All previous fitness calculation logic remains the same ---
  let bmi = 0, bmiCategory = { label: 'N/A' }, healthyWeightRange = { lower: 0, upper: 0 }, dailyCalories = 0, macros = {protein: 0, carbs: 0, fat: 0};
  const activityFactors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
  const getBmiCategory = (bmiValue) => { if (bmiValue < 18.5) return { label: 'Underweight', color: 'text-blue-500' }; if (bmiValue <= 24.9) return { label: 'Normal Weight', color: 'text-emerald-600' }; if (bmiValue <= 29.9) return { label: 'Overweight', color: 'text-orange-500' }; return { label: 'Obesity', color: 'text-red-500' }; };

  // NEW: Enhanced calorie burn calculation
  let dailyBurnTarget = 0, exerciseBurnTarget = 0, activityBurnTarget = 0, burnRecommendations = [];

  if (user?.height > 0 && user?.weight > 0 && user?.age > 0 && user?.gender) {
    const heightInMeters = user.height / 100;
    bmi = user.weight / (heightInMeters * heightInMeters);
    bmiCategory = getBmiCategory(bmi);
    healthyWeightRange.lower = 18.5 * (heightInMeters * heightInMeters);
    healthyWeightRange.upper = 24.9 * (heightInMeters * heightInMeters);
    const bmr = user.gender === 'male' ? 10 * user.weight + 6.25 * user.height - 5 * user.age + 5 : 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    const tdee = bmr * (activityFactors[user.activityLevel] || 1.2);

    if (user.goalWeight && user.goalDuration > 0) {
        const weightToChange = user.goalWeight - user.weight;
        const totalCalorieChange = weightToChange * 7700;
        const dailyCalorieAdjust = totalCalorieChange / (user.goalDuration * 7);
        dailyCalories = tdee + dailyCalorieAdjust;

        // NEW: Calculate how much to burn based on goal
        if (weightToChange < 0) { // Weight loss goal
          // For weight loss, calculate additional burn needed beyond base metabolism
          const deficitNeeded = Math.abs(dailyCalorieAdjust);
          const maxSafeDeficit = 1000; // Max 1000 cal deficit per day for safety
          const actualDeficit = Math.min(deficitNeeded, maxSafeDeficit);
          
          // Split deficit between diet reduction and exercise
          const dietDeficit = Math.min(actualDeficit * 0.6, 500); // Max 500 from diet
          const exerciseDeficit = actualDeficit - dietDeficit;
          
          dailyCalories = tdee - dietDeficit;
          dailyBurnTarget = bmr * 1.2 + exerciseDeficit; // Base + extra burn needed
          exerciseBurnTarget = exerciseDeficit;
          activityBurnTarget = bmr * 0.2; // 20% of BMR from daily activities
          
          burnRecommendations = [
            { activity: 'Cardio (Running/Cycling)', duration: Math.round(exerciseDeficit / 8), calories: Math.round(exerciseDeficit * 0.6) },
            { activity: 'Strength Training', duration: Math.round(exerciseDeficit / 6), calories: Math.round(exerciseDeficit * 0.4) },
            { activity: 'Walking (10k steps)', duration: 90, calories: Math.round(user.weight * 0.5) },
            { activity: 'Swimming', duration: Math.round(exerciseDeficit / 10), calories: Math.round(exerciseDeficit * 0.7) }
          ];
        } else if (weightToChange > 0) { // Weight gain goal
          // For weight gain, maintain moderate activity to build muscle
          dailyBurnTarget = bmr * 1.3; // Slightly above sedentary
          exerciseBurnTarget = 200; // Moderate exercise for muscle building
          activityBurnTarget = bmr * 0.3;
          
          burnRecommendations = [
            { activity: 'Weight Training', duration: 45, calories: 180 },
            { activity: 'Light Cardio', duration: 20, calories: 120 },
            { activity: 'Walking', duration: 60, calories: Math.round(user.weight * 0.3) },
            { activity: 'Yoga/Stretching', duration: 30, calories: 80 }
          ];
        } else { // Maintenance
          dailyBurnTarget = tdee;
          exerciseBurnTarget = 250; // Recommended daily exercise
          activityBurnTarget = bmr * 0.25;
          
          burnRecommendations = [
            { activity: 'Mixed Cardio', duration: 30, calories: 200 },
            { activity: 'Strength Training', duration: 40, calories: 160 },
            { activity: 'Active Walking', duration: 75, calories: Math.round(user.weight * 0.4) },
            { activity: 'Sports/Recreation', duration: 45, calories: 250 }
          ];
        }
    } else {
        dailyCalories = user.goal === 'lose' ? tdee - 500 : user.goal === 'gain' ? tdee + 300 : tdee;
        // Default burn targets based on general goals
        if (user.goal === 'lose') {
          dailyBurnTarget = tdee + 200;
          exerciseBurnTarget = 400;
          activityBurnTarget = bmr * 0.2;
        } else if (user.goal === 'gain') {
          dailyBurnTarget = bmr * 1.3;
          exerciseBurnTarget = 200;
          activityBurnTarget = bmr * 0.3;
        } else {
          dailyBurnTarget = tdee;
          exerciseBurnTarget = 250;
          activityBurnTarget = bmr * 0.25;
        }
    }

    const goalType = user.goalWeight ? (user.goalWeight > user.weight ? 'gain' : 'lose') : user.goal;
    if (goalType === 'muscleGain') { macros = { protein: (dailyCalories * 0.40) / 4, carbs: (dailyCalories * 0.40) / 4, fat: (dailyCalories * 0.20) / 9 }; }
    else if (goalType === 'lose') { macros = { protein: (dailyCalories * 0.40) / 4, carbs: (dailyCalories * 0.30) / 4, fat: (dailyCalories * 0.30) / 9 }; }
    else if (goalType === 'gain') { macros = { protein: (dailyCalories * 0.30) / 4, carbs: (dailyCalories * 0.50) / 4, fat: (dailyCalories * 0.20) / 9 }; }
    else { macros = { protein: (dailyCalories * 0.30) / 4, carbs: (dailyCalories * 0.40) / 4, fat: (dailyCalories * 0.30) / 9 }; }
  }

  const netCalories = totals.calories - totalCaloriesBurned;
  const caloriesRemaining = dailyCalories - netCalories;
  const netCalorieProgress = dailyCalories > 0 ? (netCalories / dailyCalories) * 100 : 0;
  
  // NEW: Burn progress calculation
  const burnProgress = dailyBurnTarget > 0 ? (totalCaloriesBurned / dailyBurnTarget) * 100 : 0;
  const burnRemaining = dailyBurnTarget - totalCaloriesBurned;
  
  useEffect(() => {
    if (user) {
        setGoalForm({
            goalWeight: user.goalWeight || user.weight || '',
            goalDuration: user.goalDuration || 12,
        });
    }
  }, [user]);

  const handlePlanGeneration = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...user,
        goalWeight: goalForm.goalWeight,
        goalDuration: goalForm.goalDuration,
      };
      const { data } = await api.put('/auth/profile', updatedProfile);
      setUser(data);
      toast.success('New goal plan saved to your profile!');
    } catch (err) {
      toast.error('Failed to update goal.');
    }
  };

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

  const goalEmoji = user.goal === 'lose' ? '🔥': user.goal === 'gain' ? '💪' : '⚖️';
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
                  <span className="text-2xl animate-pulse"><VscGraph /></span> Today's Net Calorie Balance
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

              {/* NEW: Daily Burn Target Progress */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50 transform hover:scale-[1.01] transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl animate-pulse"><FaBurn /></span> Today's Calorie Burn Progress
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                  <div className="transform hover:scale-110 transition-transform duration-200">
                    <p className="font-bold text-3xl text-red-500 dark:text-red-400">{totalCaloriesBurned.toFixed(0)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Burned Today</p>
                  </div>
                  <div className="transform hover:scale-110 transition-transform duration-200">
                    <p className="font-bold text-3xl text-orange-600 dark:text-orange-400">{burnRemaining > 0 ? burnRemaining.toFixed(0) : 0}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Remaining</p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-gray-200 dark:bg-slate-700 rounded-full h-6 shadow-inner">
                  <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 h-6 rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: `${Math.min(burnProgress, 100)}%` }}></div>
                </div>
                <p className="text-sm text-center mt-3 text-gray-600 dark:text-gray-400 font-medium">Target: {dailyBurnTarget.toFixed(0)} kcal</p>
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
                <div className="text-center py-20"><p className="text-2xl text-gray-500 dark:text-gray-400 flex items-center justify-center gap-3"><span className="text-4xl animate-bounce"><GiMeal /></span> No items in your meal yet</p></div>
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
                <div className="text-center py-20"><p className="text-2xl text-gray-500 dark:text-gray-400 flex items-center justify-center gap-3"><span className="text-4xl animate-bounce"><FaDumbbell /></span> No workouts logged yet today.</p></div>
              ) : (
                <div className="grid gap-4 mb-6">{todaysWorkouts.map((w) => <ItemCard key={w._id} item={w} onRemove={() => removeWorkout(w._id)} type="workout" />)}</div>
              )}
              <Link to="/workouts" className="w-full block text-center bg-gradient-to-r from-slate-800 to-slate-600 text-white px-6 py-4 rounded-xl font-medium hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl">+ Log a New Workout</Link>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-8">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border-t-4 border-emerald-500">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Healthy Range Goals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div className="bg-emerald-50/80 dark:bg-emerald-500/10 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-500/20">
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 uppercase font-semibold mb-2">Target BMI</p>
                      <p className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">18.5 - 24.9</p>
                    </div>
                    <div className="bg-emerald-50/80 dark:bg-emerald-500/10 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-500/20">
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 uppercase font-semibold mb-2">Target Weight</p>
                      <p className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">{healthyWeightRange.lower.toFixed(1)} - {healthyWeightRange.upper.toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- ENHANCED WEIGHT GOAL PLANNER CARD --- */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border-t-4 border-purple-500">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Weight Goal Planner</h3>
                <form onSubmit={handlePlanGeneration} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Current Weight</label><div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg font-bold text-gray-800 dark:text-slate-200">{user.weight} kg</div></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Goal Weight (kg)</label><input type="number" name="goalWeight" value={goalForm.goalWeight} onChange={e => setGoalForm({...goalForm, goalWeight: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"/></div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Timeframe ({goalForm.goalDuration} weeks)</label>
                    <input type="range" name="goalDuration" value={goalForm.goalDuration} onChange={e => setGoalForm({...goalForm, goalDuration: e.target.value})} min="4" max="52" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"/>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transform transition-all">Generate & Save Plan</button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-600">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">Your Complete Daily Plan</h4>
                  
                  {/* Nutrition Plan */}
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <span className="text-xl"><GiMeal /></span> Daily Nutrition Plan
                    </h5>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-500/20">
                        <p className="text-xs uppercase font-semibold text-blue-700 dark:text-blue-300">Calories</p>
                        <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">{dailyCalories.toFixed(0)}</p>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">to consume</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-lg text-center border border-purple-200 dark:border-purple-500/20">
                        <p className="text-xs uppercase font-semibold text-purple-700 dark:text-purple-300">Protein</p>
                        <p className="font-bold text-2xl text-purple-600 dark:text-purple-400">{macros.protein.toFixed(0)}g</p>
                        <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">daily target</p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-500/10 p-4 rounded-lg text-center border border-orange-200 dark:border-orange-500/20">
                        <p className="text-xs uppercase font-semibold text-orange-700 dark:text-orange-300">Carbs</p>
                        <p className="font-bold text-2xl text-orange-600 dark:text-orange-400">{macros.carbs.toFixed(0)}g</p>
                        <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">daily target</p>
                      </div>
                      <div className="bg-pink-50 dark:bg-pink-500/10 p-4 rounded-lg text-center border border-pink-200 dark:border-pink-500/20">
                        <p className="text-xs uppercase font-semibold text-pink-700 dark:text-pink-300">Fat</p>
                        <p className="font-bold text-2xl text-pink-600 dark:text-pink-400">{macros.fat.toFixed(0)}g</p>
                        <p className="text-xs text-pink-600/70 dark:text-pink-400/70 mt-1">daily target</p>
                      </div>
                    </div>
                  </div>

                  {/* Calorie Burn Plan */}
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <span className="text-xl"><FaBurn /></span> Daily Calorie Burn Plan
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-lg text-center border border-red-200 dark:border-red-500/20">
                        <p className="text-xs uppercase font-semibold text-red-700 dark:text-red-300">Total Target</p>
                        <p className="font-bold text-2xl text-red-600 dark:text-red-400">{dailyBurnTarget.toFixed(0)}</p>
                        <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">calories/day</p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-500/10 p-4 rounded-lg text-center border border-orange-200 dark:border-orange-500/20">
                        <p className="text-xs uppercase font-semibold text-orange-700 dark:text-orange-300">Exercise</p>
                        <p className="font-bold text-2xl text-orange-600 dark:text-orange-400">{exerciseBurnTarget.toFixed(0)}</p>
                        <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">from workouts</p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-500/10 p-4 rounded-lg text-center border border-yellow-200 dark:border-yellow-500/20">
                        <p className="text-xs uppercase font-semibold text-yellow-700 dark:text-yellow-300">Activities</p>
                        <p className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">{activityBurnTarget.toFixed(0)}</p>
                        <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">daily movement</p>
                      </div>
                    </div>
                  </div>

                  {/* Exercise Recommendations */}
                  {burnRecommendations.length > 0 && (
                    <div>
                      <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <span className="text-xl"><FaDumbbell /></span> Recommended Exercise Plan
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {burnRecommendations.map((rec, index) => (
                          <div key={index} className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700/50 dark:to-slate-600/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600/50">
                            <div className="flex justify-between items-center mb-2">
                              <h6 className="font-semibold text-slate-700 dark:text-slate-300">{rec.activity}</h6>
                              <span className="text-sm font-bold text-red-500 dark:text-red-400">{rec.calories} kcal</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Duration: <span className="font-semibold">{rec.duration} minutes</span>
                            </p>
                            <div className="mt-2 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-red-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((rec.calories / exerciseBurnTarget) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                          <span className="font-semibold">💡 Smart Tip:</span> Choose 2-3 activities that you enjoy most. Consistency is more important than intensity for long-term success!
                        </p>
                      </div>
                    </div>
                  )}
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