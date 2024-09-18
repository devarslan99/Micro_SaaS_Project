import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  IconButton,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Email is required");
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      setError("Invalid email address");
    } else {
      setError("");
      setLoading(true); // Start loader
      try {
        const response = await axios.post(`http://localhost:5000/reset/mail`, {
          email: email,
        });
        if (response.status === 200) {
          setSuccess(true);
        }
      } catch (error) {
        console.log(error);
        setError("Failed to send reset email. Try again.");
      } finally {
        setLoading(false); // Stop loader after request completes
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        minHeight="100vh"
        alignItems="center"
      >
        <Box
          p={{
            xs: 2,
            md: 4,
          }}
          boxShadow={3}
          borderRadius={2}
        >
          <Box className="flex gap-2 flex-col">
            <Link to="/" className="-ml-3">
              <IconButton>
                <IoMdArrowRoundBack size={30} color="black" />
              </IconButton>
            </Link>
            <Typography
              variant="h4"
              className="text-neutral-800 font-Poppins font-semibold"
            >
              Forgot Password
            </Typography>
            <Typography
              variant="body1"
              className="text-base text-neutral-500 font-Poppins"
            >
              Enter your email address for the account you want to reset the
              password for.
            </Typography>
          </Box>

          {loading ? (
            // Show loader while loading
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : success ? (
            // If success is true, show success message
            <Typography
              variant="h6"
              align="center"
              style={{
                color: "#4CAF50",
                marginTop: "20px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
              }}
            >
              Email sent to your account successfully! Kindly reset your password
              from the email.
            </Typography>
          ) : (
            <Stack mt={2} spacing={3}>
              <div>
                <label
                  htmlFor="email"
                  className="text-xl font-semibold mb-2 font-Poppins"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`border border-neutral-400 p-2 focus:outline-none mt-2 rounded-md w-full ${
                    error ? "border-red-400" : ""
                  }`}
                  placeholder="Enter your email..."
                  value={email}
                  onChange={handleEmailChange}
                />
                {error && (
                  <span className="text-red-500 text-sm">{error}</span>
                )}
              </div>
              <Link className="bg-gradient-to-r text-lg text-center from-[#FF4B2B] to-[#FF416C] text-white py-3 rounded-md">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="w-full"
                >
                  Reset Password
                </button>
              </Link>
            </Stack>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
