import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";


export const register = async (req, res) => {
  // 1. Extract all potential fields
  const { name, email, password, confirmPassword } = req.body;

  // 2. Initial Validation Checks
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  // Server-side validation for password match
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Password and Confirm Password must match." });
  }

  try {
    // 3. Existing User Check (CRITICAL for preventing E11000 error)
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists. Please log in." });
    }

    // 4. Create User
    const hasedPassword = await bcrypt.hash(password, 10);

    // Note: confirmPassword is NOT stored in the database
    const user = await userModel.create({ name, email, password: hasedPassword });
    await user.save();

    // 5. Token Creation (The fixed missing piece!)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 6. Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 7. Send Welcome Email to hamare user
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to odoo app",
      text: `Welcome to oddo app. Your account has been created successfully with email id ${name}`
    };

    // Note: Ensure transporter is imported and configured
    await transporter.sendMail(mailOptions);

    // 8. Final Success Response
    return res.status(201).json({ success: true, message: "User created successfully", user });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Registration Error:", error);

    // Return a generic server error
    return res.status(500).json({ success: false, message: "An unexpected server error occurred." });
  }
}
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  try {
    //find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


export const logout = async (req, res) => {
  try {
    // ✅ FIX: Remove maxAge: 0. 
    // We must include all original options (httpOnly, secure, sameSite) 
    // so the browser can find and delete the exact cookie.
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // NOTE: 'Lax' should be capitalized for sameSite
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
      // MaxAge or Expires are NOT needed here
    });

    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}



export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized. Login again." });
    }

    const user = await userModel.findById(userId);
    if (!user || !user.email) {
      return res.status(404).json({ success: false, message: "User or email not found" });
    }

    // generate OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    user.verifyOtp = hashedOtp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    // send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Verify your account",
      text: `Your OTP is ${rawOtp}. It will expire in 10 minutes.`,
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///verify user using otp
export const verifyEmail = async (req, res) => {
  try {
    const otp = String(req.body.otp);
    const userId = req.user?.userId;

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check expiry first
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(410).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, user.verifyOtp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully ✅" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "Authenticated user" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}


export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required"
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate 6-digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    // Save hashed OTP and expiry
    user.resetOtp = hashedOtp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Reset Your Password",
      text: `Your OTP for resetting your password is ${rawOtp}. It will expire in 10 minutes.`
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if OTP is expired
    if (!user.resetOtpExpireAt || Date.now() > user.resetOtpExpireAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired"
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
};