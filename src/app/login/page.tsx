"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";


export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState("");
  const Router = useRouter();
  
  interface FormData {
    email: string;
    password: string;
    remember: boolean;
  }

  const submitForm = (data: FormData) => {
    setErrorMessage("");
    fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to login");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("user", data.user.email);
        Router.push("/");
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-md mx-auto p-8 mt-10 bg-white rounded-lg shadow-lg">
        <form
          className="space-y-6"
          onSubmit={handleSubmit(submitForm)}
        >
          <h1 className="text-3xl font-bold text-center text-gray-900 ">
            Please sign in
          </h1>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-center text-sm text-red-500 bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
              {errorMessage}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="inputEmail"
              className="block text-sm font-medium text-gray-900 mb-2"
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
              autoFocus
            />
            {errors.email && (
              <span className="text-sm text-red-500 mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="inputPassword"
              className="block text-sm font-medium text-gray-900  mb-2"
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
              })}
            />
            {errors.password && (
              <span className="text-sm text-red-500 mt-1">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-800 hover:bg-blue-500 focus:ring-4 focus:ring-primary-300 rounded-lg   "
          >
            Sign in
          </button>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-800 hover:underline "
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
