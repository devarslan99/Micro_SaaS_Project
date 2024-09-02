import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaPlusCircle } from "react-icons/fa";
import React from "react";
import { clientData } from "../../data/mockData";

const ClientTable = ({ onInviteClick }) => {
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <Avatar src={row.avatar} alt={row.name} />
          <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
            {row.name}
          </span>
        </Box>
      ),
    },
    {
        field: "email",
        headerName: "Email",
        width: 250  ,
      },
    {
      field: "created_at",
      headerName: "Creates At",
      width: 170,
    },
    {
      field: "user_id",
      headerName: "User Id",
      width: 180,
    },
    
    {
      field: "logout",
      headerName: "Logout",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: ({ row }) => {
        const { logout } = row;
        console.log("Stage:", status);
        return (
          <Box display="flex" justifyContent="center" alignItems={"center"}>
            <Typography
              variant="caption"
              px={0.5}
              borderRadius={2}
              sx={{
                backgroundColor: "#198754",
                color: "white",
              }}
            >
              {logout}
            </Typography>
          </Box>
        );
      },
    },
  ];
  return (
    <Box
      m="30px 0 0 0"
      p={2}
      border={1}
      borderColor="#F0F0F0"
      borderRadius={1}
      sx={{
        bgcolor: "white",
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
      }}
    >
      <DataGrid
        rows={clientData}
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

export default ClientTable;
