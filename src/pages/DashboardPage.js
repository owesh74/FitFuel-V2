import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { cartItems, removeFromCart, clearCart, totals } = useCart();
  const { user } = useAuth();

  // --- DYNAMIC DASHBOARD TITLE ---
  const getDashboardTitle = () => {
    switch (user?.goal) {
      case 'lose':
        return 'Fat Loss Journey';
      case 'gain':
        return 'Muscle Building';
      default:
        return 'Healthy Living';
    }
  };

  // --- FITNESS CALCULATIONS ---
  let bmi = 0;
  let dailyCalories = 0;
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  if (user && user.height > 0 && user.weight > 0 && user.age > 0 && user.gender) {
    const heightInMeters = user.height / 100;
    bmi = user.weight / (heightInMeters * heightInMeters);

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

  if (!user || user.height === 0 || user.age === 0) {
    return (
        <div className="container mx-auto p-4 text-center bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
            <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl mt-20">
                <h1 className="text-3xl font-bold my-8 text-gray-800">Set Up Your Profile</h1>
                <p className="text-gray-600 mb-8">Add your height, weight, and other details to calculate your daily goals.</p>
                <Link to="/profile" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
                    Go to Profile
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* THE TITLE IS NOW DYNAMIC */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{getDashboardTitle()}</h1>
      
      {/* Fitness Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
          <p className="text-sm text-gray-600 mb-2">Your BMI</p>
          <p className="font-bold text-3xl text-gray-800">{bmi.toFixed(1)}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
          <p className="text-sm text-gray-600 mb-2">Daily Calorie Goal</p>
          <p className="font-bold text-3xl text-gray-800">{dailyCalories.toFixed(0)}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
          <p className="text-sm text-gray-600 mb-2">Calories Remaining</p>
          <p className={`font-bold text-3xl ${caloriesRemaining >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {caloriesRemaining.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl mb-8">
        <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-gray-800">Today's Calorie Progress</p>
            <p className="text-sm font-medium text-gray-600">{totals.calories.toFixed(0)} / {dailyCalories.toFixed(0)} kcal</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500" style={{ width: `${Math.min(calorieProgress, 100)}%` }}></div>
        </div>
      </div>

      {/* Meal Summary */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Current Meal Summary</h2>
        {cartItems.length > 0 && (
          <button 
            onClick={clearCart} 
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl hover:from-red-600 hover:to-red-700 font-medium transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            Clear Meal
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
          <p className="text-gray-500">Add items from an outlet's menu to build your meal.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
              <div>
                <p className="font-semibold text-gray-800">{item.itemName}</p>
                <p className="text-sm text-gray-600">{item.calories} kcal</p>
              </div>
              <button 
                onClick={() => removeFromCart(index)} 
                className="text-red-500 hover:text-red-700 font-bold text-2xl transform hover:scale-110 transition-all duration-200"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;