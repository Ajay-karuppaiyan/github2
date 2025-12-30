import { useEffect, useState } from "react";
import AddAdmin from "./AddAdmin";
import EditUser from "./EditUser"; // reuse same EditUser component
import "./styles/ViewUsers.css";

export default function ViewAdmins({ setPage, setSelectedUser }) {
  const [admins, setAdmins] = useState([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = () => {
    fetch("http://localhost:8000/api/auth/getAll")
      .then((res) => res.json())
      .then((data) => {
        const onlyAdmins = data.filter(
          (u) => u.role?.toUpperCase() === "ADMIN" || u.role === "ROLE_ADMIN"
        );
        setAdmins(onlyAdmins);
      });
  };

  function editAdmin(admin) {
  setSelectedUser(admin);
  setPage("editAdmin");
  }


  function deleteAdmin(id) {
    if (!window.confirm("Delete this admin?")) return;

    fetch(`http://localhost:8000/api/auth/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        alert("Admin deleted successfully");
        fetchAdmins();
      })
      .catch(() => alert("Failed to delete admin"));
  }

  return (
    <div className="view-users">
      <div className="view-users-header">
        <h2>Admin List</h2>
        <button className="add-user-btn" onClick={() => setShowAddAdmin(true)}>
          + Add Admin
        </button>
      </div>

      {showAddAdmin && (
        <AddAdmin
          setShowAddAdmin={setShowAddAdmin}
          refreshAdmins={fetchAdmins}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Age</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {admins.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No admins found
              </td>
            </tr>
          )}

          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.mobile}</td>
              <td>{admin.age}</td>
              <td>{admin.role}</td>
              <td>
                <button onClick={() => editAdmin(admin)}>Edit</button>
                <button onClick={() => deleteAdmin(admin.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
