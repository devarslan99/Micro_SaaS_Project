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
// import { clientData } from "../../data/mockData";

const ClientTable = ({ showOpenCount, showClickCount, showDailyLevel, data }) => {
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 190,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <Avatar src={row.avatar} alt={row.name} />
          <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
            {row.name}
          </span>
        </Box>
      ),
    },
    ...(!showDailyLevel ? 
       [
        {
          field: "date",
          headerName: "Date",
          width: 150,
        },
        ]
      : []),

    {
      field: "sent_count",
      headerName: "Sent Count",
      width: 150,
    },
    {
      field: "unique_sent_count",
      headerName: "Unique Sent Count",
      width: 150,
    },
    ...(showOpenCount
      ? [
          {
            field: "open_count",
            headerName: "Open Count",
            width: 150,
          },
        
        ]
      : []),
      {
        field: "unique_open_count",
        headerName: "Unique Open Count",
        width: 150,
      },
    ...(showClickCount
      ? [
          {
            field: "click_count",
            headerName: "Click Count",
            width: 150,
          },
         
        ]
      : []),
      {
        field: "unique_click_count",
        headerName: "Unique Click Count",
        width: 150,
      },
    {
      field: "reply_count",
      headerName: "Reply Count",
      width: 150,
    },
    {
      field: "bounce_count",
      headerName: "Bounce Count",
      width: 150,
    },
    ...(showDailyLevel ? 
      [
        {
          field: "total",
          headerName: "Total",
          width: 150,
        },
        {
          field: "inprogress",
          headerName: "InProgress",
          width: 150,
        },
        {
          field: "notStarted",
          headerName: "Not started",
          width: 150,
        },
        {
          field: "interested",
          headerName: "Interested",
          width: 150,
        },
      ] : [])

  ];
  return (
    <Box
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
        rows={data}
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
