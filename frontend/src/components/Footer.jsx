import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>HireFlow</h2>

          <p>
            Connecting talented people with opportunities
            that help careers grow.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/jobs">Find Jobs</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-section">
          <h3>For Candidates</h3>

          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/login">Candidate Login</Link>
        </div>

        <div className="footer-section">
          <h3>For Recruiters</h3>

          <Link to="/login">Recruiter Login</Link>
          <Link to="/register">Create Account</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 HireFlow. All rights reserved.
        </p>

        <p>
          Built with React & Django
        </p>
      </div>
    </footer>
  );
}

export default Footer;