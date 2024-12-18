"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ExerciseDetails = {
  date: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

type WorkoutPlan = {
  _id: string;
  planData: {
    workoutType: string;
    exercises: ExerciseDetails[];
  }[];
  planCompleted: boolean;
};

type CompletedExercise = {
  workoutType: string;
  exerciseName: string;
  sets: number;
  completedReps: number;
  weight: number | string;
};

export default function ProcessPlan() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completedReps, setCompletedReps] = useState(0);
  const [currentWeight, setCurrentWeight] = useState<number | string>("");
  const [completedData, setCompletedData] = useState<CompletedExercise[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedPlan = localStorage.getItem("currentPlan");
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    }
  }, []);

  const sendWorkoutDataToDB = async (
    finalCompletedData: CompletedExercise[]
  ) => {
    if (!finalCompletedData.length || !plan?._id) {
      console.error(
        "No data to send: completedData or workoutPlanId is missing."
      );
      return;
    }

    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutPlanId: plan?._id,
          completedData: finalCompletedData,
          completedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        console.log("Workout data saved successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to save workout data:", errorData);
      }
    } catch (error) {
      console.error("Error saving workout data:", error);
    }
  };

  const handleNext = async () => {
    if (!plan?.planData) return; // Ensure planData is defined
  
    const currentWorkout = plan.planData[currentWorkoutIndex];
    const currentExercise = currentWorkout?.exercises[currentExerciseIndex];
  
    if (!currentExercise) return;
  
    // When a set is completed, update completedData
    const updatedCompletedData = completedReps >= 0 ? [
      ...completedData,
      {
        workoutType: currentWorkout?.workoutType,
        exerciseName: currentExercise.name,
        sets: currentSetIndex + 1, 
        completedReps: completedReps,
        weight: currentWeight || currentExercise.weight,
      },
    ] : completedData;
  
    // If all sets for the current exercise are completed, proceed to next exercise/workout
    if (currentSetIndex + 1 >= currentExercise.sets) {
      // If all exercises for the current workout are done
      if (currentExerciseIndex + 1 >= currentWorkout?.exercises.length) {
        // If all workouts are completed
        if (currentWorkoutIndex + 1 >= plan.planData?.length) {
          console.log("Workout plan completed!");
  
          // Send the workout data to the database
          await sendWorkoutDataToDB(updatedCompletedData);
  
          // Call the API to delete the plan
          try {
            const response = await fetch(`/api/deletePlan/${plan._id}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              console.log("Workout plan deleted successfully!");
            } else {
              console.error("Failed to delete workout plan.");
            }
          } catch (error) {
            console.error("Error deleting workout plan:", error);
          }
  
          // Redirect to the record page
          router.push("/record");
        } else {
          // Move to the next workout
          setCurrentWorkoutIndex(currentWorkoutIndex + 1);
          setCurrentExerciseIndex(0);
          setCurrentSetIndex(0);
          setCompletedReps(0);
        }
      } else {
        // Move to the next exercise
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
        setCompletedReps(0);
      }
    } else {
      // Move to the next set if not all sets are completed for this exercise
      setCurrentSetIndex(currentSetIndex + 1);
      setCompletedReps(0); // Reset completedReps after moving to the next set
    }
  
    // Update the completedData state
    setCompletedData(updatedCompletedData);
  };
  

  if (!plan) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">No workout plan found!</h1>
      </div>
    );
  }

  const currentWorkout = plan.planData[currentWorkoutIndex];
  const currentExercise = currentWorkout?.exercises[currentExerciseIndex];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Workout Progress</h1>
      {currentExercise ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {currentWorkout?.workoutType} - {currentExercise.name}
          </h2>
          <p className="mb-2">
            Set {currentSetIndex + 1} of {currentExercise.sets}
          </p>
          <p className="mb-4">Reps: {currentExercise.reps}</p>

          <div className="flex space-x-2 mb-4">
            {Array.from({ length: currentExercise.reps }).map((_, i) => (
              <div
                key={i}
                onClick={() => setCompletedReps(completedReps === i + 1 ? 0 : i + 1)}
                className={`w-full h-2 cursor-pointer ${
                  i < completedReps ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>


          <div className="mb-4">
            <label className="block mb-2">Adjust Weight:</label>
            <input
              type="number"
              defaultValue={currentWeight || currentExercise.weight}
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              placeholder="Weight (kg)"
              className="w-full p-2 border rounded-md"
            />
          </div>


          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {currentSetIndex + 1 >= currentExercise.sets
              ? currentExerciseIndex + 1 >= currentWorkout.exercises.length
                ? "Finish Workout"
                : "Next Exercise"
              : "Next Set"}
          </button>
        </div>
      ) : (
        <p>No exercises available.</p>
      )}
    </div>
  );
}
