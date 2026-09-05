import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function RecruiterDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          statsResponse,
          jobsResponse,
          profileResponse,
        ] = await Promise.all([
          api.get("/jobs/applications/stats/"),
          api.get("/jobs/my/"),
          api.get("/auth/recruiter-profile/"),
        ]);

        const jobsData =
          jobsResponse.data.results || jobsResponse.data;

        console.log("Recruiter stats:", statsResponse.data);
        console.log("Recruiter jobs:", jobsData);
        console.log("Recruiter profile:", profileResponse.data);

        setStats(statsResponse.data);
        setJobs(jobsData);
        setProfile(profileResponse.data);

      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Recruiter Profile Summary */}

      {profile && (
        <div className="recruiter-dashboard-profile">

          <div className="recruiter-dashboard-photo">

            {profile.profile_photo ? (
              <img
                src={profile.profile_photo}
                alt="Recruiter Profile"
              />
            ) : (
              <div className="recruiter-dashboard-photo-placeholder">
                👤
              </div>
            )}

          </div>

          <div className="recruiter-dashboard-info">

            <span className="recruiter-dashboard-label">
              RECRUITER
            </span>

            <h2>
              {profile.recruiter_name || "Recruiter"}
            </h2>

            <p>
              {profile.designation || "Recruiter"}
            </p>

            <p>
              🏢 {profile.company_name || profile.company || "Company"}
            </p>

            {profile.phone && (
              <p>
                📞 {profile.phone}
              </p>
            )}

            {profile.recruiter_email && (
              <p>
                ✉️ {profile.recruiter_email}
              </p>
            )}

          </div>

          <Link
            to="/recruiter-profile"
            className="recruiter-dashboard-profile-button"
          >
            Edit Profile
          </Link>

        </div>
      )}

      {/* Header */}

      <div className="dashboard-header">

        <div>

          <span className="dashboard-badge">
            RECRUITER PORTAL
          </span>

          <h1>Recruiter Dashboard</h1>

          <p>
            Manage your job postings and track candidate
            applications from one place.
          </p>

        </div>

        <Link
          to="/create-job"
          className="dashboard-primary-button"
        >
          + Post a Job
        </Link>

      </div>

      {/* Statistics */}

      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-icon">💼</div>

          <div>
            <span>Total Jobs</span>
            <strong>{jobs.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📩</div>

          <div>
            <span>Total Applications</span>
            <strong>{stats?.total || 0}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>

          <div>
            <span>Shortlisted</span>
            <strong>{stats?.SHORTLISTED || 0}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>

          <div>
            <span>Selected</span>
            <strong>{stats?.SELECTED || 0}</strong>
          </div>
        </div>

      </div>

      {/* Main Content */}

      <div className="dashboard-grid">

        {/* My Jobs */}

        <div className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>My Jobs</h2>
              <p>Manage your recent job postings.</p>
            </div>

            <Link to="/my-jobs">
              View All →
            </Link>

          </div>

          {jobs.length === 0 ? (

            <div className="dashboard-empty">

              <div>💼</div>

              <h3>No jobs posted yet</h3>

              <p>
                Create your first job posting to start
                receiving applications.
              </p>

              <Link
                to="/create-job"
                className="dashboard-secondary-button"
              >
                Post Your First Job
              </Link>

            </div>

          ) : (

            <div className="dashboard-job-list">

              {jobs.slice(0, 4).map((job) => (

                <div
                  className="dashboard-job-card"
                  key={job.id}
                >

                  <div>

                    <h3>{job.title}</h3>

                    <p>
                      📍{" "}
                      {job.location ||
                        "Location not specified"}
                    </p>

                    <span
                      className={`job-status ${
                        job.status?.toLowerCase()
                      }`}
                    >
                      {job.status}
                    </span>

                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="job-view-link"
                  >
                    View →
                  </Link>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Quick Actions */}

        <div className="dashboard-section quick-actions-section">

          <div className="section-header">

            <div>
              <h2>Quick Actions</h2>
              <p>Common recruiter tasks.</p>
            </div>

          </div>

          <div className="quick-actions">

            <Link
              to="/create-job"
              className="quick-action-card"
            >
              <span>➕</span>

              <div>
                <h3>Post a Job</h3>
                <p>Create a new job opportunity.</p>
              </div>
            </Link>

            <Link
              to="/my-jobs"
              className="quick-action-card"
            >
              <span>💼</span>

              <div>
                <h3>Manage Jobs</h3>
                <p>Edit, close or delete your jobs.</p>
              </div>
            </Link>

            <Link
              to="/recruiter-applications"
              className="quick-action-card"
            >
              <span>📩</span>

              <div>
                <h3>Applications</h3>
                <p>Review and manage candidates.</p>
              </div>
            </Link>

          </div>

        </div>

      </div>

      {/* Recruitment Overview */}

      <div className="dashboard-section overview-section">

        <div className="section-header">

          <div>
            <h2>Recruitment Overview</h2>
            <p>Current application pipeline.</p>
          </div>

        </div>

        <div className="pipeline">

          <div className="pipeline-item">
            <span>Applied</span>
            <strong>{stats?.APPLIED || 0}</strong>
          </div>

          <div className="pipeline-item">
            <span>Under Review</span>
            <strong>{stats?.UNDER_REVIEW || 0}</strong>
          </div>

          <div className="pipeline-item">
            <span>Shortlisted</span>
            <strong>{stats?.SHORTLISTED || 0}</strong>
          </div>

          <div className="pipeline-item">
            <span>Interview</span>
            <strong>{stats?.INTERVIEW || 0}</strong>
          </div>

          <div className="pipeline-item">
            <span>Selected</span>
            <strong>{stats?.SELECTED || 0}</strong>
          </div>

          <div className="pipeline-item">
            <span>Rejected</span>
            <strong>{stats?.REJECTED || 0}</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default RecruiterDashboard;

