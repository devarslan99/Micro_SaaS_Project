import React from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const ClientSelectionModal = ({
    clientModalOpen,
    setClientModalOpen,
    clients,
    selectedClients,
    handleClientSelection,
    handleNext

 }) => {
  return (
    <Modal
        open={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        aria-labelledby="client-selection-modal-title"
        aria-describedby="client-selection-modal-description"
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
          <Typography
            id="client-selection-modal-title"
            variant="h6"
            component="h2"
            mb={2}
          >
            Select Clients
          </Typography>
          {clients.length === 0 ? (
            <Typography>No clients available</Typography>
          ) : (
            <Box>
              {clients.map((client) => (
                <FormControlLabel
                  key={client.clientId}
                  control={
                    <Checkbox
                      checked={selectedClients.some((selected) => selected.clientId === client.clientId)}
                      onChange={() => handleClientSelection(client.clientId, client.name)}
                    />
                  }
                  label={client.name}
                />
              ))}
            </Box>
          )}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{ marginRight: 1 }}
            >
              Next
            </Button>
            <Button variant="outlined" onClick={() => setClientModalOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

  );
};

export default ClientSelectionModal;
