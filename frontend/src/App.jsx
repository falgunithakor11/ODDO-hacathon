import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/components/Login"
import AdminView from "../src/components/AdminView";
import ManagerView from "../src/components/ManagerView";
import EmployeeView from "../src/components/EmployeeView";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/manager" element={<ManagerView />} />
        <Route path="/employee" element={<EmployeeView />} />
      </Routes>
    </Router>
  );
};

export default App;
