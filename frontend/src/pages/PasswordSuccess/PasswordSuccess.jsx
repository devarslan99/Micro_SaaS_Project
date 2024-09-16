import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Icon,
  Card,
  CardContent,
} from "@mui/material";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ResetPasswordSuccess = () => {
  return (
    <Container>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Box
          sx={{
            padding: {
              xs: 2,
              md: 5,
            },
            width: "100%",
            maxWidth: 400,
            boxShadow: 3,
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Icon
                component={FaCircleCheck}
                sx={{ fontSize: 48, color: "green" }}
              />
              <Typography variant="" className="text-xl font-semibold mb-2 font-Poppins" >
                Password Reset Done
              </Typography>
              <Typography align="center" color="text.secondary" variant="body1">
                Now you can access your account.
              </Typography>
              {/* <Box width="100%"> */}
              <Link
                to={"/"}
                className="bg-gradient-to-r w-full text-lg text-center from-[#FF4B2B] to-[#FF416C] text-white py-2 px-3 rounded-md"
              >
                <button fullWidth>
                  Sign In
                </button>
              </Link>
              {/* </Box> */}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default ResetPasswordSuccess;
