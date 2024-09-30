import { Box, Modal, Stack } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

const EditModal = ({ openModal, onCloseModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
                type="name"
                className={`border border-neutral-400 p-2 focus:border-red-400 focus:outline-none mt-2 rounded-md w-full ${
                  errors.new_name ? "border-red-400" : ""
                }`}
                placeholder="Enter new name..."
                {...register("new_name", {
                  required: "name is required",
                //   minLength: {
                //     value: 6,
                //     message: "name must be at least 6 characters",
                //   },
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
                cancel
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
