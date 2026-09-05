import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs/applications/my/");

      console.log("Applications response:", response.data);

      if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else if (Array.isArray(response.data.results)) {
        setApplications(response.data.results);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Applications error:", error);
      setError("Unable to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "status-applied";

      case "UNDER_REVIEW":
        return "status-review";

      case "SHORTLISTED":
        return "status-shortlisted";

      case "INTERVIEW":
        return "status-interview";

      case "SELECTED":
        return "status-selected";

      case "REJECTED":
        return "status-rejected";

      default:
        return "status-default";
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-message">
          <div className="loading-spinner"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-page">
        <div className="applications-message">
          <div className="applications-message-icon">⚠️</div>
          <h2>{error}</h2>
          <button
            className="retry-button"
            onClick={loadApplications}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">

      <section className="applications-hero">
        <div className="applications-hero-content">
          <span className="applications-badge">
            📋 APPLICATION TRACKER
          </span>

          <h1>
            My <span>Applications</span>
          </h1>

          <p>
            Track your job applications and stay updated
            on your career journey.
          </p>
        </div>
      </section>

      <section className="applications-container">

        <div className="applications-header">
          <div>
            <h2>Your Applications</h2>

            <p>
              {applications.length === 0
                ? "You haven't applied to any jobs yet."
                : `${applications.length} application${
                    applications.length !== 1 ? "s" : ""
                  } submitted`}
            </p>
          </div>

          <Link to="/jobs">
            <button className="browse-jobs-button">
              Find More Jobs →
            </button>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="applications-empty">

            <div className="empty-application-icon">
              📄
            </div>

            <h2>No applications yet</h2>

            <p>
              You haven't applied for any jobs yet.
              Start exploring opportunities and submit
              your first application.
            </p>

            <Link to="/jobs">
              <button className="empty-browse-button">
                Browse Jobs →
              </button>
            </Link>

          </div>
        ) : (
          <div className="applications-list">

            {applications.map((application) => (
              <div
                className="application-card"
                key={application.id}
              >

                <div className="application-card-top">

                  <div className="application-company-icon">
                    💼
                  </div>

                  <div className="application-title">
                    <h2>
                      {application.job_title ||
                        "Job Position"}
                    </h2>

                    <p>
                      {application.company_name ||
                        "Company"}
                    </p>
                  </div>

                  <span
                    className={`application-status ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {formatStatus(application.status)}
                  </span>

                </div>

                <div className="application-info">

                  <div className="application-info-item">
                    <span>📍</span>
                    <div>
                      <small>Location</small>
                      <strong>
                        {application.job_location ||
                          "Not specified"}
                      </strong>
                    </div>
                  </div>

                  <div className="application-info-item">
                    <span>📅</span>
                    <div>
                      <small>Applied On</small>
                      <strong>
                        {formatDate(application.applied_at)}
                      </strong>
                    </div>
                  </div>

                  <div className="application-info-item">
                    <span>🔄</span>
                    <div>
                      <small>Last Updated</small>
                      <strong>
                        {formatDate(application.updated_at)}
                      </strong>
                    </div>
                  </div>

                </div>

                {application.cover_letter && (
                  <div className="application-cover-letter">

                    <h3>Cover Letter</h3>

                    <p>
                      {application.cover_letter}
                    </p>

                  </div>
                )}

                <div className="application-card-footer">

                  <Link
                    to={`/jobs/${application.job}`}
                  >
                    <button className="view-job-button">
                      View Job →
                    </button>
                  </Link>

                  <span className="application-id">
                    Application #{application.id}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>
    </div>
  );
}

export default MyApplications;