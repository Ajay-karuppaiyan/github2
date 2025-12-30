import { useState, useEffect } from "react";
import "./styles/AddUser.css";
import "./styles/EditUser.css";

export default function EditUser({ user, setPage, refreshList }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    age: "",
    role: "USER",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        mobile: user.mobile ?? "",
        age: user.age ?? "",
        role: user.role ?? "USER",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const goBack = () => {
    if (form.role === "ADMIN") {
      setPage("viewAdmins");
    } else {
      setPage("viewUsers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8000/api/auth/update/${user.id}`, // ✅ FIXED
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        setError(text || "Update failed");
        return;
      }

      alert(`${form.role} updated successfully`);
      if (refreshList) refreshList();
      goBack();

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="add-user-modal">
      <div className="add-user-card">
        <h2>Edit {form.role}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          {error && <p className="error">{error}</p>}

          <div className="add-user-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={goBack}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
