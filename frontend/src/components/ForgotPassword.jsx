import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email!");
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    alert(`OTP sent to ${email}: ${randomOtp}`); // Mock OTP
    setStep(2);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (otp !== generatedOtp) {
      alert("Invalid OTP. Please try again.");
      return;
    }

    alert(`Password reset successful for ${email}`);
    onBackToLogin();
  };

  const fadeVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <p>Reset your password using OTP verification</p>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariant}
            transition={{ duration: 0.4 }}
            onSubmit={handleSendOtp}
          >
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="btn">
              Send OTP
            </button>

            <p className="switch-text">
              Remember your password?{" "}
              <span onClick={onBackToLogin}>Sign in</span>
            </p>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariant}
            transition={{ duration: 0.4 }}
            onSubmit={handleVerifyOtp}
          >
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="Enter the 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn">
              Reset Password
            </button>

            <p className="switch-text">
              Back to{" "}
              <span onClick={onBackToLogin}>Sign in</span>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;
