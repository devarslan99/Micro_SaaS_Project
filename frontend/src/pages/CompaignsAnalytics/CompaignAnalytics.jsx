import { Box, Grid, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import ClientTable from '../../components/CompaingComp/ClientTable';
import ToggleSwitch from '../../components/CompaingComp/CustomToggleBtn';

const CompaignAnalytics = ({ menuCollapse }) => {
  const [showDailyLevel, setShowDailyLevel] = useState(true);

  const handleToggle = () => {
    setShowDailyLevel((prev) => !prev);
  };

  return (
    <Grid
      container
      mb={2}
      sx={{ pl: { xs: 0, lg: menuCollapse ? 14 : 36 } }}
      spacing={2}
    >
      <Grid item xs={12}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor="white"
          borderColor="#F0F0F0"
          borderRadius={2}
          p={3}
          mt={4}
        >
          <Typography variant="h6" fontWeight="bold">
            {showDailyLevel ? "Daily Level" : "Top Level"} Compaings
          </Typography>
          <ToggleSwitch isToggled={showDailyLevel} onToggle={handleToggle} />
        </Box>

        <Box
          bgcolor="white"
          borderColor="#F0F0F0"
          borderRadius={2}
          p={3}
          mt={4}
        >
          {showDailyLevel ? (
            <>
            <ClientTable /> 
            </>
          ) : (
            <ClientTable />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default CompaignAnalytics;
