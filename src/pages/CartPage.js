import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, totals } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold my-8">Your Meal is Empty</h1>
        <p className="text-gray-600 mb-8">Add some items from an outlet's menu to get started.</p>
        <Link to="/outlets" className="bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-600">
          Browse Outlets
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Meal Summary</h1>
        <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <div className="bg-orange-100 text-orange-800 p-4 rounded-lg">
          <p className="font-bold text-2xl">{totals.calories.toFixed(0)}</p>
          <p>Total Calories</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 p-4 rounded-lg">
          <p className="font-bold text-2xl">{totals.protein.toFixed(1)}g</p>
          <p>Total Protein</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
          <p className="font-bold text-2xl">{totals.carbs.toFixed(1)}g</p>
          <p>Total Carbs</p>
        </div>
        <div className="bg-purple-100 text-purple-800 p-4 rounded-lg">
          <p className="font-bold text-2xl">{totals.fat.toFixed(1)}g</p>
          <p>Total Fat</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {cartItems.map((cartItem, index) => (
          <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
            <div>
              <p className="font-semibold">{cartItem.itemName}</p>
              <p className="text-sm text-gray-500">{cartItem.calories} kcal</p>
            </div>
            <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700 font-bold text-2xl">
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartPage;