"use client";
import React, { useState } from 'react';
import WorkoutSelectionForm from './WorkoutSelectionForm';
import ExerciseList from './ExerciseList';
import { useRouter } from 'next/navigation';

export type Inputs = {
  date: string;
  
    chest: boolean;
    back: boolean;
    legs: boolean;
    shoulders: boolean;
    arms: boolean;
    abs: boolean;
  
};

export type ExerciseDetails = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

export type Exercise = {
  workoutType: string;
  exercises: ExerciseDetails[];
};

export default function AddPlanForm() {
  const [formData, setFormData] = useState<Inputs | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([]);
  const [, setPlan] = useState<Exercise[]>([]); 
  const [shows,setShows] = useState(false);
  const router = useRouter();

 
  const handleFormSubmit = (data: Inputs) => {
    setFormData(data);
    const selectedWorkouts = Object.entries(data)
      .filter(([key, value]) => value === true && key !== 'date')
      .map(([key]) => ({ workoutType: key.toUpperCase(), exercises: [] }));
    setWorkoutExercises(selectedWorkouts);
    setShows(true);
  };

  const addExercise = (workoutType: string, exercise: ExerciseDetails) => {
    setWorkoutExercises((prev) =>
      prev.map((workout) =>
        workout.workoutType === workoutType
          ? { ...workout, exercises: [...workout.exercises, exercise] }
          : workout
      )
    );
  };

  const updateExercise = (workoutType: string, index: number, updatedExercise: ExerciseDetails) => {
    setWorkoutExercises((prev) =>
      prev.map((workout) =>
        workout.workoutType === workoutType
          ? {
            ...workout,
            exercises: workout.exercises.map((exercise, i) =>
              i === index ? updatedExercise : exercise
            ),
          }
          : workout
      )
    );
  };

  const deleteExercise = (workoutType: string, index: number) => {
    setWorkoutExercises((prev) =>
      prev.map((workout) =>
        workout.workoutType === workoutType
          ? {
            ...workout,
            exercises: workout.exercises.filter((_, i) => i !== index),
          }
          : workout
      )
    );
  };

  const handleAddPlans = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setPlan(workoutExercises); 

    try {
      const response = await fetch('/api/addplans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planData:workoutExercises,
          planCompleted:false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout data to MongoDB');
      }
    } catch (error) {
      console.error('Error saving data to database:', error);
    }
    router.push('/showplans');
    console.log("Plan added:", workoutExercises);
  };

  return (
    <div className="flex justify-center  bg-gray-50">
  {/* Show WorkoutSelectionForm only if `shows` is false */}
  {!shows ? (
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
      <WorkoutSelectionForm onSubmit={handleFormSubmit} />
    </div>
  ) : (
    // Show ExerciseList and button after form submission
    formData && (
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md space-y-6">
        <ExerciseList
          formData={formData}
          workoutExercises={workoutExercises}
          addExercise={addExercise}
          updateExercise={updateExercise}
          deleteExercise={deleteExercise}
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShows(false)}
            className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            GO BACK
          </button>
          
          <form onSubmit={handleAddPlans} className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Add to Plan
            </button>
          </form>
        </div>
      </div>
    )
  )}
</div>

  
  );
}
