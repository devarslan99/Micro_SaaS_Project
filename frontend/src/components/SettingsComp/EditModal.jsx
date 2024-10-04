import { Box, Modal, Stack } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../../config";

const EditModal = ({ openModal, onCloseModal, clientId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log("id: " , clientId)

  const token = localStorage.getItem("authToken");
  const softwareToken = localStorage.getItem("softwareToken");

  const onSubmit = async (data) => {
    try {
      // Make an API request to update the client name
      const response = await axios.post(
        `${BASE_URL}/client/update`, // Replace with the actual endpoint
        {
          clientId: clientId, // Sending clientId in the request body
          newSelectedName: data.new_name, // The new name from the form
        },
        {
          headers: {
            Authorization: token,
            SoftwareAuthorization: softwareToken,
          },
        }
      );

      console.log("Client updated successfully:", response.data);
      onCloseModal(); // Close the modal after successful update
    } catch (error) {
      console.error(
        "Error updating client:",
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
      <Box className="p-8 bg-white rounded-md font-Poppins sm:w-auto w-11/12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <div>
              <label htmlFor="new_name" className="text-xl font-semibold mb-2">
                New Name
              </label>
              <input
                id="new_name"
                type="text"
                className={`border border-neutral-400 p-2 focus:border-red-400 focus:outline-none mt-2 rounded-md w-full ${
                  errors.new_name ? "border-red-400" : ""
                }`}
                placeholder="Enter new name..."
                {...register("new_name", {
                  required: "Name is required",
                })}
              />
              {errors.new_name && (
                <span className="text-red-500 text-sm">
                  {errors.new_name.message}
                </span>
              )}
            </div>
            <Box className="flex gap-2 items-center w-full">
              <button
                onClick={onCloseModal}
                className="bg-transparent border-red-500 border py-1 text-lg rounded-md w-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] border-red-500 border text-white text-lg py-1 rounded-md w-full"
              >
                Confirm
              </button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default EditModal;
