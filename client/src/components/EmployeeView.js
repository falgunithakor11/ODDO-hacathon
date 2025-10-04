


import React, { useState, useEffect } from 'react';


const EmployeeView = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    expenseDate: '',
    category: '',
    paidBy: '',
    currency: 'USD',
    amount: ''
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');

  // Sample data - replace with API calls
  const sampleExpenses = [
    {
      id: 1,
      description: 'Restaurant Dinner with Client',
      date: '2025-10-10',
      category: 'meals',
      paidBy: 'card',
      amount: 120.00,
      currency: 'USD',
      status: 'approved'
    },
    {
      id: 2,
      description: 'Flight to Conference',
      date: '2025-10-05',
      category: 'travel',
      paidBy: 'company_card',
      amount: 450.00,
      currency: 'USD',
      status: 'approved'
    },
    {
      id: 3,
      description: 'Office Supplies',
      date: '2025-10-02',
      category: 'supplies',
      paidBy: 'cash',
      amount: 75.50,
      currency: 'USD',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // In real app, fetch expenses from API
    setExpenses(sampleExpenses);
    setFormData(prev => ({
      ...prev,
      expenseDate: new Date().toISOString().split('T')[0]
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new expense object
    const newExpense = {
      id: expenses.length + 1,
      ...formData,
      amount: parseFloat(formData.amount),
      status: 'pending',
      receipt: receiptFile ? receiptFile.name : null,
      submittedDate: new Date().toISOString()
    };

    // In real app, send to backend API
    console.log('Submitting expense:', newExpense);
    
    // Add to local state
    setExpenses(prev => [newExpense, ...prev]);
    
    // Reset form
    setFormData({
      description: '',
      expenseDate: new Date().toISOString().split('T')[0],
      category: '',
      paidBy: '',
      currency: 'USD',
      amount: ''
    });
    setReceiptFile(null);
    setReceiptPreview('');
    
    alert('Expense submitted successfully! It will now go through the approval process.');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pending' },
      approved: { class: 'status-approved', text: 'Approved' },
      rejected: { class: 'status-rejected', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status ${config.class}`}>{config.text}</span>

  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate summary statistics
  const totalSubmitted = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingAmount = expenses
    .filter(expense => expense.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const approvedAmount = expenses
    .filter(expense => expense.status === 'approved')
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="employee-expense">
      <header className="expense-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">ExpenseTracker</div>
            <div className="user-info">
              <div>Welcome, Sarah</div>
              <div className="user-avatar">S</div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container">
        <div className="dashboard">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Expense Summary</div>
            </div>
            <div className="stats">
              <div className="stat-item">
                <div className="stat-value">{formatCurrency(totalSubmitted, 'USD')}</div>
                <div className="stat-label">Total Submitted</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{formatCurrency(pendingAmount, 'USD')}</div>
                <div className="stat-label">Pending Approval</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{formatCurrency(approvedAmount, 'USD')}</div>
                <div className="stat-label">Approved</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">36.67%</div>
                <div className="stat-label">This Quarter</div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Activity</div>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-desc">Expense approved</div>
                <div className="activity-date">Oct 12, 2025</div>
              </div>
              <div className="activity-item">
                <div className="activity-desc">New expense submitted</div>
                <div className="activity-date">Oct 10, 2025</div>
              </div>
              <div className="activity-item">
                <div className="activity-desc">Receipt uploaded</div>
                <div className="activity-date">Oct 8, 2025</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="expense-form card">
          <div className="card-header">
            <div className="card-title">Submit New Expense</div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter expense description"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expenseDate">Expense Date</label>
                <input
                  type="date"
                  id="expenseDate"
                  name="expenseDate"
                  value={formData.expenseDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="travel">Travel</option>
                  <option value="meals">Meals</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="supplies">Office Supplies</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="paidBy">Paid By</label>
                <select
                  id="paidBy"
                  name="paidBy"
                  value={formData.paidBy}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit Card</option>
                  <option value="company_card">Company Card</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="receipt">Attach Receipt</label>
              <div 
                className="file-upload" 
                onClick={() => document.getElementById('receipt').click()}
              >
                <div>📎</div>
                <div>Click to upload receipt or drag and drop</div>
                <input
                  type="file"
                  id="receipt"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
              {receiptPreview && (
                <img 
                  src={receiptPreview} 
                  className="receipt-preview" 
                  alt="Receipt preview" 
                />
              )}
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              Submit Expense
            </button>
          </form>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">Expense History</div>
          </div>
          
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Paid By</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>{formatDate(expense.date)}</td>
                    <td className="text-capitalize">{expense.category}</td>
                    <td className="text-capitalize">{expense.paidBy.replace('_', ' ')}</td>
                    <td>{formatCurrency(expense.amount, expense.currency)}</td>
                    <td>{getStatusBadge(expense.status)}</td>
                    <td className="action-buttons">
                      <button className="action-btn">View</button>
                      <button className="action-btn">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;