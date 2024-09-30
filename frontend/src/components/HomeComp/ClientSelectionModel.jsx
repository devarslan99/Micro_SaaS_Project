import React from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  FormControlLabel,
} from "@mui/material";
import CustomCheckBtn from "../EmailStatComp/CustomCheckBtn";

const ClientSelectionModal = ({
  clientModalOpen,
  setClientModalOpen,
  clients,
  selectedClients,
  handleClientSelection,
  handleNext,
}) => {
  return (
    <Modal
      open={clientModalOpen}
      onClose={() => setClientModalOpen(false)}
      aria-labelledby="client-selection-modal-title"
      aria-describedby="client-selection-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        className="sm:w-1/2 w-4/5 bg-white sm:p-10 p-5 rounded-md shadow-md"
      >
        <Typography
          id="client-selection-modal-title"
          variant=""
          className="mb-2 text-3xl font-semibold"
        >
          Select Clients
        </Typography>
        {clients.length === 0 ? (
          <Typography>No clients available</Typography>
        ) : (
          <Box className="flex flex-col ml-3 mt-4">
            {clients.map((client) => (
              <Box className="flex">
                <FormControlLabel
                  key={client.clientId}
                  control={
                    <CustomCheckBtn
                      checked={selectedClients.some(
                        (selected) => selected.clientId === client.clientId
                      )}
                      onChange={() =>
                        handleClientSelection(client.clientId, client.name)
                      }
                    />
                  }
                />
                <Typography className="pt-4">{client.name}</Typography>
              </Box>
            ))}
          </Box>
        )}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            className="w-1/4 bg-gradient-to-r from-[#FF4B2B] to-[#FF416C]"
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClientSelectionModal;
