import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/job-details.css";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/jobs/${id}/`)
      .then((response) => {
        setJob(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load job details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="details-message">
        <p>Loading job...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-message">
        <p>{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="details-message">
        <p>Job not found.</p>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-details-container">

        <Link to="/jobs" className="back-to-jobs">
          ← Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="job-details-header">
          <div className="job-details-company-icon">
            💼
          </div>

          <div className="job-details-title">
            <h1>{job.title}</h1>

            <p className="company-name">
              {job.company_name || "Not specified"}
            </p>
          </div>

          <span className="job-details-type">
            {job.job_type}
          </span>
        </div>

        {/* Main Layout */}
        <div className="job-details-layout">

          {/* Main Content */}
          <div className="job-details-main">

            {/* Job Overview */}
            <div className="job-overview">

              <div className="overview-item">
                <span className="overview-icon">📍</span>
                <div>
                  <small>Location</small>
                  <strong>{job.location}</strong>
                </div>
              </div>

              <div className="overview-item">
                <span className="overview-icon">💼</span>
                <div>
                  <small>Job Type</small>
                  <strong>{job.job_type}</strong>
                </div>
              </div>

              <div className="overview-item">
                <span className="overview-icon">🎓</span>
                <div>
                  <small>Experience</small>
                  <strong>{job.experience}</strong>
                </div>
              </div>

              <div className="overview-item">
                <span className="overview-icon">💰</span>
                <div>
                  <small>Salary</small>
                  <strong>
                    ₹{job.salary_min} - ₹{job.salary_max}
                  </strong>
                </div>
              </div>

              <div className="overview-item">
                <span className="overview-icon">👥</span>
                <div>
                  <small>Openings</small>
                  <strong>{job.openings}</strong>
                </div>
              </div>

            </div>

            {/* Description */}
            <div className="details-section">
              <h2>Job Description</h2>

              <p className="job-description">
                {job.description}
              </p>
            </div>

            {/* Skills */}
            <div className="details-section">
              <h2>Required Skills</h2>

              <div className="details-skills">
                {job.skills &&
                  job.skills.split(",").map((skill, index) => (
                    <span key={index}>
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="job-details-sidebar">

            {/* Apply Card */}
            <div className="apply-card">
              <h2>Interested in this job?</h2>

              <p>
                Apply now and take the next step in your career.
              </p>

              {job.status === "CLOSED" ? (
                <button className="apply-button disabled-button" disabled>
                  Job Closed
                </button>
              ) : (
                <Link to={`/jobs/${job.id}/apply`}>
                  <button className="apply-button">
                    Apply Now
                  </button>
                </Link>
              )}
            </div>

            {/* Job Meta */}
            <div className="job-meta-card">
              <h3>Job Information</h3>

              <div className="meta-row">
                <span>Posted</span>
                <strong>
                  {new Date(job.created_at).toLocaleDateString()}
                </strong>
              </div>

              <div className="meta-row">
                <span>Deadline</span>
                <strong>{job.deadline}</strong>
              </div>

              <div className="meta-row">
                <span>Status</span>

                <strong
                  className={
                    job.status === "OPEN"
                      ? "status-open"
                      : "status-closed"
                  }
                >
                  {job.status}
                </strong>
              </div>

            </div>

            <Link to="/jobs" className="sidebar-back-link">
              View More Jobs →
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetails;