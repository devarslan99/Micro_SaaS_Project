import React from "react";
import {
  Container,
  Typography,
  IconButton,
  Stack,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
              variant=""
              className="text-3xl text-neutral-800 font-Poppins font-semibold"
            >
              Forgot Password
            </Typography>
            <Typography
              variant=""
              className="text-base text-neutral-500 font-Poppins"
            >
              Enter your email address for the account you want to reset the
              password for.
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    errors.email ? "border-red-400" : ""
                  }`}
                  placeholder="Enter your email..."
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <Link to={'/reset-password'} className="bg-gradient-to-r text-lg text-center from-[#FF4B2B] to-[#FF416C] text-white py-3 rounded-md">
              <button
                
                type="submit"
                fullWidth
                >
                Reset Password
              </button>
                  </Link>
            </Stack>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
