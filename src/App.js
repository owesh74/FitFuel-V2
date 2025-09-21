import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Components and Pages
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Outlets from './pages/Outlets';
import OutletMenu from './pages/OutletMenu';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ForgotPassword from './pages/ForgotPassword'; // <-- 1. IMPORT THE NEW PAGE

// Import Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Toaster position="top-center" reverseOrder={false} />
            
            <main className="bg-slate-50 dark:bg-slate-900 min-h-screen">
              <Routes>
                {/* Public Routes (for logged-out users) */}
                <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                {/* 2. ADD THE NEW ROUTE FOR FORGOT PASSWORD */}
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                
                {/* Protected Routes (for logged-in users) */}
                <Route path="/outlets" element={<ProtectedRoute><Outlets /></ProtectedRoute>} />
                <Route path="/outlets/:id" element={<ProtectedRoute><OutletMenu /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              </Routes>
            </main>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;