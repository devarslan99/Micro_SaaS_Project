import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../config";

const DeleteModal = ({ openModal, onCloseModal, clientId }) => {
  const token = localStorage.getItem("authToken");
  const softwareToken = localStorage.getItem("softwareToken");

  const handleDelete = async () => {
    try {
      // Make a DELETE request to delete the client by clientId
      const response = await axios.post(
        `${BASE_URL}/client/delete`,
        {
          clientId: clientId, // Sending clientId in the request body
        },
        {
          headers: {
            Authorization: token,
            SoftwareAuthorization: softwareToken,
          },
        }
      ); // Replace with the actual endpoint

      console.log("Client deleted successfully:", response.data);
      onCloseModal(); // Close modal after successful deletion
    } catch (error) {
      console.error(
        "Error deleting client:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Modal
      open={openModal}
      onClose={onCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box className="p-10 bg-white rounded-md font-Poppins flex flex-col gap-4 items-center sm:w-auto w-11/12">
        <FaRegQuestionCircle size={55} className="text-red-500" />
        <Typography variant="h6" className="font-semibold text-lg font-Poppins">
          Are you sure you want to delete this client?
        </Typography>
        <Box className="flex gap-2 items-center w-full">
          <button
            onClick={onCloseModal}
            className="bg-transparent border-red-500 border py-1 text-lg rounded-md w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete} // Trigger the delete action
            className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] border-red-500 border text-white text-lg py-1 rounded-md w-full"
          >
            Confirm
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
