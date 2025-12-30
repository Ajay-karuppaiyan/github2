import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    // If login fails (backend returns plain text)
    if (!response.ok) {
      const text = await response.text();
      setError(text);
      setLoading(false);
      return;
    }

    // Success → backend returns JSON
    const data = await response.json();

    // SAVE USER IN LOCAL STORAGE
    localStorage.setItem("username", data.name);
    localStorage.setItem("email", data.email);
    localStorage.setItem("isLoggedIn", "true");

    alert(data.message);

    navigate("/dashboard");

  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  }

  setLoading(false);
}


  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />

          <button type="submit">Sign Up</button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
