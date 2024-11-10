import { Navbar, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import React from "react";
import { FaMoon } from "react-icons/fa";

export default function Header() {
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-green-500 via-green-500 to-blue-500 rounded-lg text-white">
          Let's
        </span>
        Vote
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to='signin'>
        <Button gradientDuoTone="greenToBlue">
            Sign In
        </Button>
        </Link>
      </div>
    </Navbar>
  );
}
