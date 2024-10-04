import {
  Avatar,
  Box,
  LinearProgress,
  Checkbox,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useContext } from "react";
import { clientData, email_stats } from "../../data/mockData";
import CustomCheckBtn from "./CustomCheckBtn";
import axios from "axios";
//   import './table.css'
import { BASE_URL } from "../../config";
const EmailTable = ({ data, recovery, moderate, maxeffort, setData }) => {
  console.log("Table Data", data);


  const handleCheckboxChange = async (rowId, field) => {
    const token = localStorage.getItem("authToken");
    const softwareToken = localStorage.getItem("softwareToken");

    let message_per_day;
    if (field === "set_recovery") {
      message_per_day = recovery;
    } else if (field === "set_moderate") {
      message_per_day = moderate;
    } else if (field === "set_max_effort") {
      message_per_day = maxeffort;
    }

    // Find the current row data and update the msg_per_day based on the selected checkbox
    const updatedData = data.map((row) => {
      console.log(row.email_account_id);
      if (row._id === rowId) {
        // Send the update request to the backend
        const updateData = async () => {
          try {
            const response = await axios.post(
              `${BASE_URL}/api/email/max-day`,
              {
                email_account_id: row.email_account_id, // Use email account ID (row._id)
                max_email_per_day: message_per_day, // Send the new message_per_day value
              },
              {
                headers: {
                  Authorization: token, // Pass the auth token in headers
                  softwareAuthorization: softwareToken, // Pass the software token in headers
                },
              }
            );
            if (response.status === 200) {
              console.log("Update successful:", response.data);
            }
          } catch (error) {
            console.error("Error updating message per day:", error);
          }
        };

        updateData(); // Call the function to update the backend

        return { ...row, message_per_day }; // Update the row in the local state
      }
      return row;
    });

    // Update the data state locally
    setData(updatedData);
  };

  const columns = [
    {
      field: "from_email",
      headerName: "Emails",
      headerClassName: "super-app-theme-header",
      headerAlign: "center",
      width: 190,
    },
    {
      field: "warmupStatus",
      headerName: "Warmup Status",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => {
        if (row.warmupStatus) {
          return <Typography className="pt-4">{row.warmupStatus}</Typography>;
        } else {
          return <Typography className="pt-4">N/A</Typography>;
        }
      },
    },
    {
      field: "email_health",
      headerName: "Email Health",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => {
        if (row.warmupReputation) {
          const reputationvalue = parseFloat(
            row.warmupReputation.replace("%", "")
          );

          // Check if the reputation value is valid
          if (isNaN(reputationvalue)) {
            return "N/A";
          }

          // Set the email health based on the reputation value
          if (reputationvalue >= 100) {
            return "Excellent";
          } else if (reputationvalue >= 98) {
            return "Decent";
          } else if (reputationvalue >= 96) {
            return "Okay";
          } else if (reputationvalue >= 91) {
            return "Bad";
          } else {
            return "Very Bad";
          }
        } else {
          // If warmupReputation does not exist, return "N/A"
          return "N/A";
        }
      },
    },
    {
      field: "warmup_reputation_bar",
      headerName: "Warmup Reputation Bar",
      headerClassName: "super-app-theme-header",
      width: 200,
      renderCell: ({ row }) => {
        if (row.warmupReputation) {
          const reputationvalue = parseFloat(
            row.warmupReputation.replace("%", "")
          );
          return (
            <Box width="100%" className="mt-5">
              <LinearProgress
                variant="determinate"
                value={reputationvalue}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      reputationvalue >= 100
                        ? "#28A745"
                        : reputationvalue >= 98
                        ? "#007BFF"
                        : reputationvalue >= 96
                        ? "#FFC107"
                        : reputationvalue >= 91
                        ? "#FD7E14"
                        : "#DC3545",
                  },
                }}
              />
            </Box>
          );
        } else {
          return <Typography className="pt-4">N/A</Typography>;
        }
      },
    },
    {
      field: "warmupReputation",
      headerName: "Warmup Reputation %",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => {
        const warmupReputation = row.warmupReputation;

        // Display "NA" if warmupReputation does not exist, otherwise show the value
        const displayValue =
          warmupReputation !== undefined && warmupReputation !== null
            ? `${warmupReputation}`
            : "NA";

        return <Typography className="pt-4">{displayValue}</Typography>;
      },
    },
    {
      field: "message_per_day",
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
        const msgPerDay = row.message_per_day;

        if (sentCount <= 1) {
          displayValue = `${sentCount}/${msgPerDay}`;
        } else if (sentCount > 1 && sentCount <= 8) {
          displayValue = `${sentCount}/${msgPerDay}`;
        } else if (sentCount > 8 && sentCount <= 20) {
          displayValue = `${sentCount}/${msgPerDay}`;
        }

        return <Typography className="pt-4">{displayValue}</Typography>;
      },
    },
    {
      field: "set_recovery",
      headerName: "Set Recovery",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => (
        <CustomCheckBtn
          checked={row.message_per_day == 1} // Check if message_per_day matches the recovery value
          onChange={() => handleCheckboxChange(row._id, "set_recovery")}
        />
      ),
    },
    {
      field: "set_moderate",
      headerName: "Set Moderate",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => (
        <CustomCheckBtn
          checked={row.message_per_day >= 2 && row.message_per_day <= 8} // Check if message_per_day matches the moderate value
          onChange={() => handleCheckboxChange(row._id, "set_moderate")}
        />
      ),
    },
    {
      field: "set_max_effort",
      headerName: "Set Max Effort",
      headerClassName: "super-app-theme-header",
      width: 150,
      renderCell: ({ row }) => (
        <CustomCheckBtn
          checked={row.message_per_day >= 9 && row.message_per_day <= 20} // Check if message_per_day matches the maxeffort value
          onChange={() => handleCheckboxChange(row._id, "set_max_effort")}
        />
      ),
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
      {/* <Box className="flex justify-around mb-4">
        <Typography
          variant=""
          className="sm:text-3xl text-xl font-bold font-Poppins"
        >
          Warmup Section
        </Typography>
        <Typography
          variant=""
          className="sm:text-3xl text-xl font-bold font-Poppins"
        >
          Sending Section
        </Typography>
      </Box> */}
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row._id}
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
