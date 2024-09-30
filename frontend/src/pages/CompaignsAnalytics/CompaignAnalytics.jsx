import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { clientData, gradients, statGraphItems } from "../../data/mockData";
import { format, parse, subDays } from "date-fns";
import CustomCheckBtn from "../../components/CompaingComp/CustomCheckBtn";
import DropdownCalendar from "../../components/CompaingComp/DatePicker";
import CompaignCharts from "../../components/CompaingComp/CompaignCharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiRefresh } from "react-icons/hi";
import { BASE_URL } from "../../config";

const CompaignAnalytics = ({ menuCollapse }) => {
  const [selectedClient, setSelectedClient] = useState(""); // Dropdown client selection
  const [selectedClientId, setSelectedClientId] = useState(null); // Dropdown client selection
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());
  const [showOpenCount, setShowOpenCount] = useState(false);
  const [compaignFetch, setCompaignFetch] = useState(false);
  const [showClickCount, setShowClickCount] = useState(false);
  const [showTopOpenCount, setShowTopOpenCount] = useState(false);
  const [showTopClickCount, setShowTopClickCount] = useState(false);
  const [dailyFilteredData, setDailyFilteredData] = useState({});
  const [topLevelFilteredData, setTopLevelFilteredData] = useState({});
  const [clientData, setClientData] = useState([]);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    const token = localStorage.getItem("authToken");
    useEffect(() => {
      const softwareToken = localStorage.getItem("softwareToken");
      if(!softwareToken){
        navigate('/home')
      }
    }, [navigate]);
    try {
      setCompaignFetch(true);
      const response = await axios.get(
        `${BASE_URL}/campaighs `,
        {
          headers: {
            Authorization: token,
            softwareAuthorization: softwareToken,
          },
        }
      );
      if (response.status === 200) {
        console.log("Client email:", response.data.message);
        setCompaignFetch(false);
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
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Redirect to / if authToken is not present
    }
  }, [navigate]);


  const handleDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const fetchDailyData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !selectedClient || !startDate || !endDate) return;

      const formattedStartDate = format(new Date(startDate), "yyyy-MM-dd");
      const formattedEndDate = format(new Date(endDate), "yyyy-MM-dd");

      console.log(formattedStartDate);
      console.log(formattedEndDate);

      const response = await axios.get(
        `${BASE_URL}/api/campaighs/daily`,
        {
          headers: {
            clientID: selectedClientId,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            token: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        setDailyFilteredData(response.data);
        console.log("daily data", response.data);
      }
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }
  };

  // Fetch data whenever the client or date changes
  useEffect(() => {
    if (selectedClient && startDate && endDate) {
      fetchDailyData();
    }
  }, [selectedClient, endDate]);

  const fetchTopData = async () => {
    try {
      if (!selectedClient) return;
      console.log("top level request send");

      const response = await axios.get(
        `${BASE_URL}/api/campaighs/top-level-stats`,
        {
          headers: {
            clientId: selectedClientId,
          },
        }
      );
      console.log(typeof selectedClientId);

      if (response.status === 200) {
        setTopLevelFilteredData(response.data[0]);
        console.log("Top data", response.data);
      }
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }
  };

  useEffect(() => {
    fetchTopData();
    console.log("Top function called"); // Fetch data when client or date changes
  }, [selectedClient]);

  console.log(selectedClient);
  console.log(selectedClientId);
  return (
    <Grid
      container
      mb={2}
      sx={{ pl: { xs: 2, lg: menuCollapse ? 14 : 36 } }}
      spacing={3}
      pr={2}
    >
      {/* Daily Level */}
      <Grid item xs={12}>
        <Box className="mt-4">
          <Typography
            variant=""
            className="sm:text-3xl text-2xl font-bold font-Poppins"
          >
            Daily Level
          </Typography>
          <Box className="flex sm:flex-row flex-col justify-between sm:items-center items-start sm:gap-0 gap-5 bg-white border-0 py-3">
            <Box className="flex md:flex-row w-full flex-col gap-3 md:items-center justify-between">
              <Box className="flex gap-2">
                <CustomCheckBtn
                  showOpenCount={showOpenCount}
                  setShowOpenCount={setShowOpenCount}
                  label="Open Count"
                />
                <CustomCheckBtn
                  showOpenCount={showClickCount}
                  setShowOpenCount={setShowClickCount}
                  label="Click Count"
                />
              </Box>
              <Box className="flex  gap-3 sm:flex-row flex-col">
                <Button
                  variant="contained"
                  className="bg-gradient-to-r md:w-auto w-[100%]  from-[#FF4B2B] to-[#FF416C] text-white flex items-center gap-2"
                  onClick={handleRefresh} // Refresh data on click
                  disabled={compaignFetch}
                >
                  Refresh <HiRefresh size={18} color="white" />
                </Button>
                <DropdownCalendar
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={handleDateChange} // Pass down the date change handler
                />
                <Select
                  value={selectedClient}
                  onChange={(e) => {
                    const selectedClient = clientData.find(
                      (client) => client.selectedName == e.target.value
                    );
                    setSelectedClient(selectedClient.selectedName);
                    setSelectedClientId(selectedClient.clientId);
                    // fetchDailyData()
                  }}
                  sx={{
                    width: {md:200, xs:'100%'},
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
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>

      {compaignFetch ? (
        <Box className="w-4/5 mx-auto items-center flex flex-col gap-3 bg-white p-32">
          <CircularProgress size={50} color="error" thickness={10} />
          <Typography
            variant=""
            className="text-2xl font-semibold font-Poppins"
          >
            Please wait, Data is Refreshing...
          </Typography>
        </Box>
      ) : (
        <>
          {Object.keys(dailyFilteredData).length > 0 ? (
            <>
              {/* <Grid container spacing={3}> */}
              {/* Iterate through dailyFilteredData */}
              {(() => {
                const renderedStats = [];
                for (const statName in dailyFilteredData) {
                  if (dailyFilteredData.hasOwnProperty(statName)) {
                    const statValue = dailyFilteredData[statName];

                    if (
                      (statName === "open_count" && !showOpenCount) ||
                      (statName === "click_count" && !showClickCount) ||
                      statName === "total" ||
                      statName === "inprogress" ||
                      statName === "not_interested" ||
                      statName === "interested"
                    ) {
                      continue;
                    }

                    const gradient =
                      gradients[renderedStats.length % gradients.length];

                    renderedStats.push(
                      <Grid item md={4} sm={6} xs={12} key={statName}>
                        <Box
                          className={`p-5 rounded-md shadow-md text-white ${gradient}`}
                        >
                          <Typography variant="h6" textTransform={"capitalize"}>
                            {statName.replace(/_/g, " ")}
                          </Typography>
                          <Typography variant="subtitle2">
                            Total # of {statName.replace(/_/g, " ")}
                          </Typography>
                          <Typography variant="h4">{statValue}</Typography>
                        </Box>
                      </Grid>
                    );
                  }
                }
                return renderedStats;
              })()}
              {/* </Grid> */}
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {statGraphItems.map((item, index) => {
                    if (
                      (item.title === "Open Count" && !showOpenCount) ||
                      (item.title === "Click Count" && !showClickCount) ||
                      item.title === "Total" ||
                      item.title === "Inprogress" ||
                      item.title === "Not Interested" ||
                      item.title === "Interested"
                    ) {
                      return null;
                    }

                    return (
                      <Grid item md={4} sm={6} xs={12} key={index}>
                        <Box className="border border-red-500 sm:p-5 p-3 rounded-md shadow-md">
                          <Typography
                            variant="h6"
                            className="text-2xl font-semibold"
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className="text-base text-neutral-600"
                          >
                            {item.subtitle}
                          </Typography>
                          <CompaignCharts color={item.color} />
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </>
          ) : (
            <Box className="w-4/5 mx-auto items-center flex flex-col gap-3 bg-white p-10">
              <CircularProgress size={50} color="error" thickness={10} />
              <Typography
                variant=""
                className="text-2xl font-semibold font-Poppins"
              >
                Please wait, Data is Loading...
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Top Level */}
      <Grid item xs={12}>
        <Box className="mt-4">
          <Typography
            variant=""
            className="sm:text-3xl text-2xl font-bold font-Poppins"
          >
            Top Level
          </Typography>
          <Box className="flex sm:flex-row flex-col justify-between sm:items-center items-start sm:gap-0 gap-5 bg-white border-0 py-3">
            <Box className="flex md:flex-row w-full flex-col gap-3 md:items-center justify-between">
              <Box className="flex gap-2">
                <CustomCheckBtn
                  showOpenCount={showTopOpenCount}
                  setShowOpenCount={setShowTopOpenCount}
                  label="Open Count"
                />
                <CustomCheckBtn
                  showOpenCount={showTopClickCount}
                  setShowOpenCount={setShowTopClickCount}
                  label="Click Count"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      {/* Stats Section */}
      {compaignFetch ? (
        <Box className="w-4/5 mx-auto items-center flex flex-col gap-3 bg-white p-32">
          <CircularProgress size={50} color="error" thickness={10} />
          <Typography
            variant=""
            className="text-2xl font-semibold font-Poppins"
          >
            Please wait, Data is Refreshing...
          </Typography>
        </Box>
      ) : (
        <>
          {Object.keys(topLevelFilteredData).length > 0 ? (
            <>
              {/* <Grid container spacing={3}> */}
                {(() => {
                  const renderedStats = [];
                  for (const statName in topLevelFilteredData) {
                    if (topLevelFilteredData.hasOwnProperty(statName)) {
                      const statValue = topLevelFilteredData[statName];

                      // Conditionally render Open Count and Click Count based on toggles
                      if (
                        (statName === "open_count" && !showTopOpenCount) ||
                        (statName === "click_count" && !showTopClickCount) ||
                        statName === "_id"
                      ) {
                        continue; // Skip rendering if toggled off
                      }

                      // Create gradient index to style the box
                      const gradient =
                        gradients[renderedStats.length % gradients.length];

                      // Add the rendered element to the array
                      renderedStats.push(
                        <Grid item md={4} sm={6} xs={12} key={statName}>
                          <Box
                            className={`p-5 rounded-md shadow-md text-white ${gradient}`}
                          >
                            <Typography variant="h6" textTransform="capitalize">
                              {statName.replace(/_/g, " ")}
                            </Typography>
                            <Typography variant="subtitle2">
                              Total # of {statName.replace(/_/g, " ")}
                            </Typography>
                            <Typography variant="h4">{statValue}</Typography>
                          </Box>
                        </Grid>
                      );
                    }
                  }
                  return renderedStats;
                })()}
              {/* </Grid> */}
            </>
          ) : (
            <Box className="w-4/5 mx-auto items-center flex flex-col gap-3 bg-white p-5">
              <CircularProgress size={50} color="error" thickness={10} />
              <Typography
                variant=""
                className="text-2xl font-semibold font-Poppins"
              >
                Please wait, Data is Loading...
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* 
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {statGraphItems.map((item, index) => {
            // Hide "Open Count" and "Click Count"
            if (
              (item.title === "Open Count" && !showTopOpenCount) ||
              (item.title === "Click Count" && !showTopClickCount)
            ) {
              return null; // Skip rendering if not toggled
            }

            return (
              <Grid item md={4} sm={6} xs={12} key={index}>
                <Box className="border border-red-500 sm:p-5 p-3 rounded-md shadow-md">
                  <Typography variant="h6" className="text-2xl font-semibold">
                    {item.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className="text-base text-neutral-600"
                  >
                    {item.subtitle}
                  </Typography>
                  <CompaignCharts color={item.color} />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default CompaignAnalytics;
