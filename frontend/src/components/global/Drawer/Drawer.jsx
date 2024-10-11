import * as React from "react";
import Drawer from "@mui/material/Drawer";
import { Menu, MenuItem } from "react-pro-sidebar";
import { FaQrcode } from "react-icons/fa";
import { LuArrowBigLeftDash } from "react-icons/lu";
import { AiFillHome } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Box, IconButton, Typography, Snackbar, Alert } from "@mui/material";
import { ImStatsBars } from "react-icons/im";
import { RiMailSendLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePriceCheck } from "react-icons/md";

const TemporaryDrawer = ({ isOpen, toggleDrawer, onPageSelect }) => {
  const location = useLocation();
  const isClientLoggedIn = localStorage.getItem("isClient") === "true";
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const softwareToken = localStorage.getItem("softwareToken");

  const isMenuItemActive = (path) => {
    return location.pathname === path;
  };
  const getPageTitle = (path) => {
    switch (path) {
      case "/home":
        return "Select Software";
      case "/compaigns":
        return "Campaigns Analytics";
      case "/email_stats":
        return "Email Stats";
      case "/settings":
        return "Settings";
      case "/pricing":
        return "Plans";
      case "/success":
        return "Payment Success";
      default:
        return "Unknown Page";
    }
  };
  React.useEffect(() => {
    const currentPath = location.pathname;
    const title = getPageTitle(currentPath);
    onPageSelect(title);

    // Check for softwareToken
    if (!softwareToken) {
      setSnackbarMessage("Please import your Account"); // Set message
      setSnackbarOpen(true); // Open Snackbar
    }
  }, [location, onPageSelect, softwareToken]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false); // Close Snackbar
  };

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={isOpen}
            sx={{
              display: { lg: "none", xs: "block" },
              "& .ps-submenu-content": {
                backgroundColor: "#4C3575",
                fontSize: "16px",
              },
              "& .ps-submenu-content .ps-menu-button": {
                height: "30px",
                paddingLeft: "60px",
              },
            }}
            onClose={() => toggleDrawer(false)}
          >
            <Box
              role="presentation"
              className="bg-gradient-to-tr from-[#FF4B2B] to-[#FF416C]"
              //   bgcolor="#4C3575"
              sx={{
                width: "200px",
                height: "100%",
                color: "white",
                px: { xs: 1, sm: 0 },
                display: { lg: "none", xs: "block" },
              }}
              onKeyDown={() => toggleDrawer(false)}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={1}
                mt={5}
                mb={2}
              >
                <Box
                  className="logotext"
                  bgcolor="white"
                  borderRadius="50%"
                  p={1}
                >
                  <IconButton>
                    <FaQrcode fontSize="30px" className="text-red-500" />
                  </IconButton>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    SaaS
                  </Typography>
                </Box>
              </Box>
              <Menu className="text-lg h-[280px] overflow-y-auto">
                {isClientLoggedIn === false ? (
                  <Link to="/home">
                    <MenuItem
                      active={isMenuItemActive("/home")}
                      icon={<AiFillHome fontSize="22px" />}
                      onClick={() => toggleDrawer(false)}
                    >
                      Home
                    </MenuItem>
                  </Link>
                ) : (
                  <></>
                )}
                <Link to="/compaigns">
                  <MenuItem
                    active={isMenuItemActive("/compaigns")}
                    icon={<ImStatsBars fontSize="22px" />}
                    onClick={() => toggleDrawer(false)}
                  >
                    Campaigns Analytics
                  </MenuItem>
                </Link>
                <Link to="/email_stats">
                  <MenuItem
                    active={isMenuItemActive("/email_stats")}
                    icon={<RiMailSendLine fontSize="22px" />}
                    onClick={() => toggleDrawer(false)}
                  >
                    Email Stats
                  </MenuItem>
                </Link>
                {isClientLoggedIn === false ? (
                  <>
                    <Link to="/settings">
                      <MenuItem
                        active={isMenuItemActive("/settings")}
                        icon={<IoSettingsOutline fontSize="22px" />}
                        onClick={() => toggleDrawer(false)}
                      >
                        Settings
                      </MenuItem>
                    </Link>
                    <Link to="/pricing">
                      <MenuItem
                        active={isMenuItemActive("/pricing")}
                        icon={<MdOutlinePriceCheck fontSize="22px" />}
                        onClick={() => toggleDrawer(false)}
                      >
                        Plans
                      </MenuItem>
                    </Link>
                  </>
                ) : (
                  <></>
                )}
              </Menu>
              <Box
                className="closemenu"
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                marginTop={9}
                onClick={() => toggleDrawer(false)}
              >
                <LuArrowBigLeftDash fontSize="30px" />
              </Box>
            </Box>
          </Drawer>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Positioning
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="warning"
              sx={{ width: "100%" }}
            >
              {snackbarMessage} {/* Snackbar Message */}
            </Alert>
          </Snackbar>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TemporaryDrawer;
