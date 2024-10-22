import {
  Box,
  Grid,
  Typography,
  MenuItem,
  Select,
  Modal,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClientSelectionModal from "../../components/HomeComp/ClientSelectionModel";
import ClientDetailsModal from "../../components/HomeComp/ClientDetailModel";
import { BASE_URL } from "../../config";
import SmartLeadLogo from '../../assets/Smart_Lead_logo.svg'

const Home = ({ menuCollapse }) => {
  const navigate = useNavigate();
  const navigateAuth = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false); // Loader state
  const [selectedOption, setSelectedOption] = useState("");
  const [isAccountImported, setIsAccountImported] = useState(false);
  const [softwareName, setSoftwareName] = useState(""); // New state for software name
  const [clients, setClients] = useState([]); // State for clients
  const [selectedClients, setSelectedClients] = useState([]); // State for selected clients
  const [clientModalOpen, setClientModalOpen] = useState(false); // State for client selection modal
  const [clientDetailsModalOpen, setClientDetailsModalOpen] = useState(false);

  
  // Check for softwareToken in localStorage on component mount
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log('Auth token:',token); // Check if it's null or undefined
    if (!token ) {
      // navigateAuth("/");
      window.location.assign('/');// Redirect to / if authToken is not present
      console.log('Rerouting home page');
    }
  }, [navigateAuth]);
  
  useEffect(() => {
    const token = localStorage.getItem("softwareToken");
    if (token) {
      setSoftwareName("Smart lead.ai"); // Placeholder, adjust as needed
    }
  }, []);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "Smart lead.ai") {
      setOpenModal(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSecretKeyChange = (event) => {
    setSecretKey(event.target.value);
  };

  const handleSave = async () => {
    const trimmedKey = secretKey.trim();

    if (trimmedKey === "") {
      setSnackbarMessage("API key cannot be empty.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const data = {
      software: selectedOption,
      apiKey: trimmedKey,
    };

    try {
      setLoading(true); // Start loader
      const response = await axios.post(
        `${BASE_URL}/api/software/add-api-key`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("API Key added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        if (response.data?.software) {
          setSelectedOption(response.data.software);
          setSoftwareName(response.data.software); // Set the software name
        }

        const token = response.data.softwareToken;
        if (token) {
          localStorage.setItem("softwareToken", token);

          // Fetch clients after secret key validation
          await fetchClients(token); // Wait for the clients to be fetched
        }
      } else {
        setSnackbarMessage("Failed to send data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error sending API key.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Stop loader
      handleCloseModal();
    }
  };

  const fetchClients = async (softwareToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/clients`, {
        headers: {
          softwareToken: `${softwareToken}`, // Use the softwareToken as per your request
        },
      });

      if (response.status === 200) {
        // Map _id to clientId
        const clientsWithClientId = response.data.map((client) => ({
          clientId: client.clientId,
          name: client.logo,
        }));
        setClients(clientsWithClientId);
        setClientModalOpen(true); // Open the client selection modal after data is fetched
      } else {
        setSnackbarMessage("Failed to fetch clients.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error fetching clients.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClientSelection = (clientId, clientName) => {
    setSelectedClients((prevSelected) => {
      const isSelected = prevSelected.some(
        (client) => client.clientId === clientId
      );

      if (isSelected) {
        // Remove client if already selected
        return prevSelected.filter((client) => client.clientId !== clientId);
      } else {
        // Add client if not selected
        return [...prevSelected, { clientId, name: clientName }];
      }
    });
  };

  const handleNext = async () => {
    console.log(selectedClients);

    setClientModalOpen(false);
    setClientDetailsModalOpen(true);
    setSnackbarMessage("Clients selected successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

  };
  const handleClientDetailsSave = async (changedClient) => {
    console.log("Changed",changedClient);
    try {
    const response =   await axios.post(
        `${BASE_URL}/save-client-data`,
        { clients: changedClient },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("authToken")}`,
            SoftwareAuthorization: `${localStorage.getItem("softwareToken")}`,
          },
        }
      );
      if(response.status==201){
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error saving selected clients.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
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
          onClick={isAccountImported ? () => navigate("/compaigns") :handleImportAccount }
            variant="contained"
            className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white"
          >
            {isAccountImported ?  "Go to Campaings" : "Import Account" }
          </Button>
        ) 
        }
      </Grid>

      <Grid item xs={12}>
        <Box className="flex items-center justify-center sm:mt-36 mt-16">
          <Box className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] sm:w-2/5 w-10/12 h-2/5 sm:p-10 p-5 rounded-lg shadow-md justify-center flex flex-col gap-5 items-center">
            {
              !isAccountImported ? (
                <Typography
                  variant=""
                  className="sm:text-3xl text-xl font-bold text-white text-center"
                >
                  {softwareName || "Click on the Import Account button to import your account"}
                </Typography>
              ) : (
                // selectedOption === "" ?
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
                        src={SmartLeadLogo}
                        className="h-8 w-40"
                        alt="Smart Lead.ai Logo"
                      />
                    </MenuItem>
                  </Select>
                </>
              )
              //  : (
              //   <Button
              //     variant="contained"
              //     onClick={() => setClientModalOpen(true)}
              //     sx={{
              //       backgroundColor: "#FF4B2B",
              //       borderRadius: "5px",
              //       padding: "10px 20px",
              //       color: "#fff",
              //     }}
              //   >
              //     Open Client Selection Modal
              //   </Button>
              // )
            }
          </Box>
        </Box>
      </Grid>

      {/* Client Selection Modal */}

      <ClientSelectionModal
        clientModalOpen={clientModalOpen}
        setClientModalOpen={setClientModalOpen}
        clients={clients}
        selectedClients={selectedClients}
        handleClientSelection={handleClientSelection}
        handleNext={handleNext}
      />

      {clientDetailsModalOpen && (
        <ClientDetailsModal
          clients={selectedClients}
          clientDetailsModalOpen={clientDetailsModalOpen}
          setClientDetailsModalOpen={setClientDetailsModalOpen}
          handleClientDetailsSave={handleClientDetailsSave}
        />
      )}

      {/* Modal for secret key input */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Box className="sm:w-2/6 w-4/5 items-center  flex flex-col gap-3 bg-white sm:p-10 p-5 rounded-md shadow-md">
            <CircularProgress size={50} color="error" thickness={10} />
            <Typography
              variant=""
              className="text-2xl font-semibold font-Poppins"
            >
              Please wait Data is fetching
            </Typography>
          </Box>
        ) : (
          <Box className="sm:w-1/2 w-4/5 bg-white sm:p-10 p-5 rounded-md shadow-md">
            <Typography
              id="modal-title"
              variant=""
              className="mb-2 text-2xl font-semibold"
            >
              Enter API Key
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="API Key"
              variant="outlined"
              required
              value={secretKey}
              onChange={handleSecretKeyChange}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                className="w-1/4 bg-gradient-to-r from-[#FF4B2B] to-[#FF416C]"
                onClick={handleSave}
                disabled={loading}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Home;
