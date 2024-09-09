import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { HiRefresh } from "react-icons/hi";
import CustomInput from "../../components/EmailStatComp/CustomInput";
import EmailTable from "../../components/EmailStatComp/EmailsTable";

const EmailStats = ({ menuCollapse }) => {
  const [recovery, setRecovery] = useState(1);
  const [moderate, setModerate] = useState(8);
  const [maxeffort, setMaxeffort] = useState(20);

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
          <Box className="flex sm:flex-row flex-col justify-end sm:items-center items-start sm:gap-3 gap-5">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white flex items-center gap-2"
            >
              Refresh <HiRefresh size={18} color="white" />
            </Button>
            <Button
              variant="contained"
              className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white text-sm"
            >
              Reconnect all failed email accounts
            </Button>
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
          onChange={(e) => setMaxeffort (e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <EmailTable/>
      </Grid>
    </Grid>
  );
};

export default EmailStats;
