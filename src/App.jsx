import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./Signup";
import Signin from "./Signin";
import Dashboard from "./Dashboard";

import AdminPanel from "./admin/AdminPanel";
import Attendance from "./admin/Attendance";
import AddUser from "./admin/AddUser";
import AddAdmin from "./admin/AddAdmin";
import EditUser from "./admin/EditUser";
import EditAdmin from "./admin/EditAdmin";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/signin" />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        {/* ✅ REAL ATTENDANCE PAGE */}
        <Route
          path="/admin/attendance"
          element={
            <AdminRoute>
              <Attendance />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-user"
          element={
            <AdminRoute>
              <AddUser />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-admin"
          element={
            <AdminRoute>
              <AddAdmin />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-user/:id"
          element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-admin/:id"
          element={
            <AdminRoute>
              <EditAdmin />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
