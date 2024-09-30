import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";

const DeleteModal = ({ openModal, onCloseModal }) => {
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
        <Typography variant="" className="font-semibold text-lg font-Poppins">
          Are you sure you want to Delete
        </Typography>
        <Box className="flex gap-2 items-center w-full">
          <button
            onClick={onCloseModal}
            className="bg-transparent border-red-500 border py-1 text-lg rounded-md w-full"
          >
            cancel
          </button>
          <button
            type="submit"
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
