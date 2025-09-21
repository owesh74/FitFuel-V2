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
import ForgotPassword from './pages/ForgotPassword';
import WorkoutLibrary from './pages/WorkoutLibrary'; // <-- 1. IMPORT WORKOUT PAGE

// Import Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WorkoutProvider } from './context/WorkoutContext'; // <-- 2. IMPORT WORKOUT PROVIDER

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            {/* 3. WRAP APP WITH WORKOUT PROVIDER */}
            <WorkoutProvider> 
              <Navbar />
              <Toaster position="top-center" reverseOrder={false} />
              
              <main className="bg-slate-50 dark:bg-slate-900 min-h-screen">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                  <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                  
                  {/* Protected Routes */}
                  <Route path="/outlets" element={<ProtectedRoute><Outlets /></ProtectedRoute>} />
                  <Route path="/outlets/:id" element={<ProtectedRoute><OutletMenu /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  {/* 4. ADD NEW ROUTE FOR WORKOUTS */}
                  <Route path="/workouts" element={<ProtectedRoute><WorkoutLibrary /></ProtectedRoute>} />
                </Routes>
              </main>
            </WorkoutProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;