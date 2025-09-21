import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute'; // <-- IMPORT THE NEW COMPONENT

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Outlets from './pages/Outlets';
import OutletMenu from './pages/OutletMenu';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
          
          <main className="bg-gray-50 min-h-screen">
            <Routes>
              {/* Public Routes are now protected from logged-in users */}
              <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              
              {/* Protected Routes */}
              <Route path="/outlets" element={<ProtectedRoute><Outlets /></ProtectedRoute>} />
              <Route path="/outlets/:id" element={<ProtectedRoute><OutletMenu /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
          </main>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;