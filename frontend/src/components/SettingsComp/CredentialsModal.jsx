import { Box, Modal, Stack } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../config";
import axios from "axios";

const CredentialsModal = ({ openModal, onCloseModal, clientId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = localStorage.getItem("authToken");
  const softwareToken = localStorage.getItem("softwareToken");

  const onSubmit =async (data) => {
    console.log(data);
    try {
      // Make an API request to update the client name
      const response = await axios.post(
        `${BASE_URL}/client/credentials`, // Replace with the actual endpoint
        {
          clientId: clientId, // Sending clientId in the request body
          email: data.username, // The new name from the form
          password: data.password, // The new name from the form
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
      <Box className="p-10 bg-white rounded-md font-Poppins sm:w-auto w-11/12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack mt={4} spacing={4}>
            <div>
              <label htmlFor="username" className="text-xl font-semibold mb-2">
                User Name
              </label>
              <input
                id="username"
                type="username"
                className={`border border-neutral-400 p-2 focus:border-red-400 focus:outline-none mt-2 rounded-md w-full ${
                  errors.username ? "border-red-400" : ""
                }`}
                placeholder="Enter username..."
                {...register("username", {
                  required: "username is required",
                  //   minLength: {
                  //     value: 6,
                  //     message: "username must be at least 6 characters",
                  //   },
                })}
              />
              {errors.username && (
                <span className="text-red-500 text-sm">
                  {errors.username.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="repeatusername"
                className="text-xl font-semibold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`border border-neutral-400 p-2 focus:border-red-400 focus:outline-none mt-2 rounded-md w-full ${
                  errors.password ? "border-red-400" : ""
                }`}
                placeholder="Enter password..."
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            <Box className="flex gap-2 items-center">
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
                Save
              </button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default CredentialsModal;
