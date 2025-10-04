import React, { useState } from "react";

const Signup = ({ onLoginClick }) => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [agree, setAgree] = useState(false);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    // 🔹 Only Admin can sign up
    if (selectedRole === "Manager" || selectedRole === "Employee") {
      alert(`${selectedRole}s cannot sign up. Redirecting to Sign In page.`);
      onLoginClick(); // redirect to login
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!agree) {
      alert("You must agree to the Terms and Privacy Policy.");
      return;
    }

    if (role !== "Admin") {
      alert("Only Admin can sign up.");
      return;
    }

    alert(`Admin account created successfully for ${name}`);
    onLoginClick();
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      <p>Join our admin portal</p>

      <form onSubmit={handleSignup}>
        <label>Select Role</label>
        <select value={role} onChange={handleRoleChange}>
          <option value="">Choose your role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email Address</label>
        <input type="email" placeholder="your@email.com" required />

        <label>Password</label>
        <input type="password" placeholder="••••••••" required />

        <label>Confirm Password</label>
        <input type="password" placeholder="••••••••" required />

        <label>Select Country</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Choose your country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          I agree to the <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>
        </label>

        <button type="submit" className="btn">Create Account</button>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={onLoginClick}>Sign in</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
