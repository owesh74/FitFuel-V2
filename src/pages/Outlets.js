import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Outlets = () => {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const res = await api.get('/outlets');
        setOutlets(res.data);
      } catch (err) {
        toast.error('Failed to fetch outlets.');
      } finally {
        setLoading(false);
      }
    };
    fetchOutlets();
  }, []);

  const OutletSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border-2 border-transparent">
        <div className="animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="w-3 h-3 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                <div className="h-5 w-20 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
            </div>
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded-lg mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <div className="h-5 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500 dark:from-blue-300 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent mb-4">
            Food Outlets
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {loading ? (
            // Show skeleton loaders while fetching data
            [...Array(6)].map((_, i) => <OutletSkeleton key={i} />)
          ) : (
            outlets.map((outlet) => (
              <Link 
                key={outlet._id}
                to={`/outlets/${outlet._id}`}
                className="block transform hover:scale-105 transition-all duration-300 ease-in-out group"
              >
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl dark:hover:shadow-blue-900/50 transition-all duration-300 border-2 border-transparent hover:border-blue-200 dark:border-slate-700 dark:hover:border-blue-400 overflow-hidden">
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">AVAILABLE</div>
                    </div>
                    
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {outlet.name}
                    </h2>
                    
                    <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
                      {outlet.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          View Details →
                        </span>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Outlets;