# 📌 Expense Management System  

A role-based expense management system where:  
- **Admin** can create accounts for employees and managers, assign roles, and manage expense approvals.  
- **Employees** can submit their expenses and track approval status.  
- **Managers** can review and approve/reject employee expenses.  

---

## 🚀 Features  

### 🔑 Authentication  
- Secure login system (Admin / Manager / Employee).  
- Passwords hashed before storing in the database.  
- Unique credentials sent via email when account is created.  

### 👤 Roles & Permissions  
- **Admin:**  
  - Login to Admin Dashboard.  
  - Manage roles (add/edit employees & managers).  
  - Generate unique passwords & send via email.  
  - View all expenses & approval status.  
- **Manager:**  
  - View submitted expenses from employees.  
  - Approve or reject expenses.  
- **Employee:**  
  - Submit expense requests with amount, description, and receipt upload.  
  - Track approval status in real-time.  

### 📊 Dashboard  
- Overview of employees, managers, and expenses.  
- Pending, Approved, and Rejected expenses summary.  

### 📩 Email Integration  
- Automated email notification with login credentials when new users are created.  
- Option to notify employees when expense is approved/rejected.  

---

## 🛠️ Tech Stack  

- **Frontend:** React + CSS  
- **Backend:** Node.js   
- **Database:** MongoDB  
- **Authentication:** JWT (for API) 
- **Email Service:** Nodemailer (Node.js) 

---

