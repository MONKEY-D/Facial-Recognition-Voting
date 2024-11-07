import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleFileSelect = (file) => {
    setSelectedFiles(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("fullname", formData.fullname);
    data.append("password", formData.password);

    // Append each selected image file, up to 3 files
    if (selectedFiles) {
      selectedFiles.forEach((file) => {
        data.append("file", file); // Name 'file' should match the field name in multer array
      });
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // Set JSON headers
        },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        // Handle specific error messages from the backend
        if (responseData.message.includes("Email is already registered")) {
          toast.error(responseData.message);
        } else if (responseData.message.includes("Username is already taken")) {
          toast.error("Username is already taken");
        } else if (
          responseData.message.includes(
            "Password must be at least 8 characters"
          )
        ) {
          toast.error("Password must be at least 8 characters long");
        } else {
          toast.error(responseData.message);
        }
      } else {
        toast.success("Sign-up successful!");
      }
      setLoading(false);
      if(res.ok) {
        navigate('/');
      }
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Server error occurred. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
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
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email or username" />
              <TextInput
                type="text"
                placeholder="Email or Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
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
            <span>Don't have a account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
