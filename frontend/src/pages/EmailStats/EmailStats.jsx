import { Box, Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HiRefresh } from "react-icons/hi";
import CustomInput from "../../components/EmailStatComp/CustomInput";
import EmailTable from "../../components/EmailStatComp/EmailsTable";
import { email_stats } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

const EmailStats = ({ menuCollapse }) => {
  const [recovery, setRecovery] = useState(1);
  const [moderate, setModerate] = useState(8);
  const [maxeffort, setMaxeffort] = useState(20);
  const [selectedClient, setSelectedClient] = useState(email_stats[0].email);
  const [emailHealth, setEmailHealth] = useState("All");
  const [filteredData, setFilteredData] = useState(email_stats);

  const navigate = useNavigate();  


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Redirect to /home if token exists
    }
  }, []);

  const handleFilter = () => {
    const filtered = email_stats
      .filter((item) => item.email === selectedClient) // Filter by selected client
      .filter(
        (item) => emailHealth === "All" || item.email_health === emailHealth
      );

    setFilteredData(filtered);
  };

  useEffect(() => {
    handleFilter(); // Trigger filter when client or email health changes
  }, [selectedClient, emailHealth]);

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
                onChange={(e) => setSelectedClient(e.target.value)}
                displayEmpty
                sx={{
                  width: '100%',
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
                {email_stats.map((item) => (
                  <MenuItem key={item.id} value={item.email}>
                    {item.email}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={emailHealth}
                onChange={(e) => setEmailHealth(e.target.value)}
                displayEmpty
                sx={{
                  width: '100%',
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
              >
                Refresh <HiRefresh size={18} color="white" />
              </Button>
              <Button
                variant="contained"
                className="bg-gradient-to-r lg:w-auto w-[100%] from-[#FF4B2B] to-[#FF416C] text-white text-sm"
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
        {" "}
        <CustomInput
          id="moderate"
          label={"Moderate"}
          value={moderate}
          onChange={(e) => setModerate(e.target.value)}
        />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        {" "}
        <CustomInput
          id="maxeffort"
          label={"Max Effort"}
          value={maxeffort}
          onChange={(e) => setMaxeffort(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <EmailTable
          data={filteredData}
          recovery={recovery}
          moderate={moderate}
          maxeffort={maxeffort}
          setData={setFilteredData}
        />
      </Grid>
    </Grid>
  );
};

export default EmailStats;
