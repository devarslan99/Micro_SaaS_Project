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
import { format, parse } from "date-fns";
import CustomCheckBtn from "../../components/CompaingComp/CustomCheckBtn";
import DropdownCalendar from "../../components/CompaingComp/DatePicker";
import CompaignCharts from "../../components/CompaingComp/CompaignCharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompaignAnalytics = ({ menuCollapse }) => {
  const [selectedClient, setSelectedClient] = useState(""); // Dropdown client selection
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showOpenCount, setShowOpenCount] = useState(false);
  const [showClickCount, setShowClickCount] = useState(false);
  const [showTopOpenCount, setShowTopOpenCount] = useState(false);
  const [showTopClickCount, setShowTopClickCount] = useState(false);
  const [dailyFilteredData, setDailyFilteredData] = useState([]);
  const [topLevelFilteredData, setTopLevelFilteredData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // const token = localStorage.getItem("authToken");
        const softwareToken = localStorage.getItem("softwareToken");
        console.log(softwareToken);

        if (!softwareToken) {
          navigate("/home"); // Redirect if no authToken or softwareToken found
          return;
        }

        const response = await axios.get("http://localhost:5000/clients", {
          headers: {
            // "Authorization": `${token}`,
            softwareToken: `${softwareToken}`,
          },
        });

        console.log(response.data);

        if (response.status === 200) {
          setClientData(response.data); // Set the fetched clients to state
          setSelectedClient(response.data[0]?.name); // Set default selected client
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

  const parseDate = (dateString) => {
    return parse(dateString, "dd/MM/yy", new Date());
  };

  const handleDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  // const handleDailyDateFilter = () => {
  //   const filtered = clientData
  //     .filter((client) => client.name === selectedClient) // First, filter by selected client
  //     .map((client) => {
  //       // Filter the client's stats by date for Daily Level
  //       const filteredStats = client.stats.filter((stat) => {
  //         const itemDate = parseDate(stat.date);
  //         return (
  //           (!startDate || itemDate >= new Date(startDate)) &&
  //           (!endDate || itemDate <= new Date(endDate))
  //         );
  //       });

  //       // Return the client with filtered stats
  //       return { ...client, stats: filteredStats };
  //     })
  //     .filter((client) => client.stats.length > 0); // Only keep clients with stats in the date range

  //   setDailyFilteredData(filtered);
  // };
  const fetchDailyData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !selectedClient || !startDate || !endDate) return;

      const response = await axios.get(
        "http://localhost:5000/api/compaighs/daily",
        {
          clientID: selectedClient,
          startDate,
          endDate,
          token: `${token}`,
        }
      );

      if (response.status === 200) {
        setDailyFilteredData(response.data); // Assuming the API returns the filtered data
      }
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }
  };
  
  useEffect(() => {
    fetchDailyData(); // Fetch data when client or date changes
  }, [selectedClient, startDate, endDate]);

  const handleTopLevelFilter = () => {
    const filtered = clientData.filter(
      (client) => client.name === selectedClient
    ); // Filter by selected client
    // .map((client) => {
    //   // Don't apply any date filter for Top Level
    //   return { ...client, stats: client.stats };
    // })
    // .filter((client) => client.stats.length > 0); // Only keep clients with stats

    // setTopLevelFilteredData(filtered);
  };

  // useEffect(() => {
  //   handleDailyDateFilter(); // Filter for Daily Level when date or client changes
  // }, [startDate, endDate, selectedClient]);

  useEffect(() => {
    handleTopLevelFilter(); // Trigger Top Level Filter when client changes
  }, [selectedClient]);

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
                  onChange={(e) => setSelectedClient(e.target.value)}
                  displayEmpty
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
                    <MenuItem key={client.id} value={client.name}>
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
      {dailyFilteredData.length > 0 &&
        dailyFilteredData.map((client, clientIndex) => {
          // Initialize an object to store the aggregated values for each stat
          const aggregatedStats = {};

          client.stats.forEach((stat) => {
            stat.statsName.forEach((statName, index) => {
              // If stat is not yet added, initialize it
              if (!aggregatedStats[statName]) {
                aggregatedStats[statName] = 0;
              }
              // Sum the values for the current stat across all dates
              aggregatedStats[statName] += stat.values[index];
            });
          });

          // Now render the boxes with aggregated values
          return Object.keys(aggregatedStats).map((statName, index) => {
            // Conditionally render Open Count and Click Count
            if (
              (statName === "Open Count" && !showOpenCount) ||
              (statName === "Click Count" && !showClickCount) ||
              statName === "Total" ||
              statName === "Inprogress" ||
              statName === "Not Interested" ||
              statName === "Interested"
            ) {
              return null; // Skip rendering if toggled off
            }
            const gradient = gradients[index % gradients.length];

            return (
              <Grid item md={4} sm={6} xs={12} key={`${clientIndex}-${index}`}>
                <Box
                  className={`p-5 rounded-md shadow-md text-white ${gradient}`}
                >
                  <Typography variant="h6">{statName}</Typography>
                  <Typography variant="subtitle2">
                    {" "}
                    Total # of {statName}
                    {/* {`Client: ${client.name}`} */}
                  </Typography>
                  <Typography variant="h4">
                    {aggregatedStats[statName]}
                  </Typography>
                </Box>
              </Grid>
            );
          });
        })}

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
      {topLevelFilteredData.length > 0 &&
        topLevelFilteredData.map((client, clientIndex) => {
          // Initialize an object to store the aggregated values for each stat
          const aggregatedStats = {};

          client.stats.forEach((stat) => {
            stat.statsName.forEach((statName, index) => {
              // If stat is not yet added, initialize it
              if (!aggregatedStats[statName]) {
                aggregatedStats[statName] = 0;
              }
              // Sum the values for the current stat across all dates
              aggregatedStats[statName] += stat.values[index];
            });
          });

          // Now render the boxes with aggregated values
          return Object.keys(aggregatedStats).map((statName, index) => {
            // Conditionally render Open Count and Click Count
            if (
              (statName === "Open Count" && !showTopOpenCount) ||
              (statName === "Click Count" && !showTopClickCount)
            ) {
              return null; // Skip rendering if toggled off
            }
            const gradient = gradients[index % gradients.length];

            return (
              <Grid item md={4} sm={6} xs={12} key={`${clientIndex}-${index}`}>
                <Box
                  className={`p-5 rounded-md shadow-md text-white ${gradient}`}
                >
                  <Typography variant="h6">{statName}</Typography>
                  <Typography variant="subtitle2">
                    {" "}
                    Total # of {statName}
                    {/* {`Client: ${client.name}`} */}
                  </Typography>
                  <Typography variant="h4">
                    {aggregatedStats[statName]}
                  </Typography>
                </Box>
              </Grid>
            );
          });
        })}

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
      </Grid>
    </Grid>
  );
};

export default CompaignAnalytics;
