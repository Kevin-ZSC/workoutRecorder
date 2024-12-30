"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { passwordStrength } from "check-password-strength";
import { UploadButton } from "@/utils/uploadthing";

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
 
  const router = useRouter();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const email = sessionStorage.getItem("user");

      if (!email) {
        setError("No user email found in session.");
        return;
      }

      try {
        const response = await fetch(
          `/api/signin?email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.username);
          setEmail(data.user.email);
          setUserImage(data.user.profileImage);
          setValue("username", data.user.username);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch {
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleTogglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  const handleDeleteAccount = async () => {
    const email = sessionStorage.getItem("user");
    if (!email) {
      setError("No user email found in session.");
      return;
    }

    try {
      const response = await fetch("/api/deleteuser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      router.push("/login");
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("user");
    } catch (error) {
      setError((error as any).message);
    }
  };

  const checkUniqueName = async (username: string) => {
    if (username === userName) {
      return true;
    }

    try {
      const response = await fetch(
        `/api/checkUser?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (response.ok) {
        return true;
      } else {
        return data.error;
      }
    } catch {
      return "Failed to check username.";
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const updatedData: any = {
        username: data.username,
        email,
        newPassword: data.newPassword,
        profileImage: userImage,
      };

      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return setError("Passwords do not match");
      }

      const response = await fetch("/api/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await response.json();
      alert("Profile updated successfully!");
      router.push("/");
    } catch (error) {
      setError((error as any).message);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-lg mx-auto p-6 bg-white border border-gray-300 rounded-md shadow-lg mt-6">
          <h1 className="text-2xl font-bold text-center mb-6">Profile Page</h1>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email || ""}
              {...register("email")}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              disabled
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              defaultValue={userName || ""}
              {...register("username", {
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters long",
                },
                maxLength: {
                  value: 20,
                  message: "Username cannot exceed 20 characters",
                },
                validate: (value) => checkUniqueName(value),
              })}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.username && (
              <span className="text-sm text-red-500">
                {String(errors.username.message)}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="profileImage"
              className="block text-sm font-semibold text-gray-700"
            >
              Profile Picture:
            </label>
            <div className="flex items-center space-x-4 ">
              <Image
                src={userImage || "/app-logo.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <UploadButton
                className="mt-4 ut-button:bg-blue-500 ut-button:ut-readying:bg-blue-500/50"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  setUserImage(res[0].url);
                  alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={handleTogglePasswordForm}
              className="w-full py-2 bg-blue-600 text-white rounded-md"
            >
              Change Password
            </button>
          </div>

          {showPasswordForm && (
            <div className="bg-gray-100 p-6 rounded-md mt-4">
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-gray-700"
                >
                  New Password:
                </label>
                <input
                  type="password"
                  id="newPassword"
                  {...register("newPassword", {
                    required: "Password is required",
                    maxLength: {
                      value: 255,
                      message: "Exceeds the length limit!",
                    },
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
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Enter new password"
                />
                {errors.newPassword && (
                  <span className="text-sm text-red-500">
                    {String(errors.newPassword.message)}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("newPassword") ||
                      "Passwords do not match",
                  })}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <span className="text-sm text-red-500">
                    {String(errors.confirmPassword.message)}
                  </span>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-6">
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-md"
            >
              Update Profile
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full py-2 bg-red-600 text-white rounded-md"
            >
              Delete Account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
