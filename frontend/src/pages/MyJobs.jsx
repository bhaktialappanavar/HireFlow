import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/jobs/my/")
      .then((response) => {
        console.log("My jobs:", response.data);

        setJobs(response.data.results || response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("My jobs error:", error);
        setError("Unable to load your jobs.");
        setLoading(false);
      });
  }, []);

  const closeJob = async (id) => {
    try {
      await api.patch(`/jobs/${id}/close/`);

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === id
            ? { ...job, status: "CLOSED" }
            : job
        )
      );

      alert("Job closed successfully.");
    } catch (error) {
      console.error("Close job error:", error);
      alert("Unable to close the job.");
    }
  };

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/jobs/${id}/delete/`);

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job.id !== id)
      );

      alert("Job deleted successfully.");
    } catch (error) {
      console.error("Delete job error:", error);
      alert("Unable to delete the job.");
    }
  };

  if (loading) {
    return (
      <div className="my-jobs-page">
        <div className="my-jobs-loading">
          Loading your jobs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-jobs-page">
        <div className="my-jobs-error">
          ⚠ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="my-jobs-page">

      {/* Header */}
      <div className="my-jobs-header">
        <div>
          <span className="my-jobs-badge">
            RECRUITER PORTAL
          </span>

          <h1>My Jobs</h1>

          <p>
            Manage your job postings and track their status.
          </p>
        </div>

        <Link
          to="/create-job"
          className="my-jobs-create-button"
        >
          + Post a Job
        </Link>
      </div>

      {/* Job Count */}
      <div className="my-jobs-summary">
        <strong>{jobs.length}</strong>
        <span>
          {jobs.length === 1 ? "Job Posted" : "Jobs Posted"}
        </span>
      </div>

      {/* Empty State */}
      {jobs.length === 0 ? (
        <div className="my-jobs-empty">

          <div className="empty-icon">💼</div>

          <h2>No jobs posted yet</h2>

          <p>
            Start hiring by creating your first job
            opportunity.
          </p>

          <Link
            to="/create-job"
            className="my-jobs-empty-button"
          >
            Create Your First Job
          </Link>

        </div>
      ) : (
        <div className="my-jobs-list">

          {jobs.map((job) => (
            <div className="my-job-card" key={job.id}>

              {/* Job Header */}
              <div className="my-job-top">

                <div>
                  <h2>{job.title}</h2>

                  <p className="my-job-location">
                    📍 {job.location || "Location not specified"}
                  </p>
                </div>

                <span
                  className={`my-job-status ${
                    job.status?.toLowerCase()
                  }`}
                >
                  {job.status}
                </span>

              </div>

              {/* Job Information */}
              <div className="my-job-info">

                <div>
                  <span>Job Type</span>
                  <strong>
                    {job.job_type || "Not specified"}
                  </strong>
                </div>

                <div>
                  <span>Experience</span>
                  <strong>
                    {job.experience_level || "Not specified"}
                  </strong>
                </div>

                <div>
                  <span>Openings</span>
                  <strong>
                    {job.openings || 0}
                  </strong>
                </div>

                <div>
                  <span>Salary</span>
                  <strong>
                    {job.salary_min && job.salary_max
                      ? `₹${job.salary_min} - ₹${job.salary_max}`
                      : "Not specified"}
                  </strong>
                </div>

              </div>

              {/* Skills */}
              {job.skills && (
                <div className="my-job-skills">
                  <span>Skills</span>
                  <p>{job.skills}</p>
                </div>
              )}

              {/* Actions */}
              <div className="my-job-actions">

                <Link
                  to={`/jobs/${job.id}`}
                  className="job-action view"
                >
                  View
                </Link>

                <button
                  className="job-action edit"
                  onClick={() =>
                    navigate(`/jobs/${job.id}/edit`)
                  }
                >
                  Edit
                </button>

                <button
                  className="job-action close"
                  onClick={() => closeJob(job.id)}
                  disabled={job.status === "CLOSED"}
                >
                  {job.status === "CLOSED"
                    ? "Closed"
                    : "Close Job"}
                </button>

                <button
                  className="job-action delete"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyJobs;