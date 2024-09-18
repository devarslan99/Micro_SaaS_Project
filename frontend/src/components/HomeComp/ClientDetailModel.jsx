// src/components/HomeComp/ClientDetailsModal.jsx

import React, { useState } from "react";
import { Box, Modal, Typography, TextField, Button, CircularProgress } from "@mui/material";

const ClientDetailsModal = ({ 
    clientDetailsModalOpen, 
    setClientDetailsModalOpen, 
    clients, 
    handleClientDetailsSave
 }) => {

    console.log("DetailModel Clients", clients);

    // Initialize clientDetails with selectedName
    const [clientDetails, setClientDetails] = useState(
        clients.reduce((acc, client) => {
            acc[client.clientId] = { 
                name: client.name, 
                selectedName: "" // Initialize selectedName
            };
            return acc;
        }, {})
    );

    const [loading, setLoading] = useState(false);

    const handleInputChange = (clientId, event) => {
        setClientDetails(prevDetails => ({
            ...prevDetails,
            [clientId]: {
                ...prevDetails[clientId],
                selectedName: event.target.value,
            }
        }));
    };

    const handleSave = () => {
        setLoading(true);

        // Transform clientDetails into the desired format
        const formattedDetails = Object.entries(clientDetails).map(([clientId, details]) => ({
            clientId: parseInt(clientId, 10),
            name: details.name,
            selectedName: details.selectedName
        }));

        handleClientDetailsSave(formattedDetails);

        setLoading(false);
        setClientDetailsModalOpen(false);
    };

    return (
        <Modal
            open={clientDetailsModalOpen}
            onClose={() => setClientDetailsModalOpen(false)}
            aria-labelledby="client-details-modal-title"
            aria-describedby="client-details-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="client-details-modal-title" variant="h6" component="h2">
                    Enter Details for Selected Clients
                </Typography>
                {clients.map((client) => (
                    <TextField
                        key={client.clientId}
                        fullWidth
                        margin="normal"
                        label={`Details for ${client.name}`}
                        value={clientDetails[client.clientId]?.selectedName || ""}
                        onChange={(e) => handleInputChange(client.clientId, e)}
                    />
                ))}
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Save"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setClientDetailsModalOpen(false)}
                        sx={{ marginLeft: 1 }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ClientDetailsModal;
