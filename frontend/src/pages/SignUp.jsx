import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlinePlus } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ImageUploader({ onFileSelect, disabled }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        console.error("Invalid file type");
        return;
      }

      setSelectedFiles(acceptedFiles);
      onFileSelect(acceptedFiles);

      const previewUrls = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(previewUrls);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-dashed border-4 border-gray-300 p-8 flex flex-col items-center text-gray-500 cursor-pointer ${
        disabled ? "opacity-50" : ""
      }`}
      style={{ borderRadius: "8px" }}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col justify-center items-center text-center">
        {previews.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-32 h-32 object-cover mb-2"
              />
            ))}
          </div>
        ) : (
          <>
            <HiOutlinePlus size={48} className="mb-2 text-gray-500" />
            <p className="text-sm">
              Drag 'n' drop images here, or click to select up to three images
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleFileSelect = (file) => {
    setSelectedFiles(file);
  };

  // const getEmbedding = async (imageUrl) => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:5000/api/get_embedding", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ imageUrl }),
  //     });
  //     const data = await response.json();

  //     if (response.ok) {
  //       console.log("Embedding:", data.embedding); // Handle embedding here
  //     } else {
  //       toast.error(`Error: ${data.error}`);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching embedding:", error);
  //     toast.error("Failed to get embedding.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.fullname ||
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

    if (selectedFiles) {
      selectedFiles.forEach((file) => {
        data.append("file", file);
      });
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: data,
      });

      const responseData = await res.json();

      if (!res.ok) {
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
        // const imageUrl = responseData.imageUrl; 
        // await getEmbedding(imageUrl);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/signin");
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
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your FullName" />
              <TextInput
                type="text"
                placeholder="Full Name"
                id="fullname"
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
              className="bg-gradient-to-r from-green-400 to-blue-500"
            >
              Take Video Data
            </Button>

            <span
              className="displ
            flex justify-center"
            >
              OR
            </span>
            <ImageUploader
              onFileSelect={handleFileSelect}
              disabled={disabled}
            />
            <Button
              type="submit"
              disabled={loading}
              className="mt-5"
              gradientDuoTone="purpleToBlue"
            >
              {loading ? (
                <Spinner aria-label="Spinner button example" size="sm" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}


















