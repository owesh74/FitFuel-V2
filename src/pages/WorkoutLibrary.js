import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import LogWorkoutModal from '../components/LogWorkoutModal';

const WorkoutLibrary = () => {
  const [library, setLibrary] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const { data } = await api.get('/workouts/library');
        const grouped = data.reduce((acc, workout) => {
          (acc[workout.category] = acc[workout.category] || []).push(workout);
          return acc;
        }, {});
        setLibrary(grouped);
      } catch (error) {
        toast.error("Failed to load workout library.");
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const filteredLibrary = Object.keys(library).reduce((acc, category) => {
    const filteredWorkouts = library[category].filter(workout =>
      workout.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredWorkouts.length > 0) {
      acc[category] = filteredWorkouts;
    }
    return acc;
  }, {});

  const handleOpenModal = (workout) => {
    setSelectedWorkout(workout);
  };

  const handleCloseModal = () => {
    setSelectedWorkout(null);
  };

  const WorkoutSkeleton = () => (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-slate-700/50 animate-pulse shadow-lg">
        <div className="flex justify-between items-center">
          <div className="space-y-3 flex-1">
            <div className="h-5 w-3/5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 rounded-lg"></div>
            <div className="h-3 w-2/5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-lg"></div>
          </div>
          <div className="h-11 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 rounded-xl ml-4"></div>
        </div>
      </div>
    </div>
  );

  const getCategoryIcon = (category) => {
    const icons = {
      'Cardio': (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      ),
      'Strength': (
        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      'Flexibility': (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      'Sports': (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      ),
      'Yoga': (
        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      ),
      'Swimming': (
        <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
      'Cycling': (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      'Dance': (
        <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-1v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-1"></path>
        </svg>
      ),
      'default': (
        <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      )
    };
    return icons[category] || icons.default;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Enhanced Header */}
          <div className="text-center mb-16 space-y-6">
           
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-slate-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                Workout Library
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Discover your perfect workout and track every calorie burned on your fitness journey
              </p>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for any workout (e.g., 'Running', 'Squats')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 shadow-xl text-lg placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
          
          {/* Enhanced Content Grid */}
          <div className="space-y-16">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 rounded-2xl animate-pulse"></div>
                    <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, j) => <WorkoutSkeleton key={j} />)}
                  </div>
                </div>
              ))
            ) : Object.keys(filteredLibrary).length > 0 ? (
              Object.keys(filteredLibrary).map(category => (
                <div key={category} className="space-y-8">
                  {/* Enhanced Category Header */}
                  <div className="flex items-center space-x-6 group">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200/30 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(category)}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                        {category}
                      </h2>
                      <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                    </div>
                  </div>

                  {/* Enhanced Workout Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredLibrary[category].map(workout => (
                      <div key={workout._id} className="group relative">
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Card Content */}
                        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg group-hover:shadow-2xl transform group-hover:-translate-y-2 transition-all duration-500">
                          <div className="flex justify-between items-center space-x-4">
                            <div className="flex-1 space-y-2">
                              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                {workout.name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Ready to log</span>
                              </div>
                            </div>
                            
                            {/* Enhanced Button */}
                            <button 
                              onClick={() => handleOpenModal(workout)} 
                              className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transform group-hover:scale-110 transition-all duration-300 hover:shadow-xl active:scale-95"
                            >
                              <span className="relative z-10 flex items-center space-x-2">
                                <span>Log</span>
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                              </span>
                              
                              {/* Button Shine Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl mb-8 shadow-lg">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">
                  No workouts found
                </h3>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                  Try searching for "{searchTerm}" with different keywords
                </p>
              </div>
            )}
          </div>
        </div>
        {selectedWorkout && <LogWorkoutModal workout={selectedWorkout} onClose={handleCloseModal} />}
      </div>
    </>
  );
};

export default WorkoutLibrary;