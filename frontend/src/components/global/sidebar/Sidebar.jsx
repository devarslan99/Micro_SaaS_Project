import { useLocation } from "react-router-dom";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { FaQrcode } from "react-icons/fa";
import { LuArrowBigRightDash, LuArrowBigLeftDash } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { Box, IconButton, Typography, Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert
import { Link } from "react-router-dom";
import "./sidebar.css";
import { ImStatsBars } from "react-icons/im";
import { RiMailSendLine } from "react-icons/ri";
import {  useEffect, useState } from "react"; // Import useState
import { MdOutlinePriceCheck } from "react-icons/md";

const Sidebar = ({ menuCollapse, setMenuCollapse, onPageSelect }) => {
  const location = useLocation();
  const isClientLoggedIn = localStorage.getItem("isClient") === "true";
  console.log(isClientLoggedIn);

  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message

  const menuIconClick = () => {
    setMenuCollapse((prevMenuCollapse) => !prevMenuCollapse);
  };

  const softwareToken = localStorage.getItem('softwareToken');

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

  useEffect(() => {
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

  const isMenuItemActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <Box
        id="header"
        sx={{
          "& .ps-sidebar-container .ps-submenu-content": {
            fontSize: "16px",
            zIndex: "9999 !important",
            backgroundColor: "#FF4747",
          },
          "& .ps-sidebar-container .ps-submenu-content .ps-menu-button": {
            height: "30px",
            paddingLeft: "60px",
          },
        }}
        position="fixed"
      >
        <ProSidebar
          className="bg-gradient-to-tr from-[#FF4B2B] to-[#FF416C] text-white h-screen"
          collapsed={menuCollapse}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
            mt={5}
            mb={2}
          >
            <Box className="logotext" bgcolor="white" borderRadius="50%" p={1}>
              <IconButton>
                <FaQrcode fontSize="30px" className="text-red-500" />
              </IconButton>
            </Box>
            <Box display={menuCollapse ? "none" : "block"}>
              <Typography variant="h5" fontWeight="bold">
                SaaS
              </Typography>
            </Box>
          </Box>
          <Menu className="text-lg h-[320px] overflow-y-auto">
            {isClientLoggedIn === false ? (
              <Link to="/home">
                <MenuItem
                  active={isMenuItemActive("/home")}
                  icon={<AiFillHome fontSize="22px" />}
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
              >
                Campaigns Analytics
              </MenuItem>
            </Link>
            <Link to="/email_stats">
              <MenuItem
                active={isMenuItemActive("/email_stats")}
                icon={<RiMailSendLine fontSize="22px" />}
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
                  >
                    Settings
                  </MenuItem>
                </Link>
                <Link to="/pricing">
                  <MenuItem
                    active={isMenuItemActive("/pricing")}
                    icon={<MdOutlinePriceCheck fontSize="22px" />}
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
            onClick={menuIconClick}
          >
            {menuCollapse ? (
              <LuArrowBigRightDash fontSize="30px" />
            ) : (
              <LuArrowBigLeftDash fontSize="30px" />
            )}
          </Box>
        </ProSidebar>

        {/* Snackbar Component */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Positioning
        >
          <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: "100%" }}>
            {snackbarMessage} {/* Snackbar Message */}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Sidebar;
