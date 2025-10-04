import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role!");
      return;
    }

    // Here you can add real authentication logic
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Redirect based on role
    switch (role) {
      case "Admin":
        navigate("/admin");
        break;
      case "Manager":
        navigate("/manager");
        break;
      case "Employee":
        navigate("/employee");
        break;
      default:
        alert("Invalid role selected");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <p>Sign in to your account</p>
      <form onSubmit={handleLogin}>
        <label>Select Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Choose your role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>

        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
