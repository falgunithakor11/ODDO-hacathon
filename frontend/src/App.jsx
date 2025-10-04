import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminView from "./components/AdminView";
import ManagerView from "./components/ManagerView";
import EmployeeView from "./components/EmployeeView";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const savedRole = localStorage.getItem("userRole");
      
      if (token && savedRole) {
        setUserRole(savedRole);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setUserRole(null);
  };

  // Role-based redirect component
  const RoleRedirect = () => {
    if (userRole === "Admin") return <Navigate to="/admin" replace />;
    if (userRole === "Manager") return <Navigate to="/manager" replace />;
    if (userRole === "Employee") return <Navigate to="/employee" replace />;
    return <Navigate to="/" replace />;
  };

  // Loading component
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              userRole ? (
                <RoleRedirect />
              ) : (
                <Login 
                  onSignupClick={() => window.location.href = "/signup"}
                  onLoginSuccess={handleLoginSuccess}
                  onForgotClick={() => window.location.href = "/forgot-password"}
                />
              )
            } 
          />

          <Route 
            path="/signup" 
            element={
              userRole ? (
                <RoleRedirect />
              ) : (
                <Signup onLoginClick={() => window.location.href = "/"} />
              )
            } 
          />

          {/* Role-based redirect after login */}
          <Route 
            path="/dashboard" 
            element={<RoleRedirect />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="Admin" currentRole={userRole}>
                <AdminView onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/manager" 
            element={
              <ProtectedRoute requiredRole="Manager" currentRole={userRole}>
                <ManagerView onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/employee" 
            element={
              <ProtectedRoute requiredRole="Employee" currentRole={userRole}>
                <EmployeeView onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;