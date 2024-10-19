import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Button,
  Checkbox,
  ListItemText,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { clientData, gradients, statGraphItems } from "../../data/mockData";
import { format, parse, subDays } from "date-fns";
import CustomCheckBtn from "../../components/CompaingComp/CustomCheckBtn";
import DropdownCalendar from "../../components/CompaingComp/DatePicker";
import CompaignCharts from "../../components/CompaingComp/CompaignCharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiRefresh } from "react-icons/hi";
import { BASE_URL } from "../../config";
import MyContext from "../../hook/context";

const CompaignAnalytics = ({ menuCollapse }) => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());
  // const [showOpenCount, setShowOpenCount] = useState(false);
  // const [showClickCount, setShowClickCount] = useState(false);
  const [compaignFetch, setCompaignFetch] = useState(false);
  const [showTopOpenCount, setShowTopOpenCount] = useState(false);
  const [showTopClickCount, setShowTopClickCount] = useState(false);
  const [dailyFilteredData, setDailyFilteredData] = useState({});
  const [topLevelFilteredData, setTopLevelFilteredData] = useState({});
  const [selectedStats, setSelectedStats] = useState("");
  const [selectedTopStats, setSelectedTopStats] = useState("");
  const {
    clientData,
    selectedClientId,
    setSelectedClientId,
    selectedClient,
    setSelectedClient,
  } = useContext(MyContext);
  const navigate = useNavigate();
  const loggedInClientId = localStorage.getItem("clientId");
  const isClientLoggedIn = localStorage.getItem("isClient") === "true";

  console.log(typeof isClientLoggedIn);

  const handleRefresh = async () => {
    const token = localStorage.getItem("authToken");

    useEffect(() => {
      const softwareToken = localStorage.getItem("softwareToken");
      if (!softwareToken) {
        navigate("/home");
      }
    }, [navigate]);
    try {
      setCompaignFetch(true);
      const response = await axios.get(`${BASE_URL}/campaighs `, {
        headers: {
          Authorization: token,
          softwareAuthorization: softwareToken,
        },
      });
      if (response.status === 200) {
        console.log("Client email:", response.data.message);
        setCompaignFetch(false);
      }
    } catch (error) {
      console.error("Error fetching client email:", error);
    }
  };

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

      const response = await axios.get(`${BASE_URL}/api/campaighs/daily`, {
        headers: {
          clientId:
            isClientLoggedIn === false
              ? selectedClientId !== null
                ? selectedClientId
                : "null"
              : loggedInClientId !== null
              ? loggedInClientId
              : "null",
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          token: `${token}`,
        },
      });

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
            clientId:
              isClientLoggedIn === false
                ? selectedClientId !== null
                  ? selectedClientId
                  : "null"
                : loggedInClientId !== null
                ? loggedInClientId
                : "null",
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

  const statsOptions = [
    { value: "sent_count", label: "Sent Count" },
    { value: "unique_sent_count", label: "Unique Sent Count" },
    { value: "open_count", label: "Open Count" },
    { value: "unique_open_count", label: "Unique Open Count" },
    { value: "click_count", label: "Click Count" },
    { value: "unique_click_count", label: "Unique Click Count" },
    { value: "reply_count", label: "Reply Count" },
    { value: "bounce_count", label: "Bounce Count" },
  ];
  const topStatsOptions = [
    ...statsOptions,
    { value: "total", label: "Total" },
    { value: "inprogress", label: "Inprogress" },
    { value: "intrested", label: "Interested" },
    { value: "notStarted", label: "Not Started" },
  ];

  const handleStatChange = (event) => {
    const value = event.target.value;
    console.log("value", value);
    if (selectedStats.indexOf(value) === -1) {
      setSelectedStats([...selectedStats, value]);
    } else {
      setSelectedStats(selectedStats.filter((stat) => stat !== value));
    }
  };

  const handleTopStatChange = (event) => {
    const value = event.target.value;
    console.log("value", value);

    if (selectedTopStats.indexOf(value) === -1) {
      setSelectedTopStats([...selectedTopStats, value]);
    } else {
      setSelectedTopStats(selectedTopStats.filter((stat) => stat !== value));
    }
  };
  console.log(selectedClientId);
  console.log(loggedInClientId);
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
              <Select
                // multiple
                value={selectedStats} // Ensure this holds the array of selected values
                onChange={handleStatChange}
                displayEmpty
                sx={{
                  width: { md: 200, xs: "100%" },
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  height: "38px",
                  color: "#FF4B2B",
                  "& .MuiSelect-icon": { color: "#FF4B2B" },
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
                renderValue={(selected) => {
                  if (Array.isArray(selected) && selected.length > 0) {
                    return `Counts : ${selected.length} selected`;
                  } else {
                    return "Select Stat";
                  }
                }}
              >
                <MenuItem className="hidden" value="">
                  Select Stat
                </MenuItem>
                {statsOptions.map((stat) => (
                  <MenuItem key={stat.value} value={stat.value}>
                    <CustomCheckBtn
                      checked={selectedStats.indexOf(stat.value) > -1}
                    />
                    <ListItemText primary={stat.label} />
                  </MenuItem>
                ))}
              </Select>
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
                      width: { md: 200, xs: "100%" },
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
                      <MenuItem
                        key={client.clientId}
                        value={client.selectedName}
                      >
                        {client.selectedName}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <></>
                )}
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
              {(() => {
                const renderedStats = [];
                for (const statName in dailyFilteredData) {
                  if (
                    dailyFilteredData.hasOwnProperty(statName) &&
                    (selectedStats.length < 0 ||
                      selectedStats.includes(statName)) // Check if statName is in selectedStats
                  ) {
                    const statValue = dailyFilteredData[statName];
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
              <Grid item xs={12}>
                {selectedStats.length > 0 ? (
                  <Grid container spacing={3}>
                    {statGraphItems.map((item, index) => {
                      const itemKey = item.title
                        .replace(/ /g, "_")
                        .toLowerCase();

                        console.log(item.title .replace(/ /g, "_")
                        .toLowerCase())

                      if (!selectedStats.includes(itemKey)) {
                        return null; // If not, skip rendering this item
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
                ) : (
                  <Box className="flex justify-center mt-5 mb-5">
                    <Typography variant="h5">No graph available</Typography>
                  </Box>
                )}
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
                <Select
                  // multiple
                  value={selectedTopStats} // Ensure this holds the array of selected values
                  onChange={handleTopStatChange}
                  displayEmpty
                  sx={{
                    width: { md: 200, xs: "100%" },
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    height: "38px",
                    color: "#FF4B2B",
                    "& .MuiSelect-icon": { color: "#FF4B2B" },
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
                  renderValue={(selected) => {
                    if (Array.isArray(selected) && selected.length > 0) {
                      return `Counts : ${selected.length} selected`;
                    } else {
                      return "Select Stat";
                    }
                  }}
                >
                  <MenuItem className="hidden" value="">
                    Select Stat
                  </MenuItem>
                  {topStatsOptions.map((stat) => (
                    <MenuItem key={stat.value} value={stat.value}>
                      <CustomCheckBtn
                        checked={selectedTopStats.indexOf(stat.value) > -1}
                      />
                      <ListItemText primary={stat.label} />
                    </MenuItem>
                  ))}
                </Select>
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
                  if (
                    topLevelFilteredData.hasOwnProperty(statName) &&
                    (selectedTopStats.length < 0 ||
                      selectedTopStats.includes(statName))
                  ) {
                    const statValue = topLevelFilteredData[statName];

                    const gradient =
                      gradients[renderedStats.length % gradients.length];
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
    </Grid>
  );
};

export default CompaignAnalytics;
