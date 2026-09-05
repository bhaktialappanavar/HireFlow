import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "CANDIDATE",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register/", formData);

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        const data = error.response.data;

        if (typeof data === "object") {
          const messages = Object.entries(data)
            .map(([field, message]) => {
              const text = Array.isArray(message)
                ? message.join(" ")
                : message;

              return `${field}: ${text}`;
            })
            .join(" | ");

          setError(messages);
        } else {
          setError("Registration failed.");
        }
      } else {
        setError("Unable to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">

        {/* Left Section */}
        <div className="register-intro">
          <div className="register-brand">
            <div className="register-brand-icon">H</div>
            <span>HireFlow</span>
          </div>

          <div className="register-intro-content">
            <span className="register-badge">JOIN HIRE FLOW</span>

            <h1>
              Build your future.
              <span> Find your flow.</span>
            </h1>

            <p>
              Create your HireFlow account and connect with opportunities
              that match your skills, experience, and career goals.
            </p>

            <div className="register-benefits">
              <div className="register-benefit">
                <span>✓</span>
                <p>Explore opportunities that match your skills</p>
              </div>

              <div className="register-benefit">
                <span>✓</span>
                <p>Track your applications in one place</p>
              </div>

              <div className="register-benefit">
                <span>✓</span>
                <p>Connect with companies and recruiters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <div className="register-card-wrapper">
          <div className="register-card">

            <div className="register-header">
              <h2>Create your account</h2>
              <p>Join HireFlow and take the next step in your career.</p>
            </div>

            {success && (
              <div className="register-success">
                <span>✓</span>
                <p>{success}</p>
              </div>
            )}

            {error && (
              <div className="register-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <form
              onSubmit={handleRegister}
              className="register-form"
            >

              <div className="register-name-row">

                <div className="register-form-group">
                  <label htmlFor="first_name">First Name</label>

                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-form-group">
                  <label htmlFor="last_name">Last Name</label>

                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="register-form-group">
                <label htmlFor="username">Username</label>

                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="role">I want to join as</label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="CANDIDATE">Candidate</option>
                  <option value="RECRUITER">Recruiter</option>
                </select>
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>

            <div className="register-divider">
              <span>or</span>
            </div>

            <p className="register-login-text">
              Already have an account?
              <Link to="/login"> Sign in</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;