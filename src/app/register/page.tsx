"use client";
import { useForm } from "react-hook-form";
import { passwordStrength } from "check-password-strength";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Navbar from "../components/Navbar";

import { UploadButton } from "@/utils/uploadthing";


export default function Page() {
    const Router = useRouter();
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const [profileImage, setProfileImage] = useState<string | null>(null); // Change to string

    // Handle form submission
    const submitForm = async (formData: any) => {
        const dataToSubmit = {
            ...formData,
            profileImage: profileImage || '/app-logo.png'
        };

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSubmit),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (responseData.error.includes("Email")) {
                    setError("email", { message: responseData.error });
                } else if (responseData.error.includes("Username")) {
                    setError("username", { message: responseData.error });
                }
                return;
            }

            Router.push("/login");
        } catch (error) {
            console.error("Error:", error);
        }
    };



    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-lg shadow-lg">
                <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                        Register Your Account
                    </h1>

                    {/* Username Field */}
                    <div>
                        <label
                            htmlFor="inputUsername"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Username
                        </label>
                        <input
                            id="inputUsername"
                            type="text"
                            className="w-full px-4 py-3 border rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Username"
                            {...register("username", { required: "Username is required" })}
                        />
                        {errors.username && (
                            <span className="text-sm text-red-500 mt-1">
                                {String(errors.username.message)}
                            </span>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="inputEmail"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email address
                        </label>
                        <input
                            id="inputEmail"
                            type="email"
                            className="w-full px-4 py-3 border rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Email address"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                                    message: "Invalid email format",
                                },
                            })}
                        />
                        {errors.email?.message && (
                            <span className="text-sm text-red-500 mt-1">
                                {String(errors.email.message)}
                            </span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="inputPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="inputPassword"
                            type="password"
                            className="w-full px-4 py-3 border rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Password"
                            {...register("password", {
                                required: "Password is required",
                                maxLength: { value: 255, message: "Exceeds the length limit!" },
                                validate: {
                                    strongPassword: (value) => {
                                        const strength = passwordStrength(value).value;
                                        return (
                                            strength === "Medium" ||
                                            strength === "Strong" ||
                                            "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character."
                                        );
                                    },
                                },
                            })}
                        />
                        {errors.password && (
                            <span className="text-sm text-red-500 mt-1">
                                {String(errors.password.message)}
                            </span>
                        )}
                    </div>

                    {/* Profile Image Field */}
                    <div>
                        <label
                            htmlFor="profileImage"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Profile Picture (Optional)
                        </label>

                        <div className="flex items-center space-x-4">
                           
                           <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                // Do something with the response
                                setProfileImage(res[0].url);
                                alert("Upload Completed");
                                }}
                                onUploadError={(error: Error) => {
                                // Do something with the error.
                                alert(`ERROR! ${error.message}`);
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-700 hover:bg-blue-500 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
