import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { clientData, gradients, statGraphItems } from "../../data/mockData";
import { format, parse, subDays } from "date-fns";
import CustomCheckBtn from "../../components/CompaingComp/CustomCheckBtn";
import DropdownCalendar from "../../components/CompaingComp/DatePicker";
import CompaignCharts from "../../components/CompaingComp/CompaignCharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompaignAnalytics = ({ menuCollapse }) => {
  const [selectedClient, setSelectedClient] = useState(""); // Dropdown client selection
  const [selectedClientId, setSelectedClientId] = useState(null); // Dropdown client selection
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] =  useState(new Date());
  const [showOpenCount, setShowOpenCount] = useState(false);
  const [showClickCount, setShowClickCount] = useState(false);
  const [showTopOpenCount, setShowTopOpenCount] = useState(false);
  const [showTopClickCount, setShowTopClickCount] = useState(false);
  const [dailyFilteredData, setDailyFilteredData] = useState({});
  const [topLevelFilteredData, setTopLevelFilteredData] = useState({});
  const [clientData, setClientData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // const token = localStorage.getItem("authToken");
        const softwareToken = localStorage.getItem("softwareToken");
        console.log(softwareToken);

        // if (!softwareToken) {
        //   navigate("/home"); // Redirect if no authToken or softwareToken found
        //   return;
        // }

        const response = await axios.get("http://localhost:5000/clients", {
          headers: {
            // "Authorization": `${token}`,
            softwareToken: `${softwareToken}`,
          },
        });

        console.log("client data", response.data);

        if (response.status === 200 && response.data.length > 0) {
          setClientData(response.data); // Set the fetched clients to state
          setSelectedClient(response.data[0]?.name); // Set default selected client
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
      navigate("/"); // Redirect to /home if token exists
    }
  }, []);

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
        "http://localhost:5000/api/campaighs/daily",
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
        "http://localhost:5000/api/campaighs/top-level-stats",
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
              <Box className="flex gap-3 sm:flex-row flex-col">
                <DropdownCalendar
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={handleDateChange} // Pass down the date change handler
                />
                <Select
                  value={selectedClient}
                  onChange={(e) => {
                    const selectedClient = clientData.find(
                      (client) => client.name === e.target.value
                    );
                    setSelectedClient(selectedClient.name);
                    setSelectedClientId(selectedClient.clientId);
                  }}
                  sx={{
                    width: 200,
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
                    <MenuItem key={client.clientId} value={client.name}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      {/* Stats Section */}
      {Object.keys(dailyFilteredData).length > 0 ? (
        (() => {
          // Initialize an empty array to store the rendered elements
          const renderedStats = [];

          // Iterate over the dailyFilteredData object using a for...in loop
          for (const statName in dailyFilteredData) {
            if (dailyFilteredData.hasOwnProperty(statName)) {
              const statValue = dailyFilteredData[statName];

              // Conditionally render Open Count and Click Count based on toggles
              if (
                (statName === "open_count" && !showOpenCount) ||
                (statName === "click_count" && !showClickCount) ||
                statName === "total" ||
                statName === "inprogress" ||
                statName === "not_interested" ||
                statName === "interested"
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

          // Return the rendered elements
          return renderedStats;
        })() ) : (
          <Typography variant="h4" color="textSecondary" textAlign={"center"} width={"100%"} padding={32}>
            No data available to display.
          </Typography>
        )}

      <Grid item xs={12}>
        <Grid container spacing={3}>
          {statGraphItems.map((item, index) => {
            // Hide "Open Count" and "Click Count"
            if (
              (item.title === "Open Count" && !showOpenCount) ||
              (item.title === "Click Count" && !showClickCount) ||
              item.title === "Total" ||
              item.title === "Inprogress" ||
              item.title === "Not Interested" ||
              item.title === "Interested"
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
      </Grid>

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
      {Object.keys(topLevelFilteredData).length > 0 ? (
        (() => {
          // Initialize an empty array to store the rendered elements
          const renderedStats = [];

          // Iterate over the topLevelFilteredData object using a for...in loop
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

          // Return the rendered elements
          return renderedStats;
        })()
      ) : (
        <Typography variant="h4" color="textSecondary" textAlign={"center"} width={"100%"} padding={32}>
          No data available to display.
        </Typography>
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
