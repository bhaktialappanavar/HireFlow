import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Login using username and password
      const response = await api.post("/auth/login/", formData);

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      // Store JWT tokens
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Get logged-in user's information
      const userResponse = await api.get("/auth/me/");

      const user = userResponse.data;

      // Store user information
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "CANDIDATE") {
        navigate("/candidate-dashboard");
      } else if (user.role === "RECRUITER") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        setError(error.response.data.non_field_errors[0]);
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Section */}
        <div className="login-intro">

          <div className="login-brand">
            <div className="login-brand-icon">H</div>
            <span>HireFlow</span>
          </div>

          <div className="login-intro-content">

            <span className="login-badge">
              WELCOME BACK
            </span>

            <h1>
              Your next opportunity
              <span> starts here.</span>
            </h1>

            <p>
              Connect with great companies, discover meaningful
              opportunities, and take the next step in your career.
            </p>

            <div className="login-benefits">

              <div className="login-benefit">
                <span>✓</span>
                <p>Discover relevant job opportunities</p>
              </div>

              <div className="login-benefit">
                <span>✓</span>
                <p>Track your applications easily</p>
              </div>

              <div className="login-benefit">
                <span>✓</span>
                <p>Connect with hiring teams</p>
              </div>

            </div>

          </div>
        </div>

        {/* Login Card */}
        <div className="login-card-wrapper">

          <div className="login-card">

            <div className="login-header">
              <h2>Welcome back</h2>

              <p>
                Sign in to continue to your HireFlow account.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="login-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >

              {/* Username */}
              <div className="login-form-group">

                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />

              </div>

              {/* Password */}
              <div className="login-form-group">

                <div className="login-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />

              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            {/* Register Link */}
            <p className="login-register-text">
              Don't have an account?
              <Link to="/register">
                {" "}Create an account
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;

