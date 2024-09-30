import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import ChangePasswordModal from "../../components/SettingsComp/ChangePasswordModal";
import DeleteModal from "../../components/SettingsComp/DeleteModal";
import EditModal from "../../components/SettingsComp/EditModal";
import CredentialsModal from "../../components/SettingsComp/CredentialsModal";

const Settings = ({ menuCollapse }) => {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCredentialsModal, setOpenCredentialsModal] = useState(false);
  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleCloseCredentialsModal = () => {
    setOpenCredentialsModal(false);
  };
  return (
    <Grid
      container
      spacing={3}
      pr={3}
      mb={10}
      sx={{ pl: { xs: 3, lg: menuCollapse ? 14 : 36 } }}
    >
      <Grid item xs={12}>
        <Box className="flex justify-end my-8">
          <Button
            variant="contained"
            onClick={() => setOpenPasswordModal(true)}
            className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white"
          >
            Change Password
          </Button>
        </Box>
      </Grid>
      <Grid item md={4} xs={12}>
        <Box className="p-8 rounded-md shadow-lg flex flex-col gap-4 items-center">
          <Box className="flex gap-2 justify-end w-full">
            <Box
              onClick={() => setOpenEditModal(true)}
              className="bg-gradient-to-r cursor-pointer rounded-md from-[#FF4B2B] to-[#FF416C] text-white p-2"
            >
              <FaRegEdit size={18} />
            </Box>
            <Box
              onClick={() => setOpenDeleteModal(true)}
              className="bg-gradient-to-r cursor-pointer rounded-md from-[#FF4B2B] to-[#FF416C] text-white p-2"
            >
              <RiDeleteBin6Line size={18} />
            </Box>
          </Box>
          <Avatar sx={{ width: 76, height: 76 }} />
          <Typography variant="" className="text-2xl font-bold font-Poppins">
            David
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenCredentialsModal(true)}
            className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white font-Poppins"
          >
            Create Credentials
          </Button>
        </Box>
      </Grid>
      <Grid item md={4} xs={12}>
        <Box className="p-8 rounded-md shadow-lg flex flex-col gap-4 items-center">
          <Box className="flex gap-2 justify-end w-full">
            <Box
              onClick={() => setOpenEditModal(true)}
              className="bg-gradient-to-r cursor-pointer rounded-md from-[#FF4B2B] to-[#FF416C] text-white p-2"
            >
              <FaRegEdit size={18} />
            </Box>
            <Box
              onClick={() => setOpenDeleteModal(true)}
              className="bg-gradient-to-r cursor-pointer rounded-md from-[#FF4B2B] to-[#FF416C] text-white p-2"
            >
              <RiDeleteBin6Line size={18} />
            </Box>
          </Box>
          <Avatar sx={{ width: 76, height: 76 }} />
          <Typography variant="" className="text-2xl font-bold font-Poppins">
            David
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenCredentialsModal(true)}
            className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white font-Poppins"
          >
            Create Credentials
          </Button>
        </Box>
      </Grid>
      <Grid item md={4} xs={12}>
        <Box className="p-8 rounded-md shadow-lg flex flex-col gap-4 items-center">
          <Box className="flex gap-2 justify-end w-full">
            <Box
              onClick={() => setOpenEditModal(true)}
              className="bg-gradient-to-r cursor-pointer rounded-md from-[#FF4B2B] to-[#FF416C] text-white p-2"
            >
              <FaRegEdit size={18} />
            </Box>
            <Box
              onClick={() => setOpenDeleteModal(true)}
              className="bg-gradient-to-r cursor-pointer rounded-md from-[#FF4B2B] to-[#FF416C] text-white p-2"
            >
              <RiDeleteBin6Line size={18} />
            </Box>
          </Box>
          <Avatar sx={{ width: 76, height: 76 }} />
          <Typography variant="" className="text-2xl font-bold font-Poppins">
            David
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenCredentialsModal(true)}
            className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white font-Poppins"
          >
            Create Credentials
          </Button>
        </Box>
      </Grid>
      <Grid item md={4} xs={12}>
        <Box className="p-8 rounded-md shadow-lg flex flex-col gap-4 items-center">
          <Box className="flex gap-2 justify-end w-full">
            <Box
              onClick={() => setOpenEditModal(true)}
              className="bg-gradient-to-r cursor-pointer rounded-md from-[#FF4B2B] to-[#FF416C] text-white p-2"
            >
              <FaRegEdit size={18} />
            </Box>
            <Box
              onClick={() => setOpenDeleteModal(true)}
              className="bg-gradient-to-r cursor-pointer rounded-md from-[#FF4B2B] to-[#FF416C] text-white p-2"
            >
              <RiDeleteBin6Line size={18} />
            </Box>
          </Box>
          <Avatar sx={{ width: 76, height: 76 }} />
          <Typography variant="" className="text-2xl font-bold font-Poppins">
            David
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenCredentialsModal(true)}
            className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white font-Poppins"
          >
            Create Credentials
          </Button>
        </Box>
      </Grid>
      <ChangePasswordModal
        openModal={openPasswordModal}
        onCloseModal={handleClosePasswordModal}
      />
      <DeleteModal
        openModal={openDeleteModal}
        onCloseModal={handleCloseDeleteModal}
      />
      <EditModal
        openModal={openEditModal}
        onCloseModal={handleCloseEditModal}
      />
      <CredentialsModal
        openModal={openCredentialsModal}
        onCloseModal={handleCloseCredentialsModal}
      />
    </Grid>
  );
};

export default Settings;
