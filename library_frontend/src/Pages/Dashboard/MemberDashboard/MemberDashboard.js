import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../AdminDashboard/AdminDashboard.css";

import PieChartIcon from "@mui/icons-material/PieChart";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookIcon from "@mui/icons-material/Book";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { Outlet } from "react-router-dom";

/* Semantic UI Dropdown Styles Import */
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href =
  "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

function AdminDashboard() {
  const [active, setActive] = useState("managebook");
  const [sidebar, setSidebar] = useState(false);

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <div className="sidebar-toggler" onClick={() => setSidebar(!sidebar)}>
          <IconButton>
            {sidebar ? (
              <CloseIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} />
            ) : (
              <DoubleArrowIcon
                style={{ fontSize: 25, color: "rgb(234, 68, 74)" }}
              />
            )}
          </IconButton>
        </div>

        {/* Sidebar */}
        <div
          className={sidebar ? "dashboard-options active" : "dashboard-options"}
        >
          <div className="dashboard-logo">
            <LibraryBooksIcon style={{ fontSize: 50 }} />
            <p className="logo-name">Library Management</p>
          </div>

          <Link to="showtransaction">
            <p
              className={`dashboard-option ${
                active === "showtransaction" ? "clicked" : ""
              }`}
              onClick={() => setActive("showtransaction")}
            >
              <ReceiptIcon className="dashboard-option-icon" /> Tất cả phiên
              mượn
            </p>
          </Link>

          <Link to="reservedbook">
            <p
              className={`dashboard-option ${
                active === "reservedbook" ? "clicked" : ""
              }`}
              onClick={() => setActive("reservedbook")}
            >
              <BookIcon className="dashboard-option-icon" /> Đặt trước sách
            </p>
          </Link>

          <p className="dashboard-option" onClick={logout}>
            <PowerSettingsNewIcon className="dashboard-option-icon" /> Log out
          </p>
        </div>

        <div className="dashboard-option-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
