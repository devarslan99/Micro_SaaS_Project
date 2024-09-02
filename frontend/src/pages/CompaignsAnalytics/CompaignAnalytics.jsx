import { Box, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import ClientTable from "../../components/CompaingComp/ClientTable";
import ToggleSwitch from "../../components/CompaingComp/CustomToggleBtn";
import { clientData } from "../../data/mockData";
import { format, parse } from "date-fns";
import CustomCheckBtn from "../../components/CompaingComp/CustomCheckBtn";
import CustomDateInput from "../../components/CompaingComp/CustomInput";

const CompaignAnalytics = ({ menuCollapse }) => {
  const [showDailyLevel, setShowDailyLevel] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showOpenCount, setShowOpenCount] = useState(false);
  const [showClickCount, setShowClickCount] = useState(false);
  const [filteredData, setFilteredData] = useState(clientData);

  const handleToggle = () => {
    setShowDailyLevel((prev) => !prev);
  };

  const parseDate = (dateString) => {
    return parse(dateString, "dd/MM/yy", new Date());
  };

  const handleDateChange = () => {
    if (startDate && endDate) {
      const filtered = clientData.filter((item) => {
        const itemDate = parseDate(item.date);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(clientData);
    }
  };
  return (
    <Grid
      container
      mb={2}
      sx={{ pl: { xs: 0, lg: menuCollapse ? 14 : 36 } }}
      spacing={2}
    >
      <Grid item xs={12}>
        <Box className="flex sm:flex-row flex-col justify-between sm:items-center items-start sm:gap-0 gap-5 bg-white border-0 p-3 mt-4">
          {!showDailyLevel ? (
            <Box className="flex md:flex-row flex-col gap-3 md:items-center">
              <Box className="flex gap-3">
                <CustomDateInput
                  id="start-date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    handleDateChange();
                  }}
                />
                <CustomDateInput
                  id="end-date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    handleDateChange();
                  }}
                />
              </Box>
              <Box className="flex">
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
            </Box>
          ) : (
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
          )}
          <ToggleSwitch isToggled={showDailyLevel} onToggle={handleToggle} />
        </Box>

        <Box bgcolor="white" borderColor="#F0F0F0" borderRadius={2} p={3}>
          {showDailyLevel ? (
            <>
              <ClientTable
                data={filteredData}
                showOpenCount={showOpenCount}
                showClickCount={showClickCount}
                showDailyLevel={showDailyLevel}
              />
            </>
          ) : (
            <ClientTable
              data={filteredData}
              showOpenCount={showOpenCount}
              showClickCount={showClickCount}
              showDailyLevel={showDailyLevel}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default CompaignAnalytics;
