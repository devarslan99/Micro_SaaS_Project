import { Box, Button, CircularProgress, Grid, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HiRefresh } from "react-icons/hi";
import CustomInput from "../../components/EmailStatComp/CustomInput";
import EmailTable from "../../components/EmailStatComp/EmailsTable";
import { email_stats } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmailStats = ({ menuCollapse }) => {
  const [recovery, setRecovery] = useState(1);
  const [moderate, setModerate] = useState(8);
  const [maxeffort, setMaxeffort] = useState(20);
  const [emailFetch, setEmailFetch] = useState(false); // Initialize data with mock data
  const [emailConnect, setEmailConnect] = useState(false); // Initialize data with mock data
  const [selectedClient, setSelectedClient] = useState("");
  const [emailHealth, setEmailHealth] = useState("All");
  const [clientData, setClientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Initialize filteredData

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const softwareToken = localStorage.getItem("softwareToken");
    if(!softwareToken){
      navigate('/home')
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
      return "OK";
    } else if (reputationvalue >= 91) {
      return "Bad";
    } else {
      return "Very Bad";
    }
  };

  const handleRefresh = async () => {
    const token = localStorage.getItem("authToken");
    const softwareToken = localStorage.getItem("softwareToken");
    try {
      setEmailFetch(true);
      const response = await axios.get(`http://localhost:5000/refresh/emails`, {
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
      const response = await axios.post(`http://localhost:5000/api/email/reconnect`,{},  {
        headers: {
          Authorization: token,
          softwareAuthorization: softwareToken,
        },
      });
      if (response.status === 200) {
        console.log("Client email:", response.data.message);
        setEmailConnect(false);
      }
    } catch (error) {
      console.error("Error fetching client email:", error);
    }
  };

  useEffect(() => {
    const fetchClientEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/email/client-emails`
        );
        if (response.status === 200) {
          setClientData(response.data); // Set client data
          console.log("Client email:", response.data); // Reset fetch flag
        }
      } catch (error) {
        console.error("Error fetching client email:", error);
      }
    };

    fetchClientEmail(); // Fetch email when component mounts
  }, [emailFetch]);

  const handleFilter = () => {
    const selectedClientData = clientData.find(
      (client) => client.from_name === selectedClient
    );

    const filtered = clientData.filter((item) => {
      const matchesClient = item.from_name === selectedClientData?.from_name;

      const reputationvalue = parseFloat(
        item.warmupReputation.replace("%", "")
      );
      const generatedEmailHealth = getEmailHealth(reputationvalue);

      const matchesHealth =
        emailHealth === "All" || generatedEmailHealth === emailHealth;

      return matchesClient && matchesHealth;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    if (clientData.length > 0) {
      // Set the first client's name as the default selected client
      setSelectedClient(clientData[0].from_name);
    }
  }, [clientData]);

  useEffect(() => {
    handleFilter(); // Trigger filter when client or email health changes
  }, [selectedClient, emailHealth, clientData]);

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
              <Select
                value={selectedClient}
                onChange={(e) => {
                  setSelectedClient(e.target.value); // Set the selected client name
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
                {[...new Set(clientData.map((item) => item.from_name))].map(
                  (name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  )
                )}
              </Select>
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
