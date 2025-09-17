import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

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

  const NavItem = ({ to, children }) => (
    <NavLink 
      to={to} 
      onClick={closeMenu}
      className={({ isActive }) => 
        `font-medium transition-colors duration-200 relative group py-2 flex items-center space-x-2 ${isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`
      }
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
    </NavLink>
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-blue-700 transition-all duration-300">FitFuel</h1>
              <p className="text-xs text-gray-500 -mt-1">Healthy Choices</p>
            </div>
          </Link>

          {/* Desktop Menu & Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* RESTORED: Separate text links */}
                <NavItem to="/dashboard">Dashboard</NavItem>
                <NavItem to="/outlets">Outlets</NavItem>
                
                <div className="flex items-center space-x-4 pl-6 border-l">
                  {/* RESTORED: Standalone cart icon */}
                  <Link to="/dashboard" className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {cartItems.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartItems.length}</span>
                    )}
                  </Link>
                  
                  {/* Profile link remains combined with user info */}
                  <Link to="/profile" className="flex items-center space-x-3 bg-gray-50 rounded-full pl-1 pr-4 py-1 border hover:bg-gray-100 hover:shadow-sm transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">{getInitials(user.name)}</span>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">Personal Info</span>
                  </Link>
                  
                  <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center border border-red-200">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m0 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                <span>Login</span>
              </Link>
            )}
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-purple-600 p-2 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{isMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />)}</svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen py-4' : 'max-h-0'} overflow-hidden`}>
          <div className="border-t border-gray-100">
             {user ? (
                <div className="space-y-2 pt-4">
                  <Link to="/profile" onClick={closeMenu} className="flex items-center space-x-3 px-2 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-semibold text-lg">{getInitials(user.name)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-lg">Personal Info</p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                  </Link>
                  <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => `flex justify-between items-center py-3 px-4 mx-2 font-medium rounded-lg ${isActive ? 'bg-purple-50 text-purple-600' : 'hover:bg-purple-50'}`}>
                    <span>📊 Dashboard / My Meal</span>
                    {cartItems.length > 0 && <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{cartItems.length}</span>}
                  </NavLink>
                  <NavLink to="/outlets" onClick={closeMenu} className={({ isActive }) => `block py-3 px-4 mx-2 font-medium rounded-lg ${isActive ? 'bg-purple-50 text-purple-600' : 'hover:bg-purple-50'}`}>🏪 Outlets</NavLink>
                  <div className="px-2 pt-2">
                    <button onClick={handleLogout} className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center space-x-3 border border-red-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-2 pt-4">
                  <Link to="/login" onClick={closeMenu} className="block py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium text-center hover:from-purple-700 hover:to-blue-700 shadow-md">Login to Continue</Link>
                </div>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;