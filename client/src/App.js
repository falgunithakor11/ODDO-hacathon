import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import RoleDashboard from "./components/RoleDashboard";

function App() {
  const [page, setPage] = useState("login");
  const [userRole, setUserRole] = useState(null);

  return (
    <div className="app-container">
      {page === "login" && (
        <Login
          onSignupClick={() => setPage("signup")}
          onLoginSuccess={(role) => {
            setUserRole(role);
            setPage("dashboard");
          }}
        />
      )}
      {page === "signup" && <Signup onLoginClick={() => setPage("login")} />}
      {page === "dashboard" && <RoleDashboard role={userRole} />}
    </div>
  );
}

export default App;
