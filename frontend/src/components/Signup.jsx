import React, { useState } from "react";
import { authService } from "../services/authService";

const Signup = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: ""
  });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle role change
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData((prev) => ({ ...prev, role: selectedRole }));

    // Only Admin can sign up
    if (selectedRole === "Manager" || selectedRole === "Employee") {
      alert(`${selectedRole}s cannot sign up directly. Please contact your administrator.`);
    }
  };

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validations
    if (formData.role !== "Admin") {
      alert("Only Admin can sign up for new accounts.");
      return;
    }

    if (!agree) {
      alert("You must agree to the Terms and Privacy Policy.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      // ✅ FIX: Added confirmPassword field
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // ✅ Important
        role: formData.role,
        country: formData.country,
      };

      const response = await authService.adminSignup(signupData);

      // Store token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", formData.role);
      localStorage.setItem("userEmail", formData.email);

      alert(`Admin account created successfully for ${formData.name}`);
      window.location.href = "/admin"; // Redirect to dashboard
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      <p>Join our admin portal</p>

      <form onSubmit={handleSignup}>
        {/* Role */}
        <label>Select Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleRoleChange}
          required
        >
          <option value="">Choose your role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>

        {/* Full Name */}
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        {/* Email */}
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        {/* Password */}
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength="6"
        />

        {/* Confirm Password */}
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          minLength="6"
        />

        {/* Country */}
        <label>Select Country</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
        >
          <option value="">Choose your country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>

        {/* Terms Checkbox */}
        <label className="checkbox">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          I agree to the <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn"
          disabled={loading || formData.role !== "Admin"}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Switch to Login */}
        <p className="switch-text">
          Already have an account?{" "}
          <span className="link" onClick={onLoginClick}>
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
