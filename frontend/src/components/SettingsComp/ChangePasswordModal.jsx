import { Box, Modal, Stack } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

const ChangePasswordModal = ({ openModal, onCloseModal }) => {
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
      <Box className="p-10 bg-white rounded-md font-Poppins sm:w-auto w-11/12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack mt={4} spacing={4}>
            <div>
              <label
                htmlFor="new_password"
                className="text-xl font-semibold mb-2"
              >
                New Password
              </label>
              <input
                id="new_password"
                type="password"
                className={`border border-neutral-400 p-2 focus:border-red-400 focus:outline-none mt-2 rounded-md w-full ${
                  errors.new_password ? "border-red-400" : ""
                }`}
                placeholder="Enter your new password..."
                {...register("new_password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.new_password && (
                <span className="text-red-500 text-sm">
                  {errors.new_password.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="repeatpassword"
                className="text-xl font-semibold mb-2"
              >
                Repeat New Password
              </label>
              <input
                id="repeatpassword"
                type="password"
                className={`border border-neutral-400 p-2 focus:border-red-400 focus:outline-none mt-2 rounded-md w-full ${
                  errors.repeatpassword ? "border-red-400" : ""
                }`}
                placeholder="Repeat your new password..."
                {...register("repeatpassword", {
                  required: "Repeat Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.repeatpassword && (
                <span className="text-red-500 text-sm">
                  {errors.repeatpassword.message}
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

export default ChangePasswordModal;
