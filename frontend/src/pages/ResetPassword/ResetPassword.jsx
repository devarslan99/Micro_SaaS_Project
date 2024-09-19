import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { BASE_URL } from "../../config";
const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the query parameters
  const [token, setToken] = useState("");

  // Extract the token from the query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [location]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/reset/password`, {
        password: data.new_password,
        token: token, // Send the token to the backend
      });

      if (response.status === 200) {
        console.log("Password reset successful");
        navigate("/reset-password-success");
      }
    } catch (error) {
      console.error("Error resetting password:", error.response?.data?.message || error.message);
    }
  };

  const password = watch("new_password");

  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" minHeight="100vh" alignItems="center">
        <Box p={4} boxShadow={3} borderRadius={2}>
          <Link to="/forget-password" className="-ml-3">
            <IconButton>
              <IoMdArrowRoundBack size={30} color="black" />
            </IconButton>
          </Link>
          <Typography variant="h4" component="h1" fontWeight="500" mt={2}>
            Reset Password
          </Typography>
          <Typography variant="body1" color="textSecondary" mt={2}>
            Enter your new password.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack mt={4} spacing={4}>
              <div>
                <label htmlFor="new_password" className="text-xl font-semibold mb-2">
                  New Password
                </label>
                <input
                  id="new_password"
                  type="password"
                  className={`border border-neutral-400 p-2 focus:outline-none mt-2 rounded-md w-full ${
                    errors.new_password ? "border-red-400" : ""
                  }`}
                  placeholder="Enter your new password..."
                  {...register("new_password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.new_password && (
                  <span className="text-red-500 text-sm">
                    {errors.new_password.message}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="repeatpassword" className="text-xl font-semibold mb-2">
                  Repeat New Password
                </label>
                <input
                  id="repeatpassword"
                  type="password"
                  className={`border border-neutral-400 p-2 focus:outline-none mt-2 rounded-md w-full ${
                    errors.repeatpassword ? "border-red-400" : ""
                  }`}
                  placeholder="Repeat your new password..."
                  {...register("repeatpassword", {
                    required: "Repeat Password is required",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                />
                {errors.repeatpassword && (
                  <span className="text-red-500 text-sm">
                    {errors.repeatpassword.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white py-3 rounded-md w-full"
              >
                Reset Password
              </button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
