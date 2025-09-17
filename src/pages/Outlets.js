import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Outlets = () => {
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const res = await api.get('/outlets');
        setOutlets(res.data);
      } catch (err) {
        toast.error('Failed to fetch outlets.');
      }
    };
    fetchOutlets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent mb-4">
            Food Outlets
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {outlets.map((outlet) => (
            <Link 
              key={outlet._id}
              to={`/outlets/${outlet._id}`}
              className="block transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 group overflow-hidden">
                {/* Colorful top accent */}
                
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
                    <div className="text-xs text-gray-500 font-medium bg-green-50 px-2 py-1 rounded-full">AVAILABLE</div>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {outlet.name}
                  </h2>
                  
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                    {outlet.description}
                  </p>
                  
                  {/* Bottom accent */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        View Details →
                      </span>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Outlets;