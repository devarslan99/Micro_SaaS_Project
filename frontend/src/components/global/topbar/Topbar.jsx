import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import {  useNavigate } from "react-router-dom";
import TemporaryDrawer from "../Drawer/Drawer";
import MyContext from "../../../hook/context";

const Topbar = ({ menuCollapse, pageTitle, onPageSelect }) => {
  const { name, email } = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  console.log(name, email);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("softwareToken");
    localStorage.removeItem("clientId");
    localStorage.removeItem("isClient");
    console.log("Token removed from localStorage.");

    // Redirect to the sign-in page
    navigate("/");
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container sx={{ pl: { xs: 2, lg: menuCollapse ? 14 : 36 } }}>
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
            className="sm:text-4xl text-3xl font-bold text-neutral-800 font-Poppins sm:order-1 order-2"
          >
            {pageTitle}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mb={{ sm: 0, xs: 3 }}
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
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" fontWeight="bold">
                  {name}
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
                    {name}
                  </Typography>
                  <Typography variant="caption">{email}</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleLogout(), handleClose();
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Signout
              </MenuItem>
              {/* </Link> */}
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
      <TemporaryDrawer
        isOpen={isDrawerOpen}
        toggleDrawer={setDrawerOpen}
        onPageSelect={onPageSelect}
      />
    </Grid>
  );
};

export default Topbar;
