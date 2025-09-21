import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
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

  // The simple theme toggle button
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
      <nav className="bg-white dark:bg-slate-800 shadow-md border-b border-gray-100 dark:border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
              <div><h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">FitFuel</h1><p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Healthy Choices</p></div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => `font-medium transition-colors relative group py-2 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'}`}><span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all"></span>Dashboard</NavLink>
                  <NavLink to="/outlets" className={({ isActive }) => `font-medium transition-colors relative group py-2 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'}`}><span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all"></span>Outlets</NavLink>
                  <div className="flex items-center space-x-4 pl-6 border-l border-gray-200 dark:border-slate-600">
                    <ThemeToggleButton />
                    <Link to="/dashboard" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>{cartItems.length > 0 && ( <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-red-100 bg-red-600 rounded-full">{cartItems.length}</span> )}</Link>
                    <Link to="/profile" className="flex items-center space-x-3 bg-gray-50 dark:bg-slate-700 rounded-full pl-1 pr-4 py-1 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"><div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm"><span className="text-white font-semibold text-sm">{getInitials(user.name)}</span></div><span className="text-gray-700 dark:text-gray-200 font-medium text-sm">{user.name}</span></Link>
                    <button onClick={handleLogout} className="bg-red-50 dark:bg-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 px-3 py-2.5 rounded-xl font-medium transition-colors flex items-center border border-red-200 dark:border-red-500/30"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <ThemeToggleButton />
                  <Link to="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-transform transform hover:scale-105 shadow-md flex items-center space-x-2"><span>Login</span></Link>
                </div>
              )}
            </div>

            {/* Mobile Buttons */}
            <div className="md:hidden">
              {user ? (
                <button onClick={() => setIsMenuOpen(true)} className="text-gray-600 dark:text-gray-300 p-2 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
              ) : (
                <div className="flex items-center space-x-2">
                  <ThemeToggleButton />
                  <Link to="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md text-sm">Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-in Mobile Menu */}
      <div className={`fixed inset-0 z-50 transition-transform transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMenu}></div>
        <div className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-slate-800 shadow-2xl p-6">
          <button onClick={closeMenu} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          {user && (
            <div className="space-y-4 mt-8">
              <Link to="/profile" onClick={closeMenu} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"><div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-md"><span className="text-white font-semibold text-lg">{getInitials(user.name)}</span></div><div><p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{user.name}</p><p className="text-sm text-gray-500 dark:text-gray-400">View Profile</p></div></Link>
              <hr className="border-gray-200 dark:border-slate-600"/>
              <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => `flex justify-between items-center py-3 px-3 font-medium rounded-lg ${isActive ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'}`}><span>📊 Dashboard</span>{cartItems.length > 0 && <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{cartItems.length}</span>}</NavLink>
              <NavLink to="/outlets" onClick={closeMenu} className={({ isActive }) => `block py-3 px-3 font-medium rounded-lg ${isActive ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'}`}>🏪 Outlets</NavLink>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                <div className="flex justify-between items-center px-3 py-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Theme</span>
                  <ThemeToggleButton />
                </div>
                <button onClick={handleLogout} className="w-full mt-2 text-left py-3 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium flex items-center space-x-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg><span>Logout</span></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;