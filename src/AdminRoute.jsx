import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  // 🔴 NO TOKEN → SEND TO LOGIN
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // ✅ TOKEN EXISTS → ALLOW ACCESS
  return children;
}
