import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import axios from "axios"; // Fix import here (without the curly braces)
import { useNavigate } from "react-router-dom";

const Signup = ({ rightPanelActive }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home"); // Redirect to /home if token exists
    }
  }, []);

  const onSubmitSignUp = async (data) => {
    console.log("Sign Up Data: ", data);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );
      console.log("Server Response: ", response.data);

      setErrorMessage(
        response?.data?.msg || "An error occurred during sign up."
      );
      const token = response.data.token;
      if (token) {
        localStorage.setItem("authToken", token); // Store the token in localStorage
        console.log("Token saved to localStorage.");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
        // This will redirect the user to the Google OAuth page via your backend
        window.location.href = 'http://localhost:5000/auth/google';
    } catch (error) {
        console.error("Error during Google Sign-Up: ", error);
    }
};

  return (
    <Box
      className={`absolute top-0 h-full w-1/2 z-20 flex justify-center items-center flex-col transition-all duration-[0.6s] ease-in-out ${
        rightPanelActive ? "opacity-0 " : "translate-x-full opacity-100 z-50"
      }`}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitSignUp)}
        sx={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          width: "100%",
          height: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Create Account
        </Typography>
        <IconButton onClick={handleGoogleSignUp}>
          <FcGoogle />
        </IconButton>
        <Typography variant="body2">
        or use your email for registration
      </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          variant="contained"
          className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C]"
          sx={{
            mt: 2,
            borderRadius: "20px",
            px: 5,
            textTransform: "uppercase",
          }}
        >
          Sign Up
        </Button>
        <Typography className="pt-4 italic text-red-500">
          {errorMessage}
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
