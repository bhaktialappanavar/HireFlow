import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/candidate-dashboard.css";

function CandidateDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/auth/me/"),
      api.get("/jobs/applications/my/stats/"),
    ])
      .then(([userResponse, statsResponse]) => {
        setUser(userResponse.data);
        setStats(statsResponse.data);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="candidate-dashboard-loading">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="candidate-dashboard">
      {/* Header */}

      <section className="candidate-dashboard-header">
        <div>
          <span className="candidate-badge">CANDIDATE PORTAL</span>

          <h1>
            Welcome back, {user?.username || "Candidate"}!
          </h1>

          <p>
            Track your applications and discover your next career opportunity.
          </p>
        </div>

        <Link to="/jobs" className="candidate-browse-button">
          Browse Jobs
        </Link>
      </section>

      {/* Profile */}

      {user && (
        <section className="candidate-profile-card">
          <div className="candidate-profile-avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>

          <div className="candidate-profile-info">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <span>{user.role}</span>
          </div>
        </section>
      )}

      {/* Statistics */}

      {stats && (
        <section className="candidate-stats-section">
          <div className="section-heading">
            <div>
              <span>OVERVIEW</span>
              <h2>Application Activity</h2>
            </div>
          </div>

          <div className="candidate-stats-grid">
            <div className="candidate-stat-card">
              <span className="stat-label">Total Applications</span>
              <strong>{stats.total}</strong>
              <p>Jobs applied</p>
            </div>

            <div className="candidate-stat-card">
              <span className="stat-label">Shortlisted</span>
              <strong>{stats.SHORTLISTED}</strong>
              <p>Applications shortlisted</p>
            </div>

            <div className="candidate-stat-card">
              <span className="stat-label">Interviews</span>
              <strong>{stats.INTERVIEW}</strong>
              <p>Interview opportunities</p>
            </div>

            <div className="candidate-stat-card">
              <span className="stat-label">Selected</span>
              <strong>{stats.SELECTED}</strong>
              <p>Successful applications</p>
            </div>

            <div className="candidate-stat-card">
              <span className="stat-label">Rejected</span>
              <strong>{stats.REJECTED}</strong>
              <p>Applications rejected</p>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}

      <section className="candidate-actions-section">
        <div className="section-heading">
          <div>
            <span>QUICK ACTIONS</span>
            <h2>Manage Your Job Search</h2>
          </div>
        </div>

        <div className="candidate-action-grid">
          <Link to="/jobs" className="candidate-action-card">
            <div className="action-icon">⌕</div>

            <div>
              <h3>Browse Jobs</h3>
              <p>
                Search and explore available job opportunities.
              </p>
            </div>

            <span className="action-arrow">→</span>
          </Link>

          <Link
            to="/my-applications"
            className="candidate-action-card"
          >
            <div className="action-icon">✓</div>

            <div>
              <h3>My Applications</h3>
              <p>
                Track the status of jobs you have applied for.
              </p>
            </div>

            <span className="action-arrow">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default CandidateDashboard;