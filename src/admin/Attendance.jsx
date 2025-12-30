import { useEffect, useState } from "react";
import "./Styles/Attendance.css";

const API_BASE = "http://localhost:8000/api/auth";

export default function Attendance() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState("date");
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // ================= FETCH ALL USERS ATTENDANCE =================
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/attendance`);

      if (!res.ok) {
        console.error("Failed to fetch attendance:", res.status);
        setUsers([]);
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ================= MARK ATTENDANCE =================
  const markAttendance = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/attendance/${userId}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to mark attendance");
        return;
      }

      alert(data.message);
      fetchAttendance(); // refresh list
    } catch (err) {
      console.error("Mark attendance failed", err);
    }
  };

  // ================= FILTER LOGIC =================
  const filteredUsers = users.map((user) => {
    let attendance = user.attendance || [];

    if (filterType === "date" && singleDate) {
      attendance = attendance.filter((d) => d === singleDate);
    }

    if (filterType === "period" && startDate && endDate) {
      attendance = attendance.filter((d) => d >= startDate && d <= endDate);
    }

    return { ...user, attendance };
  });

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading attendance...</p>;
  }

  // ================= UI =================
  return (
    <div className="attendance">
      <div className="attendance-header">
        <h2>Manage Attendance</h2>

        <div className="filter">
          <label>Filter:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="date">By Date</option>
            <option value="period">By Period</option>
          </select>

          {filterType === "date" && (
            <input
              type="date"
              value={singleDate}
              onChange={(e) => setSingleDate(e.target.value)}
            />
          )}

          {filterType === "period" && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="to-text">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}
        </div>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Attendance Dates</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}

          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.attendance.length > 0
                  ? user.attendance.join(", ")
                  : "No records"}
              </td>
              <td>
                <button
                  className="mark-btn"
                  disabled={user.attendance.includes(today)}
                  onClick={() => markAttendance(user.id)}
                >
                  {user.attendance.includes(today) ? "Marked" : "Mark Today"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}