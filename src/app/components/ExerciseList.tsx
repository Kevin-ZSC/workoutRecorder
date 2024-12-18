import React, { useState } from 'react';
import { Inputs, Exercise, ExerciseDetails } from './AddPlanForm';

type Props = {
    formData: Inputs;
    workoutExercises: Exercise[];
    addExercise: (workoutType: string, exercise: ExerciseDetails) => void;
    updateExercise: (workoutType: string, index: number, updatedExercise: ExerciseDetails) => void;
    deleteExercise: (workoutType: string, index: number) => void;
    
};

export default function ExerciseList({
    formData,
    workoutExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    
}: Props) {
    const [editIndex, setEditIndex] = useState<{ workoutType: string; index: number } | null>(null);
    const [editForm, setEditForm] = useState<ExerciseDetails | null>(null);


    

    return (
        <div className="mt-6">
            <h1 className="text-xl font-bold mb-6 text-center">Workout Plan for {formData.date}</h1>
            {workoutExercises.map((workout, workoutIndex) => (
                <div key={workoutIndex} className="p-4 border border-gray-300 rounded-md shadow-sm mb-4">
                    <h2 className="text-lg font-semibold mb-2">{workout.workoutType} Exercises</h2>
                    <ul className="list-disc pl-5 mb-4">
                        {workout.exercises.map((exercise, exerciseIndex) => (
                            <li key={exerciseIndex} className="flex justify-between items-center text-gray-700">
                                {editIndex?.workoutType === workout.workoutType &&
                                editIndex?.index === exerciseIndex ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (editForm) {
                                                updateExercise(
                                                    workout.workoutType,
                                                    exerciseIndex,
                                                    editForm
                                                );
                                                setEditIndex(null);
                                                setEditForm(null);
                                            }
                                        }}
                                        className="flex flex-col space-y-2"
                                    >
                                        <input
                                            type="text"
                                            value={editForm?.name || ""}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm!, name: e.target.value })
                                            }
                                            placeholder="Exercise name"
                                            className="p-2 border border-gray-300 rounded-md"
                                        />
                                        <div className="flex space-x-2">
                                            <input
                                                type="number"
                                                value={editForm?.sets || ""}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm!,
                                                        sets: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                placeholder="Sets"
                                                className="w-1/3 p-2 border border-gray-300 rounded-md"
                                            />
                                            <input
                                                type="number"
                                                value={editForm?.reps || ""}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm!,
                                                        reps: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                placeholder="Reps"
                                                className="w-1/3 p-2 border border-gray-300 rounded-md"
                                            />
                                            <input
                                                type="number"
                                                value={editForm?.weight || ""}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm!,
                                                        weight: parseFloat(e.target.value) || 0,
                                                    })
                                                }
                                                placeholder="Weight (kg)"
                                                className="w-1/3 p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                        >
                                            Save
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <div>
                                            <strong>{exercise.name}</strong>: {exercise.sets} sets,{" "}
                                            {exercise.reps} reps, {exercise.weight} kg
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                                                onClick={() => {
                                                    setEditIndex({
                                                        workoutType: workout.workoutType,
                                                        index: exerciseIndex,
                                                    });
                                                    setEditForm(exercise);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-2 py-1 bg-red-600 text-white rounded-md"
                                                onClick={() =>
                                                    deleteExercise(workout.workoutType, exerciseIndex)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const dateInput = form.elements.namedItem("date") as HTMLInputElement;
                            const nameInput = form.elements.namedItem("name") as HTMLInputElement;
                            const setsInput = form.elements.namedItem("sets") as HTMLInputElement;
                            const repsInput = form.elements.namedItem("reps") as HTMLInputElement;
                            const weightInput = form.elements.namedItem("weight") as HTMLInputElement;

                            if (nameInput.value.trim()) {
                                addExercise(workout.workoutType, {
                                    date:dateInput.value,
                                    name: nameInput.value.trim(),
                                    sets: parseInt(setsInput.value) || 0,
                                    reps: parseInt(repsInput.value) || 0,
                                    weight: parseFloat(weightInput.value) || 0,
                                });
                                form.reset();
                            }
                        }}
                        className="space-y-2"
                    >
                         
                         <input
                            type="date"
                            name="date"
                            defaultValue={formData.date}
                            placeholder="Exercise name"
                            className="hidden"
                        />
                        
                        <input
                            type="text"
                            name="name"
                            placeholder="Exercise name"
                            className="block w-full p-2 border border-gray-300 rounded-md"
                        />
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="sets"
                                placeholder="Sets"
                                className="w-1/3 p-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="number"
                                name="reps"
                                placeholder="Reps"
                                className="w-1/3 p-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="number"
                                name="weight"
                                placeholder="Weight (kg)"
                                className="w-1/3 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            Add Exercise
                        </button>
                        
                    </form>
                </div>
            ))}
        </div>
    );
}
