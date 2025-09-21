import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import toast from 'react-hot-toast';

const LogWorkoutModal = ({ workout, onClose }) => {
  const { logWorkout } = useWorkout();
  const [duration, setDuration] = useState(30);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const durationOptions = [10, 15, 20, 30, 45, 60];

  // --- THIS FUNCTION IS NOW CORRECTED ---
  const handleSubmit = () => {
    let payload;
    if (workout.logType === 'time') {
      payload = { workoutId: workout._id, duration };
    } else {
      payload = { workoutId: workout._id, sets, reps };
    }
    // We now pass the entire payload object
    logWorkout(payload);
    toast.success(`${workout.name} logged!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-sm border dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-4">Log: {workout.name}</h2>
        
        {workout.logType === 'time' ? (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Select Duration (minutes)</label>
            <div className="grid grid-cols-3 gap-2">
              {durationOptions.map(opt => (
                <button key={opt} onClick={() => setDuration(opt)} className={`p-3 rounded-lg font-medium transition-colors ${duration === opt ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'}`}>{opt}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Sets</label>
              <input type="number" value={sets} onChange={e => setSets(parseInt(e.target.value))} min="1" className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Reps per Set</label>
              <input type="number" value={reps} onChange={e => setReps(parseInt(e.target.value))} min="1" className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"/>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button onClick={onClose} className="w-full py-3 rounded-lg bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-200 font-semibold hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="w-full py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 shadow-md">Log Workout</button>
        </div>
      </div>
    </div>
  );
};

export default LogWorkoutModal;