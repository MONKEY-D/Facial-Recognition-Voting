import { Navbar, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { FaMoon } from "react-icons/fa";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check login status from localStorage
    const user = localStorage.getItem("user");
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (user && loginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // Update state
    setIsLoggedIn(false);

    // Redirect to SignIn page
    navigate("/signin");
  };

  // Determine the current path to show Register or Login links
  const isOnSignInPage = location.pathname === "/signin";
  const isOnSignUpPage = location.pathname === "/signup";

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
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            gradientDuoTone="greenToBlue"
          >
            Logout
          </Button>
        ) : (
          <>
            {isOnSignInPage && (
              <Link to="/signup">
                <Button gradientDuoTone="greenToBlue">
                  Register
                </Button>
              </Link>
            )}
            {isOnSignUpPage && (
              <Link to="/signin">
                <Button gradientDuoTone="greenToBlue">
                  Login
                </Button>
              </Link>
            )}
            {!isOnSignInPage && !isOnSignUpPage && (
              <Link to="/signin">
                <Button gradientDuoTone="greenToBlue">
                  Sign In
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </Navbar>
  );
}
