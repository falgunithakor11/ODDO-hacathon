import React, { useState } from "react";
import AdminView from "./AdminView";
import { useNavigate } from "react-router";

const Login = ({ onSignupClick, onLoginSuccess, onForgotClick }) => {
  const navigate = useNavigate(); // ✅ Add this
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
  e.preventDefault();

  if (!role) {
    alert("Please select a role!");
    return;
  }

  // Simulate login success
  alert(`Logged in successfully as ${role}`);
  onLoginSuccess(role);

  // Redirect to dashboard for role-based navigation
  navigate("/dashboard");
};


  return (
    <div className="form-container">
      <h2>Welcome Back</h2>
      <p>Sign in to your {role || "admin"} account</p>

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
          placeholder="admin@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <span className="link" onClick={onForgotClick}>
            Forgot password?
          </span>
        </div>

        <button type="submit" className="btn" >Sign In</button>

        <p className="switch-text">
          Don’t have an account?{" "}
          <span onClick={onSignupClick}>Sign up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
