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
      <Box display="flex" justifyContent="center" minHeight="100vh" alignItems="center">
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
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="password">New Password</InputLabel>
                <TextField
                  id="password"
                  type="password"
                  variant="outlined"
                  placeholder="Enter your new password..."
                  fullWidth
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel shrink htmlFor="repeatpassword">Repeat New Password</InputLabel>
                <TextField
                  id="repeatpassword"
                  type="password"
                  variant="outlined"
                  placeholder="Repeat your new password..."
                  fullWidth
                  {...register("repeatpassword", {
                    required: "Repeat Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  error={!!errors.repeatpassword}
                  helperText={errors.repeatpassword ? errors.repeatpassword.message : ""}
                />
              </FormControl>

              <Button variant="contained" color="primary" type="submit" fullWidth>
                Reset Password
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
