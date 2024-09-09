import {
  Avatar,
  Box,
  LinearProgress,
  Checkbox,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { clientData, email_stats } from "../../data/mockData";
import CustomCheckBtn from "./CustomCheckBtn";
//   import './table.css'

const EmailTable = () => {
  const columns = [
    {
      field: "warmup_status",
      headerName: "Warmup Status",
      headerClassName: "super-app-theme-header",
      width: 190,
    },
    {
      field: "warmup_reputation",
      headerName: "Warmup Reputation %",
      headerClassName: "super-app-theme-header",
      width: 150,
    },
    {
      field: "warmup_reputation_bar",
      headerName: "Warmup Reputation Bar",
      headerClassName: "super-app-theme-header",
      width: 200,
      renderCell: ({ row }) => (
        <Box width="100%" className="mt-5">
          <LinearProgress
            variant="determinate"
            value={row.warmup_reputation_bar}
            sx={{
              height: 10,
              borderRadius: 5,
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  row.warmup_reputation_bar >= 90 ? "#FF4A2E" : "#FF4A2E",
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: "email_health",
      headerName: "Email Health",
      headerClassName: "super-app-theme-header",
      width: 150,
    },
    {
      field: "msg_per_day",
      headerName: "Message Per Day",
      headerClassName: "super-app-theme-header",
      width: 150,
    },
    {
      field: "daily_sent_count",
      headerName: "Daily Sent Count",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => {
        let displayValue;
        const sentCount = row.daily_sent_count;
        const msgPerDay = row.msg_per_day;

        if (sentCount <= 1) {
          displayValue = `${sentCount}/1`;
        } else if (sentCount > 1 && sentCount <= 8) {
          displayValue = `${sentCount}/${ msgPerDay}`;
        } else if (sentCount > 8 && sentCount <= 20) {
          displayValue = `${sentCount}/${ msgPerDay}`;
        }

        return <Typography className="pt-4">{displayValue}</Typography>;
      },
    },
    {
      field: "set_recovery",
      headerName: "Set Recovery",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => {
        const sentCount = row.msg_per_day;
        return <CustomCheckBtn checked={sentCount <= 1} />;
      },
    },
    {
      field: "set_moderate",
      headerName: "Set Moderate",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => {
        const sentCount = row.msg_per_day;
        return <CustomCheckBtn checked={sentCount > 1 && sentCount <= 8} />;
      },
    },
    {
      field: "set_max_effort",
      headerName: "Set Max Effort",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => {
        const sentCount = row.msg_per_day;
        return <CustomCheckBtn checked={sentCount > 8 && sentCount <= 20} />;
      },
    },
  ];

  return (
    <Box
    mt={4}
      sx={{
        bgcolor: "transparent",
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "linear-gradient(to bottom, #FF4B2B, #FF416C)",
          color: "white",
          fontSize: 16,
          fontWeight: "bold",
        },
        "& .super-app-theme-header": {
          backgroundColor: "rgb(255,70,73)",
        },
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: "bold",
          fontSize: "16px",
        },
        "& .MuiDataGrid-row": {
          backgroundColor: "rgba(255, 218, 219, 0.5)", // light red shade for the rows
          "&:nth-of-type(odd)": {
            backgroundColor: "rgba(255, 199, 204, 0.5)", // alternating row color
          },
        },
      }}
    >
      <Box className="flex justify-around mb-4">
        <Typography variant="" className="sm:text-3xl text-xl font-bold font-Poppins">Warmup Section</Typography>
        <Typography variant="" className="sm:text-3xl text-xl font-bold font-Poppins">Sending Section</Typography>
      </Box>
      <DataGrid
        rows={email_stats}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
      />
    </Box>
  );
};

export default EmailTable;
