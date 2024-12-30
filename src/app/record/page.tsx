"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type CompletedExercise = {
  workoutType: string;
  exerciseName: string;
  sets: number;
  completedReps: number;
  weight: number;
};

type RecordData = {
  completedAt: string;
  completedData: CompletedExercise[];
  workoutPlanId: string;
  _id: string;
};

const RecordPage = () => {
  const [completedData, setCompletedData] = useState<RecordData[]>([]);
  const router = useRouter();
   useEffect(() => {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        router.push("/login");
      }
    }, []);
  
  // Fetch workout data from the database via the API
  useEffect(() => {
  
    const fetchWorkoutData = async () => {
      try {
        const response = await fetch("/api/records");
        if (!response.ok) {
          throw new Error("Failed to fetch workout records");
        }
        const data = await response.json();
        // Sort workouts by `completedAt` in descending order
        const sortedData = data.sort(
          (a: RecordData, b: RecordData) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
        setCompletedData(sortedData);
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    };

    fetchWorkoutData();
  }, []);

  // Delete a workout record
  const deleteWorkoutRecord = async (id: string) => {
    try {
      console.log("Deleting record with ID:", id); // Debug log
      const response = await fetch(`/api/records?id=${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete workout record");
      }
  
      setCompletedData(completedData.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting workout record:", error);
    }
  };
  

  // Function to group sets by exercise
  const groupExercises = (exercises: CompletedExercise[]) => {
    return exercises.reduce((acc: any, exercise) => {
      const key = `${exercise.workoutType}-${exercise.exerciseName}`;
      if (!acc[key]) {
        acc[key] = { ...exercise, sets: [] };
      }
      acc[key].sets.push({
        setNumber: exercise.sets,
        completedReps: exercise.completedReps,
        weight: exercise.weight,
      });
      return acc;
    }, {});
  };

  

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="p-6 bg-gray-50">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Workout Records</h1>

        {completedData.length > 0 ? (
          completedData.map((record, index) => {
            const groupedExercises = groupExercises(record.completedData);
            return (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">
                    Completed At:{" "}
                    <span className="font-medium">
                      {new Date(record.completedAt).toLocaleDateString()}
                    </span>
                  </p>
                  <button
                    onClick={() => deleteWorkoutRecord(record._id)}
                    className="text-red-500 font-medium text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>

                {/* Grouped Exercises */}
                {Object.values(groupedExercises).map((exercise: any, i: number) => (
                  <div key={i} className="mt-6">
                    {/* Display Workout Type (only first group) */}
                    {i === 0 && (
                      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                        {exercise.workoutType}
                      </h2>
                    )}

                    {/* Exercise name */}
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      {exercise.exerciseName}
                    </h3>

                    {/* Set details */}
                    {exercise.sets.map((set: any, j: number) => (
                      <p key={j} className="text-sm text-gray-600 mb-1">
                        Set {set.setNumber}: {set.completedReps} reps at{" "}
                        <span className="font-medium">{set.weight} kg</span>
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-600 text-lg">No workout records found.</p>
        )}
      </div>
    </div>
  );
};

export default RecordPage;
