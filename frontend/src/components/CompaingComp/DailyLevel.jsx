import { Box, Grid, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";
import CustomCheckBtn from "./CustomCheckBtn";
import DropdownCalendar from "./DatePicker";
import { clientData, statGraphItems, statItems } from "../../data/mockData";
import CompaignCharts from "./CompaignCharts";

const DailyLevel = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [showOpenCount, setShowOpenCount] = useState(false);
  const [showClickCount, setShowClickCount] = useState(false);

  return (
    <div>
      <Grid item xs={12}>
        <Box className="mt-4">
          <Typography variant="" className="text-3xl font-bold">
            Daily Level
          </Typography>
          <Box className="flex sm:flex-row flex-col justify-between sm:items-center items-start sm:gap-0 gap-5 bg-white border-0 p-3">
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
              <Box className="flex gap-3">
                <DropdownCalendar />
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
                  <MenuItem value="" disabled>
                    Select Client
                  </MenuItem>
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
      {statItems.map((item, index) => {
        // Conditionally render if `show` property exists
        if (
          (item.title === "Open Count" && !showOpenCount) ||
          (item.title === "Click Count" && !showClickCount)
        ) {
          return null; // Skip rendering if not toggled
        }

        return (
          <Grid item md={4} sm={6} xs={12} key={index}>
            <Box
              className={`${item.gradient} p-5 rounded-md shadow-md text-white`}
            >
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="subtitle2">{item.subtitle}</Typography>
              <Typography variant="h4">{item.value}</Typography>
            </Box>
          </Grid>
        );
      })}

      <Grid item xs={12}>
        <Grid container spacing={3}>
          {statGraphItems.map((item, index) => {
            // Hide "Open Count" and "Click Count"
            if (
              (item.title === "Open Count" && !showOpenCount) ||
              (item.title === "Click Count" && !showClickCount)
            ) {
              return null; // Skip rendering if not toggled
            }

            return (
              <Grid item md={4} xs={12} key={index}>
                <Box className="border border-red-500 p-5 rounded-md shadow-md">
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
    </div>
  );
};

export default DailyLevel;
