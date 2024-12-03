import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext.js";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";

function Header() {
  const { user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuToggle, setMenuToggle] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuToggle = () => setMenuToggle(!menuToggle);

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#333" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            LIBRARY
          </Link>
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleMenuToggle}>
              {menuToggle ? <ClearIcon /> : <MenuIcon />}
            </IconButton>
            {menuToggle && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {!user ? (
                  <>
                    <MenuItem onClick={handleMenuClose}>
                      <Link
                        to="/signin"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        Sign In
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <Link
                        to="/signup"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        Sign Up
                      </Link>
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={handleMenuClose}>
                    {user.isAdmin ? (
                      <Link
                        to="/dashboard@admin"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard@member"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        Member Dashboard
                      </Link>
                    )}
                  </MenuItem>
                )}
              </Menu>
            )}
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            {!user ? (
              <>
                <Button color="inherit">
                  <Link
                    to="/signin"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Sign In
                  </Link>
                </Button>
                <Button color="inherit">
                  <Link
                    to="/signup"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Sign Up
                  </Link>
                </Button>
              </>
            ) : (
              <div>
                <Button color="inherit">
                  {user.isAdmin ? (
                    <Link
                      to="/dashboard@admin"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard@member"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      Member Dashboard
                    </Link>
                  )}
                </Button>
                <Button color="inherit" onClick={logout}>
                  Log out
                </Button>
              </div>
            )}
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
