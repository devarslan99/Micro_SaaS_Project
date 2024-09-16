import React from "react";
import {
  Button,
  Container,
  Typography,
  TextField,
  Stack,
  Box,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const password = watch("password");

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
                <label
                  htmlFor="new_password"
                  className="text-xl font-semibold mb-2 font-Poppins"
                >
                  New Password
                </label>
                <input
                  id="new_password"
                  type="new_password"
                  className={`border border-neutral-400 p-2 focus:outline-none mt-2 rounded-md w-full ${
                    errors.new_password ? "border-red-400" : ""
                  }`}
                  placeholder="Enter your New password..."
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
                <label
                  htmlFor="repeatpassword"
                  className="text-xl font-semibold mb-2 font-Poppins"
                >
                  Repeat New Password
                </label>
                <input
                  id="repeatpassword"
                  type="repeatpassword"
                  className={`border border-neutral-400 p-2 focus:outline-none mt-2 rounded-md w-full ${
                    errors.repeatpassword ? "border-red-400" : ""
                  }`}
                  placeholder="Repeat your New password..."
                  {...register("repeatpassword", {
                    required: "Repeat Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.repeatpassword && (
                  <span className="text-red-500 text-sm">
                    {errors.repeatpassword.message}
                  </span>
                )}
              </div>

              <Link
                to={"/reset-password-success"}
                className="bg-gradient-to-r text-lg text-center from-[#FF4B2B] to-[#FF416C] text-white py-3 rounded-md"
              >
                <button type="submit" fullWidth>
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

export default ResetPassword;
