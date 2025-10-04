import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../../src/App.css";

const Login = ({ onSignupClick, onLoginSuccess, onForgotClick }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role!");
      return;
    }

    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email,
        password,
        role
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);

      alert(`Logged in successfully as ${role}`);
      
      if (onLoginSuccess) {
        onLoginSuccess(role);
      }

      // Redirect to dashboard based on role
      switch(role.toLowerCase()) {
        case "admin":
          navigate("/admin");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "employee":
          navigate("/employee");
          break;
        default:
          navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Welcome Back</h2>
      <p>Sign in to your {role || "account"}</p>

      <form onSubmit={handleLogin}>
        <label>Select Role</label>
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          required
        >
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
          minLength="6"
        />

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <span className="link" onClick={onForgotClick}>
            Forgot password?
          </span>
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="switch-text">
          Don't have an account?{" "}
          <span className="link" onClick={onSignupClick}>Sign up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;