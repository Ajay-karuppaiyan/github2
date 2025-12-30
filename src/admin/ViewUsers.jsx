import { useEffect, useState } from "react";
import AddUser from "./AddUser"; // Full screen modal
import "./styles/ViewUsers.css";

export default function ViewUsers({ setPage, setSelectedUser }) {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:8000/api/auth/getAll")
      .then((res) => res.json())
      .then((data) => {
        const onlyUsers = data.filter((u) => {
          const role = u.role?.toUpperCase();
          return role === "USER" || role === "ROLE_USER";
        });
        setUsers(onlyUsers);
      });
  };

  function editUser(user) {
    setSelectedUser(user);
    setPage("editUser");
  }

  function deleteUser(id) {
  if (!window.confirm("Delete this user?")) return;

  fetch(`http://localhost:8000/api/auth/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Delete failed");
      return res.text();
    })
    .then(() => {
      alert("User deleted successfully");
      fetchUsers(); // ✅ reload from DB
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to delete user");
    });
}


  return (
    <div className="view-users">
      <div className="view-users-header">
        <h2>User List</h2>
        <button className="add-user-btn" onClick={() => setShowAddUser(true)}>
          + Add User
        </button>
      </div>

      {/* Full-screen Add User modal */}
      {showAddUser && (
        <AddUser
          setShowAddUser={setShowAddUser}
          refreshUsers={fetchUsers}
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
          {users.length === 0 && (
            <tr key="no-users">
              <td colSpan="6" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}

          {users.map((user, index) => (
            <tr key={user._id || index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.age}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => editUser(user)}>Edit</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
