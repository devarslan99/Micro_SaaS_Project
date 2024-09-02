import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useForm } from "react-hook-form";


const Signup = ({rightPanelActive}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const onSubmitSignUp = (data) => {
        console.log("Sign Up Data: ", data);
      };
  return (
    <Box
    className={`absolute top-0 h-full w-1/2 z-20 flex justify-center items-center flex-col transition-all duration-[0.6s] ease-in-out ${
      rightPanelActive
        ? "opacity-0 "
        : "translate-x-full opacity-100 z-50"
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
      {/* </Box>
      <Typography variant="body2">
        or use your email for registration
      </Typography> */}
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
    </Box>
  </Box>
  )
}

export default Signup