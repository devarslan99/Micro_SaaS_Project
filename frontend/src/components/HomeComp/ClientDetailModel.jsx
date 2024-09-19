// src/components/HomeComp/ClientDetailsModal.jsx

import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ClientDetailsModal = ({
  clientDetailsModalOpen,
  setClientDetailsModalOpen,
  clients,
  handleClientDetailsSave,
}) => {
  console.log("DetailModel Clients", clients);
  const navigate = useNavigate();

  // Initialize clientDetails with selectedName
  const [clientDetails, setClientDetails] = useState(
    clients.reduce((acc, client) => {
      acc[client.clientId] = {
        name: client.name,
        selectedName: "", // Initialize selectedName
      };
      return acc;
    }, {})
  );

  const [loading, setLoading] = useState(false);

  const handleInputChange = (clientId, event) => {
    setClientDetails((prevDetails) => ({
      ...prevDetails,
      [clientId]: {
        ...prevDetails[clientId],
        selectedName: event.target.value,
      },
    }));
  };

  const handleSave = () => {
    setLoading(true);
   

    // Transform clientDetails into the desired format
    const formattedDetails = Object.entries(clientDetails).map(
      ([clientId, details]) => ({
        clientId: parseInt(clientId, 10),
        name: details.name,
        selectedName: details.selectedName,
      })
    );

    handleClientDetailsSave(formattedDetails);

    setLoading(false);
    setClientDetailsModalOpen(false);
    // const token = localStorage.getItem("softwareToken");
    // if(token){
    //     navigate('/compaigns')
    // }
  };

  return (
    <Modal
      open={clientDetailsModalOpen}
      onClose={() => setClientDetailsModalOpen(false)}
      aria-labelledby="client-details-modal-title"
      aria-describedby="client-details-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box className="sm:w-1/2 w-4/5 bg-white sm:p-10 p-5 rounded-md shadow-md" >
        <Typography
          id="client-details-modal-title"
          variant=""
          className="mb-2 text-2xl font-semibold"
        >
          Enter Details for Selected Clients
        </Typography>
        {clients.map((client) => (
          <TextField
            key={client.clientId}
            fullWidth
            margin="normal"
            placeholder={`Name for ${client.name}`}
            value={clientDetails[client.clientId]?.selectedName || ""}
            onChange={(e) => handleInputChange(client.clientId, e)}
          />
        ))}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            className="w-1/4 bg-gradient-to-r from-[#FF4B2B] to-[#FF416C]"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClientDetailsModal;
