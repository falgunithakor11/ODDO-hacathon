import React, { useState, useEffect } from 'react';
// import './ManagerView.css';

const ManagerView = () => {
  const [approvals, setApprovals] = useState([]);
  const [teamExpenses, setTeamExpenses] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockApprovals = [
      {
        id: 1,
        subject: "Team Lunch - Client Meeting",
        requestOwner: "Sarah Johnson",
        category: "Food",
        status: "Pending",
        originalAmount: 602.50,
        convertedAmount: 49896,
        currency: "INR",
        requestDate: "2024-01-15",
        description: "Team lunch with potential clients from TechCorp"
      },
      {
        id: 2,
        subject: "Flight to Conference",
        requestOwner: "Mike Chen",
        category: "Travel",
        status: "Pending",
        originalAmount: 850.00,
        convertedAmount: 70380,
        currency: "INR",
        requestDate: "2024-01-14",
        description: "Round trip flight to Tech Conference 2024"
      },
      {
        id: 3,
        subject: "Software License",
        requestOwner: "David Wilson",
        category: "Software",
        status: "Pending",
        originalAmount: 1200.00,
        convertedAmount: 99360,
        currency: "INR",
        requestDate: "2024-01-13",
        description: "Annual license for design software"
      }
    ];

    const mockTeamExpenses = [
      { id: 1, employee: "Sarah Johnson", category: "Food", amount: 49896, status: "Pending", date: "2024-01-15" },
      { id: 2, employee: "Mike Chen", category: "Travel", amount: 70380, status: "Approved", date: "2024-01-14" },
      { id: 3, employee: "David Wilson", category: "Software", amount: 99360, status: "Rejected", date: "2024-01-13" },
      { id: 4, employee: "Emma Davis", category: "Equipment", amount: 35640, status: "Approved", date: "2024-01-12" }
    ];

    setApprovals(mockApprovals);
    setTeamExpenses(mockTeamExpenses);
  }, []);

  const handleApprove = (approvalId) => {
    setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: 'Approved' } : a));
    setTeamExpenses(prev => prev.map(e => e.id === approvalId ? { ...e, status: 'Approved' } : e));
    console.log(`Approved expense with ID: ${approvalId}`);
  };

  const handleReject = (approvalId) => {
    setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: 'Rejected' } : a));
    setTeamExpenses(prev => prev.map(e => e.id === approvalId ? { ...e, status: 'Rejected' } : e));
    console.log(`Rejected expense with ID: ${approvalId}`);
  };

  const handleEscalate = (approvalId) => {
    console.log(`Escalated expense with ID: ${approvalId}`);
    alert(`Expense ${approvalId} has been escalated to higher management.`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'status-pending',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected'
    };
    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  return (
    <div className="manager-view">
      <div className="manager-header">
        <h1>Manager's View</h1>
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Pending Approvals</h3>
            <p className="count">{pendingApprovals.length}</p>
          </div>
          <div className="summary-card">
            <h3>Total Team Expenses</h3>
            <p className="amount">{formatCurrency(teamExpenses.reduce((sum, e) => sum + e.amount, 0))}</p>
          </div>
        </div>
      </div>

      <div className="approvals-section">
        <h2>Approvals to Review</h2>
        {pendingApprovals.length === 0 ? (
          <div className="no-approvals"><p>No pending approvals to review.</p></div>
        ) : (
          <div className="table-container">
            <table className="approvals-table">
              <thead>
                <tr>
                  <th>Approval Subject</th>
                  <th>Request Owner</th>
                  <th>Category</th>
                  <th>Request Status</th>
                  <th>Total amount (in company's currency)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="subject-cell">
                        <strong>{a.subject}</strong>
                        <small>{a.description}</small>
                      </div>
                    </td>
                    <td>{a.requestOwner}</td>
                    <td><span className="category-tag">{a.category}</span></td>
                    <td>{getStatusBadge(a.status)}</td>
                    <td>
                      <div className="amount-cell">
                        <span className="converted-amount">{formatCurrency(a.convertedAmount)}</span>
                        <small className="original-amount">(${a.originalAmount.toFixed(2)})</small>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-approve" onClick={() => handleApprove(a.id)}>Approve</button>
                        <button className="btn-reject" onClick={() => handleReject(a.id)}>Reject</button>
                        <button className="btn-escalate" onClick={() => handleEscalate(a.id)}>Escalate</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="team-expenses-section">
        <h2>Team Expenses Overview</h2>
        <div className="table-container">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {teamExpenses.map(e => (
                <tr key={e.id}>
                  <td>{e.employee}</td>
                  <td><span className="category-tag">{e.category}</span></td>
                  <td>{formatCurrency(e.amount)}</td>
                  <td>{getStatusBadge(e.status)}</td>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerView;
