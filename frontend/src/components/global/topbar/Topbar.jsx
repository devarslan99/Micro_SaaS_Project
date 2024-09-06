import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  List,
  Logout,
  NotificationsOutlined,
  Search,
} from "@mui/icons-material";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import TemporaryDrawer from "../Drawer/Drawer";
//   import NotificationModal from "./NotificationModal";
//   import ProfileModal from "./ProfileModal";

const Topbar = ({ menuCollapse, pageTitle, onPageSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  // const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  // const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container sx={{ pl: { xs: 0, lg: menuCollapse ? 14 : 36 } }}>
      <Grid item xs={12}>
        <Box
          display="flex"
          flexDirection={{ sm: "row", xs: "column" }}
          justifyContent="space-between"
          alignItems={{ sm: "center", xs: "" }}
          paddingY={1.2}
          pr={2}
        >
          <Typography
            variant=""
            className="sm:text-4xl text-3xl lg:pl-0 pl-3 font-bold text-neutral-800 font-Poppins sm:order-1 order-2"
          >
            {pageTitle}
          </Typography>
          {/* <Box
              display="flex"
              borderRadius={2}
              width={{ xs: "auto", sm: "400px" }}
              padding={0.5}
              mb={{ sm: 0, xs: 2 }}
              className="bg-gray-100"
            >
              <IconButton type="button">
                <Search
                  sx={{
                    color: "black",
                    fontSize: "28px",
                  }}
                />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: "20px" }}
                placeholder="Search..."
              />
            </Box> */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mb={{sm:0 , xs : 3}}
            justifyContent="space-between"
            order={{ sm: 2, xs: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <IconButton onClick={() => setIsNotificationModalOpen(true)}>
                <NotificationsOutlined
                  sx={{
                    color: "black",
                  }}
                />
              </IconButton>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" fontWeight="bold">
                  Dylan Hunter
                </Typography>
                <Typography variant="caption">Admin Profile</Typography>
              </Box>
              <Tooltip title="Profile">
                <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
                  <Avatar
                    className="border"
                    alt="Remy Sharp"
                    src="https://pixelwibes.com/template/my-task/html/dist/assets/images/lg/avatar3.jpg"
                    sx={{ width: 50, height: 50 }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => setIsProfileModalOpen(true)}>
                <Avatar
                  className="border"
                  alt="Remy Sharp"
                  src="https://pixelwibes.com/template/my-task/html/dist/assets/images/lg/avatar3.jpg"
                  sx={{ width: 50, height: 50 }}
                />{" "}
                <Box display="flex" flexDirection="column">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Dylan Hunter
                  </Typography>
                  <Typography variant="caption">
                    Dylan.hunter@gmail.com
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <Link to="/tasks">
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <List fontSize="small" />
                  </ListItemIcon>{" "}
                  My Task
                </MenuItem>
              </Link>
              <Divider />
              <Link to="/signin">
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Signout
                </MenuItem>
              </Link>
            </Menu>
            <IconButton
              sx={{
                display: { lg: "none", xs: "flex" },
              }}
              onClick={() => setDrawerOpen(!isDrawerOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Grid>
      <TemporaryDrawer isOpen={isDrawerOpen} toggleDrawer={setDrawerOpen} onPageSelect={onPageSelect}/>
        {/* <NotificationModal isOpen={isNotificationModalOpen} closeModal={() => setIsNotificationModalOpen(false)} />
        <ProfileModal isOpen={isProfileModalOpen} closeModal={() => setIsProfileModalOpen(false)} /> */}
    </Grid>
  );
};

export default Topbar;
