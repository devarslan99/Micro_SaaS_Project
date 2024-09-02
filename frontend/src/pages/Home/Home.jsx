import { Box, Grid, Typography ,   MenuItem,
  Select,
  Modal,
  TextField,
  Button,
  } from '@mui/material'
import React, { useState } from 'react'
import ClientTable from '../../components/CompaingComp/ClientTable'
import { Link } from 'react-router-dom';

const Home = ({ menuCollapse }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [secretKey, setSecretKey] = useState("");

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

  const handleSave = () => {
    console.log("Secret Key:", secretKey);
    handleCloseModal();
  };
    
  return (
    <Grid
    container
    mb={2}
    sx={{ pl: { xs: 0, lg: menuCollapse ? 14 : 36 } }}
    // spacing={2}
  >
     <Grid item xs={12}>
     <Box className="flex items-center justify-center mt-36">
      <Box className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] w-2/5 h-2/5 p-10 rounded-lg shadow-md justify-center flex flex-col gap-5 items-center">
        <Typography variant="" className="text-3xl font-bold text-white">
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
          <MenuItem value="Smart lead.ai">Smart lead.ai</MenuItem>
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
          <Box className="w-1/2 bg-white p-10 rounded-md shadow-md">
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
      </Box>
    </Box>
        </Grid>
  </Grid>
  )
}

export default Home