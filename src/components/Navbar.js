import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useWorkout } from '../context/WorkoutContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { todaysWorkouts } = useWorkout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const ThemeToggleButton = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      )}
    </button>
  );

  return (
    <>
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
              <div><h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">FitFuel</h1><p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 font-medium">Healthy Choices</p></div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => `font-semibold transition-colors relative group py-2 px-3 rounded-lg ${isActive ? 'text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-500/10' : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50/50'}`}><span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-[calc(100%-24px)] transition-all"></span>Dashboard</NavLink>
                  <NavLink to="/outlets" className={({ isActive }) => `font-semibold transition-colors relative group py-2 px-3 rounded-lg ${isActive ? 'text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-500/10' : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50/50'}`}>Outlets</NavLink>
                  <NavLink to="/workouts" className={({ isActive }) => `font-semibold transition-colors relative group py-2 px-3 rounded-lg ${isActive ? 'text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-500/10' : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50/50'}`}>Workouts</NavLink>
                  <div className="flex items-center space-x-4 pl-6 border-l-2 border-gray-200/50 dark:border-slate-600/50">
                    <ThemeToggleButton />
                    <Link to="/dashboard" className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl hover:bg-purple-50/50 dark:hover:bg-purple-500/10 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>{(cartItems.length + todaysWorkouts.length) > 0 && (<span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">{cartItems.length + todaysWorkouts.length}</span>)}</Link>
                    <Link to="/profile" className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100/80 dark:from-slate-700 dark:to-slate-600 rounded-full pl-1 pr-4 py-1 border border-gray-200/50 dark:border-slate-600/50 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all shadow-sm hover:shadow-md"><div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-md"><span className="text-white font-semibold text-sm">{getInitials(user.name)}</span></div><span className="text-gray-700 dark:text-gray-200 font-semibold text-sm">{user.name}</span></Link>
                    <button onClick={handleLogout} className="bg-gradient-to-r from-red-50 to-red-100/80 dark:from-red-500/20 dark:to-red-600/20 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl font-semibold flex items-center border border-red-200/50 dark:border-red-500/30 hover:border-red-300 dark:hover:border-red-400/50 transition-all shadow-sm hover:shadow-md"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <ThemeToggleButton />
                  <Link to="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all"><span>Login</span></Link>
                </div>
              )}
            </div>
            
            {/* --- MOBILE BUTTONS --- */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggleButton />
              {user ? (
                // If logged in, show hamburger
                <button onClick={() => setIsMenuOpen(true)} className="text-gray-600 dark:text-gray-300 p-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-slate-700/80 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
              ) : (
                // If logged out, show login button
                <Link to="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md text-sm">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-in Mobile Menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMenu}></div>
        <div className={`relative w-80 max-w-[85vw] h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-6 transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button onClick={closeMenu} className="absolute top-4 right-4 p-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-slate-700/80"><svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
          {user && (
            <div className="space-y-4 mt-8">
              <Link to="/profile" onClick={closeMenu} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-500/10 dark:hover:to-blue-500/10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg"><span className="text-white font-semibold text-lg">{getInitials(user.name)}</span></div>
                <div><p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{user.name}</p><p className="text-sm text-gray-500 dark:text-gray-400">View Profile</p></div>
              </Link>
              <hr className="border-gray-200/50 dark:border-slate-600/50"/>
              <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => `flex justify-between items-center py-3 px-4 font-semibold rounded-xl ${isActive ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}><span>📊 Dashboard</span>{(cartItems.length + todaysWorkouts.length) > 0 && <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{cartItems.length + todaysWorkouts.length}</span>}</NavLink>
              <NavLink to="/outlets" onClick={closeMenu} className={({ isActive }) => `block py-3 px-4 font-semibold rounded-xl ${isActive ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>🏪 Outlets</NavLink>
              <NavLink to="/workouts" onClick={closeMenu} className={({ isActive }) => `block py-3 px-4 font-semibold rounded-xl ${isActive ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>💪 Workouts</NavLink>
              <div className="pt-4 border-t border-gray-200/50 dark:border-slate-600/50"><button onClick={handleLogout} className="w-full text-left py-3 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-semibold flex items-center space-x-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg><span>Logout</span></button></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;