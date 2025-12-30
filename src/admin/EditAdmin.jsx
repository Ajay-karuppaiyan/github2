import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/AdminPanel.css";

export default function EditAdmin() {
  const { id } = useParams(); // admin id from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch admin data by ID
  useEffect(() => {
    fetch(`http://localhost:8000/api/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load admin");
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "ADMIN",
        });
      })
      .catch(() => setError("Unable to load admin details"));
  }, [id, token]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Update admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:8000/api/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      alert("Admin updated successfully");
      navigate("/admin"); // back to admin panel
    } catch (err) {
      setError(err.message || "Update failed");
    }

    setLoading(false);
  };

  return (
    <div className="content">
      <h2>Edit Admin</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Admin"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
