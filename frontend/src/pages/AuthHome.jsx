import { useNavigate } from "react-router-dom";
import "./AuthHome.css";

function AuthHome() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome 👋</h2>
        <p>Are you already a user?</p>

        <div className="auth-actions">
          <button
            className="auth-btn login"
            onClick={() => navigate("/login")}
          >
            Yes, Login
          </button>

          <button
            className="auth-btn register"
            onClick={() => navigate("/register")}
          >
            No, Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthHome;
