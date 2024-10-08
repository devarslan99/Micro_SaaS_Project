import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";
import MyContext from "../../hook/context";

const Signin = ({ rightPanelActive, handleSignUpClick }) => {
  const { setLoggedInClientId, setIsClientLoggedIn, isClientLoggedIn, setName } =
    useContext(MyContext);
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
      navigate("/home");
    }
  }, []);

  const onSubmitSignIn = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: data.signInEmail,
        password: data.signInPassword,
      });
      console.log("Server Response: ", response.data);
      setErrorMessage(
        response?.data?.msg || "An error occurred during sign up."
      );
        setName(response.data.name)
      const token = response.data.token;
      const softwareToken = response.data.softwareToken;
      // setLoggedInClientId(response.data.clientId);
      // setIsClientLoggedIn(response.data.isClient)
      localStorage.setItem("clientId", response.data.clientId)
      localStorage.setItem("isClient", response.data.isClient)
      if (token) {
        localStorage.setItem("authToken", token); // Store the token in localStorage
        console.log("Token saved to localStorage.");
        if (isClientLoggedIn === false) {
          navigate("/home"); // Navigate to /home if isClient is true
        } else {
          navigate("/compaigns"); // Navigate to /campaigns if isClient is false
        }
      }
      if (softwareToken) {
        localStorage.setItem("softwareToken", softwareToken);
      }

      // Optionally redirect the user to another page after sign up
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // This will redirect the user to the Google OAuth page via your backend
      window.location.href = `${BASE_URL}/auth/google`;
    } catch (error) {
      console.error("Error during Google Sign-In: ", error);
    }
  };
  return (
    <Box
      className={`absolute top-0 h-full md:w-1/2 w-[100%] z-20 flex justify-center items-center flex-col transition-all duration-[0.6s] ease-in-out ${
        rightPanelActive ? "" : "md:translate-x-full"
      }`}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitSignIn)}
        sx={{
          backgroundColor: "white",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          height: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Sign In
        </Typography>
        {/* <Box sx={{ my: 2, display: "flex", gap: 1 }}> */}
        {/* <IconButton>
          <FacebookIcon />
        </IconButton> */}
        <IconButton onClick={handleGoogleSignIn}>
          <FcGoogle />
        </IconButton>
        {/* <IconButton>
          <LinkedInIcon />
        </IconButton> */}
        {/* </Box> */}
        <Typography variant="body2">or use your account</Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("signInEmail", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
          error={!!errors.signInEmail}
          helperText={errors.signInEmail?.message}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("signInPassword", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={!!errors.signInPassword}
          helperText={errors.signInPassword?.message}
        />
        <Link to="/forget-password" variant="body2">
          <Typography variant="" className="text-[#FF4B2B] italic">
            Forgot your password?
          </Typography>
        </Link>
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
          Sign In
        </Button>
        <Typography variant="" className="text-sm md:hidden block pt-3">
          Don't have an account?{" "}
          <span
            className="text-red-500 font-semibold"
            onClick={handleSignUpClick}
          >
            SignUp
          </span>
        </Typography>
        <Typography className="pt-4 italic text-red-500">
          {errorMessage}
        </Typography>
      </Box>
    </Box>
  );
};

export default Signin;
