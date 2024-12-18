import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    // Basic field validation
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      // If there's an error in the response, show it
      if (!res.ok) {
        toast.error(responseData.message);
      } else {
        toast.success("Sign-in successful!");
        // window.location.reload();

        // Save the token in localStorage
        // if (responseData.token) {
        //   localStorage.setItem("token", responseData.token);
        //   console.log("Token stored:", responseData.token);
        // }
        if (responseData.token && responseData.user) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              token: responseData.token,
              user: responseData.user,
            })
          );
          // Save authentication status
          localStorage.setItem("isLoggedIn", true);
          console.log("Token and user data stored:", responseData.token);
        }

        // Redirect based on user role
        if (responseData.role === "admin") {
          console.log("Navigating to admin dashboard");
          navigate("/admin/dashboard");
        } else {
          console.log("Navigating to home");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Server error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left Section */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-green-500 via-green-500 to-blue-500 rounded-lg text-white">
              Let's
            </span>
            Vote
          </Link>
          <p className="text-sm mt-5">
            This is a demo project, there might be some bugs.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email or username" />
              <TextInput
                type="text"
                placeholder="Email or Username"
                id="username"
                onChange={handleChange}
                value={formData.username} // Ensure value is controlled
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
                value={formData.password} // Ensure value is controlled
              />
            </div>
            <Button
              gradientDuoTone="greenToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
