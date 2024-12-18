import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <>
      <nav className="flex justify-center space-x-8 text-xl bg-blue-700 py-3 text-white">
        <li className="list-none hover:text-gray-300 cursor-pointer">
          <Link href="/">
            Home
          </Link>
        </li>
        <li className="list-none hover:text-gray-300 cursor-pointer">
          <Link href="/showplans">
            My Plans
          </Link>
        </li>
        <li className="list-none hover:text-gray-300 cursor-pointer">
          <Link href="/record">
            Record
          </Link>
        </li>
      </nav>
    </>
  );
}
