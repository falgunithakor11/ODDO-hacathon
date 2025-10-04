import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
// import RoleDashboard from "./components/RoleDashboard";
import ForgotPassword from "./ForgotPassword";

function App() {
  const [page, setPage] = useState("login");
  const [userRole, setUserRole] = useState(null);

  return (
    <div className="app-container">
      {page === "login" && (
        <Login
          onSignupClick={() => setPage("signup")}
          onForgotClick={() => setPage("forgot")}
          onLoginSuccess={(role) => {
            setUserRole(role);
            setPage("dashboard");
          }}
        />
      )}

      {page === "signup" && <Signup onLoginClick={() => setPage("login")} />}

      {page === "forgot" && (
        <ForgotPassword onBackToLogin={() => setPage("login")} />
      )}

      {page === "dashboard" && <RoleDashboard role={userRole} />}
    </div>
  );
}

export default App;
