import {
  Box,
  Button,
  IconButton,
//   Link,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Signin = ({ rightPanelActive }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitSignIn = (data) => {
    console.log("Sign In Data: ", data);
  };

  return (
    <Box
      className={`absolute top-0 h-full w-1/2 z-20 flex justify-center items-center flex-col transition-all duration-[0.6s] ease-in-out ${
        rightPanelActive ? "" : "translate-x-full"
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
          {/* <IconButton>
            <FcGoogle />
          </IconButton> */}
          {/* <IconButton>
          <LinkedInIcon />
        </IconButton> */}
        {/* </Box> */}
        {/* <Typography variant="body2">or use your account</Typography> */}
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
        <Link
          href="#"
          variant="body2"
          sx={{ mt: 2, textDecoration: "none", fontStyle: "italic" }}
        >
          Forgot your password?
        </Link>
        <Link to={'/home'}>
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
        </Link>
      </Box>
    </Box>
  );
};

export default Signin;
