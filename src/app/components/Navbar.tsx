"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation";



export default function Navbar() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const Router = useRouter()
  useEffect(() => {
    // Check sessionStorage on the client side
    const loggedIn = !!sessionStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn);
  }, []);

   useEffect(() => {
      const fetchUserData = async () => {
        const userEmail = sessionStorage.getItem("user");
        try {
          const response = await fetch(
            `/api/signin?email=${encodeURIComponent(userEmail as string)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
  
          if (response.ok) {
            const data = await response.json();
            
            setProfileImage(data.user.profileImage);
            
          } 
        } catch {
          console.error("Error fetching user data");
        }
      };
  
      fetchUserData();
    }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
    Router.push("/login"); // Redirect to login
  };

  return (
    <nav className="flex justify-between items-center bg-blue-700 py-4 px-8 text-white shadow-lg">
      {/* App Logo */}
      <div className="flex items-center space-x-3">
        <Image
          src="/app-logo.png" 
          alt="App Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-3 text-lg">
        <li className="list-none hover:text-gray-300 cursor-pointer">
          <Link href="/">Home</Link>
        </li>
        <li className="list-none hover:text-gray-300 cursor-pointer">
          <Link href="/showplans">Plans</Link>
        </li>
        <li className="list-none hover:text-gray-300 cursor-pointer">
          <Link href="/record">Record</Link>
        </li>
      </div>

      {/* Right Section: Profile Dropdown */}
      {isLoggedIn ? (
        <div className="relative flex items-center space-x-3">
          {/* Profile Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-600 rounded-full p-2"
          >
            <Image
              src={profileImage||"/app-logo.png" }
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
            {/* <span className="hidden md:block text-sm">Profile</span> */}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ul className="absolute top-14 right-0 mt-2 w-48 bg-white rounded-md shadow-lg text-gray-700 z-10">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Link href="/profile">View Profile</Link>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      ) : (
        <li className="list-none hover:text-gray-300 cursor-pointer">
          <Link href="/login">Login</Link>
        </li>
      )}
    </nav>
  );
}
