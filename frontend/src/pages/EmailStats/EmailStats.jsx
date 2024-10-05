import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { HiRefresh } from "react-icons/hi";
import CustomInput from "../../components/EmailStatComp/CustomInput";
import EmailTable from "../../components/EmailStatComp/EmailsTable";
import { email_stats } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";
import MyContext from "../../hook/context";

const EmailStats = ({ menuCollapse }) => {
  const [selectedClient, setSelectedClient] = useState(""); // Dropdown client selection
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientData, setClientData] = useState([]);
  const [emailData, setEmailData] = useState([]);
  const [recovery, setRecovery] = useState(1);
  const [moderate, setModerate] = useState(8);
  const [maxeffort, setMaxeffort] = useState(20);
  const [emailFetch, setEmailFetch] = useState(false); // Initialize data with mock data
  const [emailConnect, setEmailConnect] = useState(false); // Initialize data with mock data
  const [emailHealth, setEmailHealth] = useState("All");
  const [filteredData, setFilteredData] = useState([]);


  const navigate = useNavigate();

  const loggedInClientId = localStorage.getItem("clientId");
  const isClientLoggedIn = localStorage.getItem("isClient") === "true";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const softwareToken = localStorage.getItem("softwareToken");
    if (!softwareToken) {
      navigate("/home");
    }
    if (!token) {
      navigate("/"); // Redirect to /home if token exists
    }
  }, [navigate]);

  const getEmailHealth = (reputationvalue) => {
    if (reputationvalue >= 100) {
      return "Excellent";
    } else if (reputationvalue >= 98) {
      return "Decent";
    } else if (reputationvalue >= 96) {
      return "Okay";
    } else if (reputationvalue >= 91) {
      return "Bad";
    } else if (reputationvalue <= 91) {
      return "Very Bad";
    } else if (reputationvalue === null) {
      return "N/A";
    }
  };

  const handleRefresh = async () => {
    const token = localStorage.getItem("authToken");
    const softwareToken = localStorage.getItem("softwareToken");
    try {
      setEmailFetch(true);
      const response = await axios.get(`${BASE_URL}/refresh/emails`, {
        headers: {
          Authorization: token,
          softwareAuthorization: softwareToken,
        },
      });
      if (response.status === 200) {
        console.log("Client email:", response.data.message);
        setEmailFetch(false);
      }
    } catch (error) {
      console.error("Error fetching client email:", error);
    }
  };
  const handleReconnect = async () => {
    const token = localStorage.getItem("authToken");
    const softwareToken = localStorage.getItem("softwareToken");
    console.log(token);
    console.log(softwareToken);

    try {
      setEmailConnect(true);
      const response = await axios.post(
        `${BASE_URL}/api/email/reconnect`,
        {},
        {
          headers: {
            Authorization: token,
            softwareAuthorization: softwareToken,
          },
        }
      );
      if (response.status === 200) {
        console.log("Client email:", response.data.message);
        setEmailConnect(false);
      }
    } catch (error) {
      console.error("Error fetching client email:", error);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const softwareToken = localStorage.getItem("softwareToken");
        const authToken = localStorage.getItem("authToken");

        if (!softwareToken) {
          navigate("/home"); // Redirect if no softwareToken found
          return;
        }

        const response = await axios.get(`${BASE_URL}/selectedClients`, {
          headers: {
            softwareToken: `${softwareToken}`,
            authToken: `${authToken}`,
          },
        });

        console.log("client data", response.data);

        if (response.status === 200 && response.data.length > 0) {
          setClientData(response.data); // Set the fetched clients to state
          setSelectedClient(response.data[0]?.selectedName); // Set default selected client
          setSelectedClientId(response.data[0]?.clientId);
        } else {
          console.log("Failed to fetch clients");
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  console.log(isClientLoggedIn);
  console.log(selectedClientId);
  const fetchEmailData = async () => {
    try {
      if (!selectedClient) return;
      console.log("email request send");

      const response = await axios.get(`${BASE_URL}/api/email/client-emails`, {
        headers: {
          clientId:
            isClientLoggedIn === false
              ? selectedClientId !== null
                ? selectedClientId
                : "null"
              : loggedInClientId !== null
              ? loggedInClientId
              : "null",
        },
      });
      

      if (response.status === 200) {
        setEmailData(response.data);
        console.log("Email data", response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      console.error("Error fetching email data:", error);
    }
  };
  console.log("EMial page", loggedInClientId);

  useEffect(() => {
    fetchEmailData();
    console.log("Top function called"); // Fetch data when client or date changes
  }, [selectedClient]);

  const handleFilter = () => {
    const filtered = emailData.filter((item) => {
      // Parse warmupReputation, handle if it's null or undefined
      const reputationvalue = parseFloat(
        item?.warmupReputation?.replace("%", "")
      );

      // Generate the email health based on the reputation value
      const generatedEmailHealth = getEmailHealth(reputationvalue);

      // Filter by health: either "All" or a match with generatedEmailHealth
      const matchesHealth =
        emailHealth === "All" || generatedEmailHealth === emailHealth;

      return matchesHealth;
    });

    // Update filtered email data
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleFilter(); // Trigger filter when emailHealth changes
  }, [emailHealth]);

  return (
    <Grid
      container
      mb={2}
      sx={{ pl: { xs: 2, lg: menuCollapse ? 14 : 36 } }}
      spacing={2}
      pr={2}
    >
      {/* Daily Level */}
      <Grid item xs={12}>
        <Box className="mt-4">
          <Box className="flex lg:flex-row flex-col justify-between lg:items-center my-10 items-start lg:gap-0 gap-5">
            <Box className="gap-3 flex lg:w-auto w-full sm:flex-row flex-col">
              {isClientLoggedIn === false ? (
                <Select
                  value={selectedClient}
                  onChange={(e) => {
                    const selectedClient = clientData.find(
                      (client) => client.selectedName == e.target.value
                    );
                    setSelectedClient(selectedClient.selectedName);
                    setSelectedClientId(selectedClient.clientId);
                  }}
                  sx={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    height: "38px",
                    color: "#FF4B2B",
                    "& .MuiSelect-icon": {
                      color: "#FF4B2B",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FF4B2B",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FF4B2B",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FF4B2B",
                    },
                  }}
                >
                  {clientData.map((client) => (
                    <MenuItem key={client.clientId} value={client.selectedName}>
                      {client.selectedName}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <></>
              )}
              <Select
                value={emailHealth}
                onChange={(e) => setEmailHealth(e.target.value)}
                displayEmpty
                sx={{
                  width: "100%",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  height: "38px",
                  color: "#FF4B2B",
                  "& .MuiSelect-icon": {
                    color: "#FF4B2B",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF4B2B",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF4B2B",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF4B2B",
                  },
                }}
              >
                <MenuItem value="All">All</MenuItem>
                {[...new Set(email_stats.map((item) => item.email_health))].map(
                  (emailHealth, index) => (
                    <MenuItem key={index} value={emailHealth}>
                      {emailHealth}
                    </MenuItem>
                  )
                )}
              </Select>
            </Box>
            <Box className="gap-3 lg:w-auto w-full items-center flex sm:flex-row flex-col">
              <Button
                variant="contained"
                className="bg-gradient-to-r lg:w-auto w-[100%] from-[#FF4B2B] to-[#FF416C] text-white flex items-center gap-2"
                onClick={handleRefresh} // Refresh data on click
                disabled={emailConnect}
              >
                Refresh <HiRefresh size={18} color="white" />
              </Button>
              <Button
                variant="contained"
                className="bg-gradient-to-r lg:w-auto w-[100%] from-[#FF4B2B] to-[#FF416C] text-white text-sm"
                onClick={handleReconnect} // Refresh data on click
                disabled={emailFetch}
              >
                Reconnect all failed email accounts
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <CustomInput
          id="reconvery"
          label={"Recovery"}
          value={recovery}
          onChange={(e) => setRecovery(e.target.value)}
        />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <CustomInput
          id="moderate"
          label={"Moderate"}
          value={moderate}
          onChange={(e) => setModerate(e.target.value)}
        />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <CustomInput
          id="maxeffort"
          label={"Max Effort"}
          value={maxeffort}
          onChange={(e) => setMaxeffort(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        {emailFetch ? (
          <Box className=" w-4/5 mx-auto items-center  flex flex-col gap-3 bg-white p-32">
            <CircularProgress size={50} color="error" thickness={10} />
            <Typography
              variant=""
              className="text-2xl font-semibold font-Poppins"
            >
              Please wait Data is Refreshing......
            </Typography>
          </Box>
        ) : (
          <EmailTable
            data={filteredData}
            recovery={recovery}
            moderate={moderate}
            maxeffort={maxeffort}
            setData={setFilteredData}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default EmailStats;
