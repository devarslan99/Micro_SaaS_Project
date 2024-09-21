import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Signup from "../../components/SigninSingup/Signup";
import Signin from "../../components/SigninSingup/Signin";

const SignInSignUp = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setRightPanelActive(false);
  };

  const handleSignInClick = () => {
    setRightPanelActive(true);
  };

  return (
    <Box className="flex items-center justify-center h-screen bg-neutral-100">
      {/* Buttons to switch between Sign Up and Sign In */}
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: {md:"none", xs:"flex"},
          gap: 2,
        }}
      >
        <button
          onClick={handleSignUpClick}
          className={`${
            rightPanelActive
              ? "bg-transparent border text-[#FF4B2B] border-[#FF4B2B] px-4 py-1 rounded-full"
              : "bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white px-4 py-1 rounded-full"
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={handleSignInClick}
          className={`${
            rightPanelActive
              ? "bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white px-4 py-1 rounded-full"
              : "bg-transparent border text-[#FF4B2B] border-[#FF4B2B] px-4 py-1 rounded-full"
          }`}
        >
          Sign In
        </button>
      </Box>

      <Box
        className={`relative w-full md:max-w-3xl max-w-[90%] min-h-[480px] bg-white rounded-lg shadow-xl overflow-hidden transition-transform duration-[0.6s] ease-in-out ${
          rightPanelActive ? "right-panel-active" : ""
        }`}
        sx={{
          // width: "100%",
          // maxWidth: "900px",
          // display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
        }}
      >
        {/* Sign Up Form */}
        <Signup rightPanelActive={rightPanelActive} />
        {/* Sign In Form */}
        <Signin rightPanelActive={rightPanelActive} />

        {/* Overlay Part */}
        <Box
          className={`absolute md:block hidden top-0 w-full h-full transition-transform overflow-hidden duration-[0.6s] ease-in-out z-50 ${
            rightPanelActive ? "left-1/2" : "-left-1/2"
          }`}
          sx={{
            background: "linear-gradient(to right, #FF4B2B, #FF416C)",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            className={`absolute top-0 right-1/2 w-1/2 h-full flex px-8 items-center justify-center flex-col transition-transform duration-[0.6s] ease-in-out ${
              rightPanelActive ? "-translate-x-0" : "-translate-x-[20%]"
            }`}
          >
            <Typography variant="" className="font-bold text-4xl text-white">
              Hello, Friend!
            </Typography>
            <Typography variant="body2" className="text-white" sx={{ mt: 2 }}>
              Enter your personal details and start your journey with us
            </Typography>
            <Button
              onClick={handleSignUpClick}
              variant="outlined"
              sx={{
                px: 5,
                mt: 4,
                borderRadius: "20px",
                borderColor: "white",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              Sign Up
            </Button>
          </Box>
          <Box
            className={`absolute top-0 left-1/2 w-1/2 h-full flex items-center px-8 justify-center flex-col transition-transform duration-[0.6s] ease-in-out ${
              rightPanelActive ? "translate-x-[20%]" : "translate-x-0"
            }`}
          >
            <Typography variant="" className="font-bold text-4xl text-white">
              Welcome Back!
            </Typography>
            <Typography variant="body2" className="text-white" sx={{ mt: 2 }}>
              To keep connected with us please login with your personal info
            </Typography>
            <Button
              onClick={handleSignInClick}
              variant="outlined"
              sx={{
                px: 5,
                mt: 4,
                borderRadius: "20px",
                borderColor: "white",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInSignUp;
