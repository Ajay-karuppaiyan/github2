import { useState } from "react";
import "./Styles/AddUser.css";

export default function AddUser({ setShowAddUser, refreshUsers }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    age: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "USER" }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || "Failed to add user");
        setLoading(false);
        return;
      }

      alert("User added successfully!");
      setShowAddUser(false); // ✅ CLOSE MODAL
      refreshUsers();

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add User</h3>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} />
          <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </button>

            {/* ✅ FIXED CANCEL BUTTON */}
            <button type="button" onClick={() => setShowAddUser(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
