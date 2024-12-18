'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Inputs } from './AddPlanForm';


type Props = {
  onSubmit: (data: Inputs) => void;
};

export default function WorkoutSelectionForm({ onSubmit }: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
 

  const submitForm: SubmitHandler<Inputs> = (data) => {
    onSubmit(data);
    setIsSubmitted(true);
   
   
  };

  
  return (
    <div>
      
      
        <form
          onSubmit={handleSubmit(submitForm)}
          className="p-4 space-y-4 bg-gray-100 rounded-md shadow-md flex flex-col"
        >
          <div className="flex items-center space-x-2 justify-center">
            <label htmlFor="date" className="text-lg font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              {...register("date", { required: true })}
              className="mt-1 block w-36 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.date && <span className="text-red-500">This field is required</span>}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-1">
            {["chest", "back", "legs", "shoulders", "arms", "abs"].map((exercise) => (
              <label key={exercise} htmlFor={exercise} className="relative flex items-center space-x-2 text-lg font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  id={exercise}
                  {...register(exercise as keyof Inputs)}
                  className="peer opacity-0 w-0 h-0"
                />
                {/* Custom Styled Checkbox */}
                <div className="w-auto min-w-[120px] h-10 flex justify-center items-center border-none border-gray-400 rounded-md 
                  bg-white transition-all duration-200 peer-checked:bg-blue-500 peer-checked:text-white">
                  <span className="font-bold text-sm">{exercise.toUpperCase()}</span>
                </div>
              </label>
            ))}
          </div>

          {!isSubmitted && (
            <button
              type="submit"
              className="w-2/5 mt-4 px-4 py-2 mx-auto bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          )}
        </form>
      

      
    </div>
  );
}
