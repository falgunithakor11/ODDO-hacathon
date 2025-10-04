import React, { useState, useEffect } from 'react';
import './Admin.css';

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [approvalRules, setApprovalRules] = useState({
    manager: '',
    sequenceRequired: false,
    minApprovalPercentage: 50,
    approvers: [
      { type: 'User', required: true, policy: '' },
      { type: 'Admin', required: true, policy: 'Policy of action on review process and response actions' },
      { type: 'Attribut', required: true, policy: 'Policy of action on review process and response actions' },
      { type: 'Address', required: true, policy: 'Address' }
    ]
  });
  const [newUser, setNewUser] = useState({
    role: 'Employee',
    manager: '',
    email: '',
    name: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Fetch users and approval rules from API
    const mockUsers = [
      { id: 1, name: 'sarab', role: 'Manager', email: 'sarab@gmail.com', status: 'Active' },
      { id: 2, name: 'john', role: 'Employee', email: 'john@gmail.com', status: 'Active' }
    ];
    setUsers(mockUsers);
  }, []);

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.name) {
      alert('Please fill all required fields');
      return;
    }

    const user = {
      id: users.length + 1,
      ...newUser,
      status: 'Pending',
      password: generatePassword()
    };

    setUsers([...users, user]);
    setNewUser({ role: 'Employee', manager: '', email: '', name: '' });
    
    // Here you would typically send an API request to create the user
    console.log('Creating user:', user);
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8); // Generate random password
  };

 const sendPassword = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) {
        alert("User not found!");
        return;
    }
    // Send password email logic here
    alert(`Password sent to ${user.email}`);
};


  const handleApprovalRuleChange = (field, value) => {
    setApprovalRules(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateApprover = (index, field, value) => {
    const updatedApprovers = [...approvalRules.approvers];
    updatedApprovers[index] = {
      ...updatedApprovers[index],
      [field]: value
    };
    setApprovalRules(prev => ({
      ...prev,
      approvers: updatedApprovers
    }));
  };

  return (
    <div className="admin-view">
      {/* Header */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-capabilities">
          <span>Create company (auto on signup)</span>
          <span>Manage users</span>
          <span>Set roles</span>
          <span>Configure approval rules</span>
          <span>View all expenses</span>
          <span>Override approvals</span>
        </div>
      </div>

      <div className="admin-content">
        {/* User Management Section */}
        <div className="user-management-section">
          <h2>User Management</h2>
          
          {/* Create New User */}
          <div className="create-user-form">
            <h3>Create New User</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="New User Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="form-input"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="form-select"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
              <select
                value={newUser.manager}
                onChange={(e) => setNewUser({...newUser, manager: e.target.value})}
                className="form-select"
              >
                <option value="">Select Manager</option>
                {users.filter(u => u.role === 'Manager').map(manager => (
                  <option key={manager.id} value={manager.name}>
                    {manager.name}
                  </option>
                ))}
              </select>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="form-input"
              />
              <button onClick={handleCreateUser} className="btn-primary">
                Create User
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="users-list">
            <h3>Existing Users</h3>
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Manager</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.manager || 'Default Manager'}</td>
                    <td>{user.email}</td>
                    <td>
                      <button 
                        onClick={() => sendPassword(user.id)}
                        className="btn-secondary"
                      >
                        Send Password
                      </button>
                      <button className="btn-more">more</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Rules Section */}
        <div className="approval-rules-section">
          <h2>Approval Rules Configuration</h2>
          
          <div className="rule-description">
            <p>Approval rule for miscellaneous expenses</p>
          </div>

          {/* Manager Selection */}
          <div className="rule-field">
            <label>Manager:</label>
            <select
              value={approvalRules.manager}
              onChange={(e) => handleApprovalRuleChange('manager', e.target.value)}
              className="dynamic-dropdown"
            >
              <option value="">Select Manager</option>
              {users.filter(u => u.role === 'Manager').map(manager => (
                <option key={manager.id} value={manager.name}>
                  {manager.name}
                </option>
              ))}
            </select>
            <small>Initially the manager set in user record should be set, admin can change manager for approval if required.</small>
          </div>

          {/* Employee Field Note */}
          <div className="field-note">
            <p>
              <strong>Note:</strong> If manager field is deleted then by default the approve request would go to his/her manager field, before going to other approvers.
            </p>
          </div>

          {/* Approvers List */}
          <div className="approvers-list">
            <h4>Approvers</h4>
            {approvalRules.approvers.map((approver, index) => (
              <div key={index} className="approver-item">
                <span className="approver-number">{index + 1}.</span>
                <span className="approver-type">{approver.type}</span>
                <span className="approver-required">
                  {approver.required ? 'Required' : 'Optional'}
                </span>
                <span className="approver-policy">{approver.policy}</span>
              </div>
            ))}
          </div>

          {/* Approvers Sequence */}
          <div className="sequence-setting">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={approvalRules.sequenceRequired}
                onChange={(e) => handleApprovalRuleChange('sequenceRequired', e.target.checked)}
              />
              Approvers Sequence Required
            </label>
            <small>
              {approvalRules.sequenceRequired 
                ? 'If ticked: Request goes sequentially - first to John, if approves/rejects then only to next approver. If rejected, expense request is auto-rejected.'
                : 'If not ticked: Send approver request to all approvers at the same time.'
              }
            </small>
          </div>

          {/* Minimum Approval Percentage */}
          <div className="approval-percentage">
            <label>Minimum Approval Percentage %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={approvalRules.minApprovalPercentage}
              onChange={(e) => handleApprovalRuleChange('minApprovalPercentage', e.target.value)}
              className="percentage-input"
            />
            <small>Specify the number of percentage approvers required in order to get the request approved.</small>
          </div>

          <button className="btn-save-rules">Save Approval Rules</button>
        </div>
      </div>
    </div>
  );
};

export default AdminView;