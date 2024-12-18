"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
type ExerciseDetails = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

type WorkoutPlan = {
  _id: any;
  planData: any;
  date: string;
  days: string;
  workoutType: string;
  exercises: ExerciseDetails[];
};

export default function PlanInDetail() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const router = useRouter();
  // Fetch workout plan data on component mount
  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await fetch("/api/showplans");
        if (!response.ok) {
          throw new Error("Failed to fetch workout plans");
        }
        const data = await response.json();
        setPlans(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    };

    fetchWorkoutData();
  }, []);

  const handleDelete = async (index: number) => {
    
    const planToDelete = plans[index];
    const planId = planToDelete._id; // This should be the correct ObjectId string
    if (!planId) {
      console.error("Plan ID is missing");
      return;
    }
    try {
      const response = await fetch(`/api/deletePlan/${planId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || "Failed to delete the workout plan");
      }
  
      setPlans((prevData) => prevData.filter((_, i) => i !== index));
      
      console.log("Plan deleted successfully");
    } catch (error) {
      console.error("Error deleting the plan:", error);
    } 
  };
  
  
  const handleStart = (index: number) => {
    const planData = plans[index];
    localStorage.setItem('currentPlan', JSON.stringify(planData));
    router.push('/processPlan');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Workout Plans</h1>
      {plans.length > 0 ? (
        plans.map((plan, index) => (
          <div
            key={index}
            className="mb-6 p-6 bg-white rounded-lg shadow-lg space-y-6 border border-gray-200"
          >
             <h2 className="text-2xl font-semibold text-gray-700">
       
        {plan.planData[0]?.exercises[0]?.date && (
          <span className="text-lg font-normal text-gray-500 ml-2">
            {`Date: ${plan.planData[0].exercises[0].date}-- Workout Plan`}
          </span>
        )}
      </h2>
  
            <div className="space-y-6">
              {plan.planData.map((item: { workoutType: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; exercises: any[]; }, i: React.Key | null | undefined) => (
                <div key={i} className="p-4 bg-gray-100 rounded-md">
                  <h3 className="text-xl font-bold text-blue-600 mb-3">{item.workoutType}</h3>
  
                  <div className="space-y-4">
                    {item.exercises.map((k, j) => (
                      <div key={j} className="p-4 bg-white shadow-md rounded-md">
                        <h4 className="text-lg font-semibold text-gray-800">{`Exercise #${j + 1} ${k.name}`}</h4>
                        
                        <ul className="space-y-1">
                          
                          <li>
                            <span className="font-medium text-gray-700">Sets:</span> {k.sets}
                          </li>
                          <li>
                            <span className="font-medium text-gray-700">Reps:</span> {k.reps}
                          </li>
                          <li>
                            <span className="font-medium text-gray-700">Weight:</span> {k.weight} kg
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
  
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => handleDelete(index)}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => handleStart(index)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
              >
                Start
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 text-lg">No workout plans found.</p>
      )}
    </div>
  );
  
}
