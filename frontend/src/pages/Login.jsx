import { useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard"); // programmatic redirect after login
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      {message && (
        <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
      )}

      <p style={{ marginTop: "15px" }}>
        Don’t have an account?
        <Link
          to="/register"
          style={{
            marginLeft: "8px",
            color: "#4f46e5",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
