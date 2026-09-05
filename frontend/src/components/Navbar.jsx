import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          Hire<span>Flow</span>
        </Link>

        <div className="navbar-links">

          <Link to="/">Home</Link>

          <Link to="/jobs">Jobs</Link>

          {!token && (
            <>
              <Link to="/login">Login</Link>

              <Link
                to="/register"
                className="navbar-register"
              >
                Get Started
              </Link>
            </>
          )}

          {token && user?.role === "CANDIDATE" && (
            <>
            <Link to="/candidate-dashboard">
              Dashboard
            </Link>

            <Link to="/my-applications">
              My Applications
            </Link>

            <Link to="/candidate-profile">
              Profile
            </Link>
            </>
          )}

          {token && user?.role === "RECRUITER" && (
            <>
              <Link to="/recruiter-dashboard">
                Dashboard
              </Link>

              <Link to="/my-jobs">
                My Jobs
              </Link>

              <Link to="/recruiter-applications">
                Applications
              </Link>

              <Link to="/recruiter-profile">
              Profile
              </Link>

              <Link to="/company-profile">
              Company
              </Link>

            </>
          )}

          {token && (
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;