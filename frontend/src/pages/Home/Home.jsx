import {
  Box,
  Grid,
  Typography,
  MenuItem,
  Select,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = ({ menuCollapse }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [secretKey, setSecretKey] = useState("");
    const [isAccountImported, setIsAccountImported] = useState(false);

    const navigate = useNavigate();

    // useEffect(() => {
    //   const token = localStorage.getItem("authToken");
    //   if (!token) {
    //     navigate("/"); // Redirect to /home if token exists
    //   }
    // }, []);

    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
      if (event.target.value === "Smart lead.ai") {
        setOpenModal(true);
      }
    };

    const handleCloseModal = () => {
      setOpenModal(false);
    };

    const handleSecretKeyChange = (event) => {
      setSecretKey(event.target.value);
    };

    const handleSave = async () => {
      const data = {
        software: selectedOption,
        apiKey: secretKey,
      };
    
      try {
        // Check if apiKey exists in the data object
        // const url = data.apiKey
        //   ? "http://localhost:5000/api/software/add-api-key"
        //   : "http://localhost:5000/api/software/check-software";
    
        const response = await axios.post("http://localhost:5000/api/software/add-api-key", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("authToken")}`,
          },
        });

        console.log("Server Response",response.data);
        if(response.data?.software){
          setSelectedOption(response.data.software)
        }

        const token = response.data.softwareToken;
        if (token) {
          localStorage.setItem("softwareToken", token); // Store the token in localStorage
          console.log("Software Token saved to localStorage.");
          navigate("/compaigns");
        }

        
      
  
      if (response.status === 200) {
        if (data.apiKey) {
          console.log("API Key added successfully!");
        } else {
          console.log("Software selected and secret key sent successfully!");
        }
      } else {
        console.log("Failed to send data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  
    handleCloseModal();
  };
  
  const handleImportAccount = () => {
    setIsAccountImported(true);
  };

  return (
    <Grid container mb={2} sx={{ pl: { xs: 0, lg: menuCollapse ? 14 : 36 } }}>
      {/* Top Bar with Import Account Button */}
      <Grid item xs={12} className="flex justify-end p-4">
        {!isAccountImported && (
          <Button
            onClick={handleImportAccount}
            variant="contained"
            className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white"
          >
            Import Account
          </Button>
        )}
      </Grid>

      <Grid item xs={12}>
        <Box className="flex items-center justify-center sm:mt-36 mt-16">
          <Box className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] sm:w-2/5 w-10/12 h-2/5 sm:p-10 p-5 rounded-lg shadow-md justify-center flex flex-col gap-5 items-center">
            {!isAccountImported ? (
              <Typography
                variant=""
                className="sm:text-3xl text-xl font-bold text-white text-center"
              >
                Click on the Import Account button to import your account
              </Typography>
            ) : selectedOption === "" ? (
              <>
                <Typography
                  variant=""
                  className="sm:text-3xl text-2xl font-bold text-white"
                >
                  Please select Your Software
                </Typography>
                <Select
                  value={selectedOption}
                  onChange={handleSelectChange}
                  displayEmpty
                  sx={{
                    color: "white",
                    backgroundColor: "transparent",
                    border: "1px solid white",
                    width: "100%",
                    height: "50px",
                    "& .MuiSelect-icon": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Software
                  </MenuItem>
                  <MenuItem value="Smart lead.ai">
                    <img
                      src="./src/assets/Smart_Lead_logo.svg"
                      className="h-8 w-40"
                      alt=""
                    />
                  </MenuItem>
                  {/* Add more options here */}
                </Select>
                <Link to="/compaigns">
                  <Button
                    sx={{
                      px: 10,
                      mt: 1,
                      borderRadius: "20px",
                      borderColor: "white",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    variant="outlined"
                    disabled={selectedOption === ""}
                  >
                    Next
                  </Button>
                </Link>
              </>
            ) : (
              <Typography variant="" className="text-3xl font-bold text-white">
                {selectedOption}
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box className="sm:w-1/2 w-4/5   bg-white sm:p-10 p-5 rounded-md shadow-md">
          <Typography variant="" className="mb-2 text-2xl font-semibold">
            Enter your Secret Key
          </Typography>
          <TextField
            fullWidth
            label="Secret Key"
            value={secretKey}
            onChange={handleSecretKeyChange}
            variant="outlined"
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              onClick={handleSave}
              variant="contained"
              className="w-1/4 bg-gradient-to-r from-[#FF4B2B] to-[#FF416C]"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Home;
