import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ViewUsers from "./ViewUsers";
import ViewAdmins from "./ViewAdmins";
import EditUser from "./EditUser";
import "./styles/AdminPanel.css";

export default function AdminPanel() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState("welcome");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openMenu, setOpenMenu] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    attendanceToday: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/getAll");
      const data = await res.json();

      const users = data.filter(
        u => u.role === "USER" || u.role === "ROLE_USER"
      );
      const admins = data.filter(
        u => u.role === "ADMIN" || u.role === "ROLE_ADMIN"
      );

      const today = new Date().toISOString().split("T")[0];
      const presentToday = users.filter(
        u => u.attendance?.includes(today)
      ).length;

      const attendancePercentage = users.length
        ? Math.round((presentToday / users.length) * 100)
        : 0;

      setStats({
        totalUsers: users.length,
        totalAdmins: admins.length,
        attendanceToday: attendancePercentage,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [page]);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <div className="admin-panel">
      {/* ================= TOPBAR ================= */}
      <div className="topbar">
        <span className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </span>
        <h3>Admin Panel</h3>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/signin";
          }}
        >
          Logout
        </button>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="admin-title">ADMIN</h2>
        <ul className="menu">

          {/* USERS */}
          <li onClick={() => toggleMenu("users")}>👤 Users</li>
          {openMenu === "users" && (
            <ul className="sub-menu">
              <li
                onClick={() => {
                  setPage("viewUsers");
                  setSidebarOpen(false);
                }}
              >
                View Users
              </li>
              <li
                onClick={() => {
                  navigate("/admin/attendance"); // ✅ REAL NAVIGATION
                  setSidebarOpen(false);
                }}
              >
                Attendance
              </li>
            </ul>
          )}

          {/* ADMINS */}
          <li onClick={() => toggleMenu("admins")}>🛡️ Admins</li>
          {openMenu === "admins" && (
            <ul className="sub-menu">
              <li
                onClick={() => {
                  setPage("viewAdmins");
                  setSidebarOpen(false);
                }}
              >
                View Admins
              </li>
            </ul>
          )}
        </ul>
      </div>

      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ================= CONTENT ================= */}
      <div className={`content ${sidebarOpen ? "shifted" : ""}`}>
        {page === "welcome" && (
          <div className="welcome-cards">
            <h2>Welcome, Admin!</h2>
            <div className="cards">
              <div className="card">Total Users: {stats.totalUsers}</div>
              <div className="card">Total Admins: {stats.totalAdmins}</div>
              <div className="card">
                Attendance Today: {stats.attendanceToday}%
              </div>
            </div>
          </div>
        )}

        {page === "viewUsers" && (
          <ViewUsers
            setPage={setPage}
            setSelectedUser={setSelectedUser}
          />
        )}

        {page === "viewAdmins" && (
          <ViewAdmins
            setPage={setPage}
            setSelectedUser={setSelectedUser}
          />
        )}

        {page === "editUser" && selectedUser && (
          <EditUser
            user={selectedUser}
            setPage={setPage}
            refreshList={fetchStats}
          />
        )}

        {page === "editAdmin" && selectedUser && (
          <EditUser
            user={selectedUser}
            setPage={setPage}
            refreshList={fetchStats}
          />
        )}
      </div>
    </div>
  );
}
