import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useNavigate } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminView from "./components/AdminView";
import ManagerView from "./components/ManagerView";
import EmployeeView from "./components/EmployeeView";

function App() {
  const [userRole, setUserRole] = useState(null);

  // Role-based redirect component
  const RoleRedirect = () => {
    if (userRole === "Admin") return <Navigate to="/admin" />;
    if (userRole === "Manager") return <Navigate to="/manager" />;
    if (userRole === "Employee") return <Navigate to="/employee" />;
    return <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={
            <Login
              onSignupClick={() => window.location.href = "/signup"}
              onLoginSuccess={(role) => setUserRole(role)}
            />
          }
        />

        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />

        {/* Role-based redirect after login */}
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* Role-specific views */}
        <Route path="/admin" element={<AdminView />} />
        <Route path="/manager" element={<ManagerView />} />
        <Route path="/employee" element={<EmployeeView />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
