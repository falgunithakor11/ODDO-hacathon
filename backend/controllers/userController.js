const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Create new user (Admin/Manager only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, manager, country } = req.body;
    const company = req.user.company._id;

    // Check if user exists
    const existingUser = await User.findOne({ email, company });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists in this company' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password || 'temp123', 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'employee',
      company,
      manager,
      country: country || req.user.country
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: user.details
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error creating user', error: error.message });
  }
};

// Get all users in company
exports.getUsers = async (req, res) => {
  try {
    const company = req.user.company._id;
    const users = await User.find({ company })
      .populate('manager', 'name email')
      .select('-password');

    res.json({
      users: users.map(user => ({
        ...user.details,
        manager: user.manager
      }))
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users', error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove password from updates if present
    delete updates.password;

    const user = await User.findOneAndUpdate(
      { _id: id, company: req.user.company._id },
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: user.details
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error updating user', error: error.message });
  }
};

// Delete user (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: id, company: req.user.company._id },
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error deactivating user', error: error.message });
  }
};