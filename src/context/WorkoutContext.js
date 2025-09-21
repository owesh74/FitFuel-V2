import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTodaysWorkouts = async () => {
      if (user) {
        const { data } = await api.get('/workouts/today');
        setTodaysWorkouts(data);
      }
    };
    fetchTodaysWorkouts();
  }, [user]);

  // --- THIS FUNCTION IS NOW CORRECTED ---
  const logWorkout = async (payload) => {
    // It now sends the entire payload object to the backend
    const { data } = await api.post('/workouts', payload);
    setTodaysWorkouts([...todaysWorkouts, data]);
  };
  
  const removeWorkout = async (id) => {
    await api.delete(`/workouts/${id}`);
    setTodaysWorkouts(todaysWorkouts.filter(w => w._id !== id));
  };
  
  const totalCaloriesBurned = todaysWorkouts.reduce((acc, workout) => acc + workout.caloriesBurned, 0);

  return (
    <WorkoutContext.Provider value={{ todaysWorkouts, logWorkout, removeWorkout, totalCaloriesBurned }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);