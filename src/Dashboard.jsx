import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import "./dashboard.css";

const COLORS = ["#4f46e5", "#22c55e", "#ef4444"];
const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function Dashboard() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  // Logout function
  function logout() {
    localStorage.clear();
    navigate("/signin");
  }

  // Reset inactivity timer
  function resetTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, 30000); // 30s inactivity
  }

  // ---------------- Fetch Dashboard Data ----------------
  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard/stats")
      .then(res => res.json())
      .then(data => {
        setRoleData([
          { name: "Users", value: data.totalUsers },
          { name: "Admins", value: data.totalAdmins },
        ]);

        setAttendanceData([
          { name: "Present", value: data.attendanceToday },
          { name: "Absent", value: 100 - data.attendanceToday },
        ]);

        setWeeklyData(
          data.weeklyAttendance.map(item => ({
            day: days[item._id - 1],
            attendance: item.attendance,
          }))
        );
      })
      .catch(err => console.error(err));
  }, []);

  // ---------------- Auto logout ----------------
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/signin");
      return;
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, [navigate]);

  return (
    <div className="dashboard-root">

      {/* TOPBAR */}
      <header className="topbar">
        <span className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</span>
        <h2>Dashboard</h2>
      </header>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h3>Menu</h3>
        <ul>
          <li>Dashboard</li>
          <li>Profile</li>
          <li>Settings</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <h1>Welcome {name} 👋</h1>
        <p>Role: {role}</p>

        {/* CARDS */}
        <div className="cards">
          <div className="card">Users: {roleData[0]?.value || 0}</div>
          <div className="card">Admins: {roleData[1]?.value || 0}</div>
          <div className="card">Attendance Today: {attendanceData[0]?.value || 0}%</div>
        </div>

        {/* CHARTS */}
        <div className="charts">
          {/* Users vs Admins */}
          <div className="chart-box">
            <h4>Users vs Admins</h4>
            <PieChart width={250} height={250}>
              <Pie data={roleData} dataKey="value" outerRadius={90}>
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Attendance */}
          <div className="chart-box">
            <h4>Attendance Today</h4>
            <PieChart width={250} height={250}>
              <Pie data={attendanceData} dataKey="value" innerRadius={60} outerRadius={90}>
                {attendanceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Weekly Attendance */}
          <div className="chart-box wide">
            <h4>Weekly Attendance</h4>
            <LineChart width={600} height={300} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#4f46e5" />
            </LineChart>
          </div>
        </div>
      </main>
    </div>
  );
}
