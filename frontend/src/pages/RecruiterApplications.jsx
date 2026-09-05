import { useEffect, useState } from "react";
import api from "../services/api";

function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [updatingId, setUpdatingId] = useState(null);

  // Candidate profile
  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  const [candidateLoadingId, setCandidateLoadingId] =
    useState(null);

  const [candidateError, setCandidateError] =
    useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  // Load recruiter applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/jobs/applications/recruiter/"
      );

      console.log(
        "Recruiter applications:",
        response.data
      );

      if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else if (Array.isArray(response.data.results)) {
        setApplications(response.data.results);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Applications error:", error);
      setError("Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  // View candidate profile
  const handleViewCandidate = async (applicationId) => {
    try {
      setCandidateLoadingId(applicationId);
      setCandidateError("");
      setSelectedCandidate(null);
      setSelectedApplication(null);

      const response = await api.get(
        `/jobs/applications/${applicationId}/candidate/`
      );

      console.log(
        "Candidate profile:",
        response.data
      );

      setSelectedCandidate(response.data);
    } catch (error) {
      console.error(
        "Candidate profile error:",
        error
      );

      setCandidateError(
        "Unable to load candidate profile."
      );
    } finally {
      setCandidateLoadingId(null);
    }
  };

  // Update application status
  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      await api.patch(
        `/jobs/applications/${applicationId}/status/`,
        {
          status: status,
        }
      );

      // Update application list immediately
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: status,
              }
            : application
        )
      );

      // Update application modal if open
      setSelectedApplication(
        (currentApplication) =>
          currentApplication &&
          currentApplication.id === applicationId
            ? {
                ...currentApplication,
                status: status,
              }
            : currentApplication
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      const responseData =
        error.response?.data;

      if (responseData?.detail) {
        setError(responseData.detail);
      } else if (responseData?.status) {
        setError(
          Array.isArray(responseData.status)
            ? responseData.status[0]
            : responseData.status
        );
      } else {
        setError(
          "Unable to update application status."
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // Status CSS class
  const getStatusClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "recruiter-status-applied";

      case "UNDER_REVIEW":
        return "recruiter-status-review";

      case "SHORTLISTED":
        return "recruiter-status-shortlisted";

      case "INTERVIEW":
        return "recruiter-status-interview";

      case "SELECTED":
        return "recruiter-status-selected";

      case "REJECTED":
        return "recruiter-status-rejected";

      default:
        return "recruiter-status-default";
    }
  };

  // Format status text
  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // Format date
  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // Candidate initials
  const getInitials = (name) => {
    if (!name) {
      return "C";
    }

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  if (loading) {
    return (
      <div className="recruiter-applications-page">
        <div className="recruiter-applications-message">
          <div className="loading-spinner"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-applications-page">

      {/* =========================
          HERO
      ========================== */}
      <section className="recruiter-applications-hero">
        <div className="recruiter-applications-hero-content">

          <span className="recruiter-applications-badge">
            👥 TALENT MANAGEMENT
          </span>

          <h1>
            Candidate <span>Applications</span>
          </h1>

          <p>
            Review candidates, manage applications
            and find the right talent for your company.
          </p>

        </div>
      </section>


      {/* =========================
          MAIN CONTENT
      ========================== */}
      <section className="recruiter-applications-container">

        {/* Header */}
        <div className="recruiter-applications-header">

          <div>
            <h2>Applications Received</h2>

            <p>
              {applications.length === 0
                ? "No applications received yet."
                : `${applications.length} application${
                    applications.length !== 1
                      ? "s"
                      : ""
                  } received`}
            </p>
          </div>

          <button
            className="refresh-applications-button"
            onClick={loadApplications}
          >
            ↻ Refresh
          </button>

        </div>


        {/* Error */}
        {error && (
          <div className="recruiter-application-error">
            ⚠ {error}
          </div>
        )}


        {/* Empty State */}
        {applications.length === 0 &&
          !error && (
            <div className="recruiter-applications-empty">

              <div className="recruiter-empty-icon">
                📋
              </div>

              <h2>No applications yet</h2>

              <p>
                Applications from candidates will
                appear here when they apply to your jobs.
              </p>

            </div>
          )}


        {/* =========================
            APPLICATION LIST
        ========================== */}
        {applications.length > 0 && (
          <div className="recruiter-applications-list">

            {applications.map((application) => (
              <div
                className="recruiter-application-card"
                key={application.id}
              >

                {/* Card Header */}
                <div className="recruiter-application-top">

                  <div className="candidate-avatar">
                    {getInitials(
                      application.candidate_name
                    )}
                  </div>

                  <div className="candidate-details">

                    <h2>
                      {application.candidate_name ||
                        "Candidate"}
                    </h2>

                    <p>
                      {application.candidate_email ||
                        "Email not available"}
                    </p>

                  </div>

                  <span
                    className={`recruiter-application-status ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {formatStatus(
                      application.status
                    )}
                  </span>

                </div>


                {/* Job Information */}
                <div className="recruiter-application-info">

                  <div className="recruiter-info-item">
                    <span>💼</span>

                    <div>
                      <small>Applied For</small>

                      <strong>
                        {application.job_title ||
                          "Job Position"}
                      </strong>
                    </div>
                  </div>


                  <div className="recruiter-info-item">
                    <span>🏢</span>

                    <div>
                      <small>Company</small>

                      <strong>
                        {application.company_name ||
                          "Company"}
                      </strong>
                    </div>
                  </div>


                  <div className="recruiter-info-item">
                    <span>📍</span>

                    <div>
                      <small>Location</small>

                      <strong>
                        {application.job_location ||
                          "Not specified"}
                      </strong>
                    </div>
                  </div>


                  <div className="recruiter-info-item">
                    <span>📅</span>

                    <div>
                      <small>Applied On</small>

                      <strong>
                        {formatDate(
                          application.applied_at
                        )}
                      </strong>
                    </div>
                  </div>

                </div>


                {/* Cover Letter */}
                {application.cover_letter && (
                  <div className="recruiter-cover-letter">

                    <h3>Cover Letter</h3>

                    <p>
                      {application.cover_letter}
                    </p>

                  </div>
                )}


                {/* =========================
                    CARD ACTIONS
                ========================== */}
                <div className="recruiter-application-footer">

                  <div className="application-view-actions">

                    {/* View Application */}
                    <button
                      className="view-application-button"
                      onClick={() =>
                        setSelectedApplication(
                          application
                        )
                      }
                    >
                      View Application
                    </button>


                    {/* View Candidate */}
                    <button
                      className="view-candidate-button"
                      onClick={() =>
                        handleViewCandidate(
                          application.id
                        )
                      }
                      disabled={candidateLoadingId !== null}
                    >
                      {candidateLoadingId === application.id
                        ? "Loading..."
                        : "View Candidate"}
                    </button>

                  </div>


                  <div className="application-actions">

                    {/* Move to Under Review */}
                    {application.status ===
                      "APPLIED" && (
                      <button
                        className="review-button"
                        onClick={() =>
                          updateStatus(
                            application.id,
                            "UNDER_REVIEW"
                          )
                        }
                        disabled={
                          updatingId ===
                          application.id
                        }
                      >
                        {updatingId ===
                        application.id
                          ? "Updating..."
                          : "Review"}
                      </button>
                    )}


                    {/* Shortlist */}
                    {application.status !==
                      "SHORTLISTED" &&
                      application.status !==
                        "REJECTED" &&
                      application.status !==
                        "SELECTED" && (
                        <button
                          className="shortlist-button"
                          onClick={() =>
                            updateStatus(
                              application.id,
                              "SHORTLISTED"
                            )
                          }
                          disabled={
                            updatingId ===
                            application.id
                          }
                        >
                          {updatingId ===
                          application.id
                            ? "Updating..."
                            : "✓ Shortlist"}
                        </button>
                      )}


                    {/* Move to Interview */}
                    {application.status ===
                      "SHORTLISTED" && (
                      <button
                        className="interview-button"
                        onClick={() =>
                          updateStatus(
                            application.id,
                            "INTERVIEW"
                          )
                        }
                        disabled={
                          updatingId ===
                          application.id
                        }
                      >
                        {updatingId ===
                        application.id
                          ? "Updating..."
                          : "🎯 Interview"}
                      </button>
                    )}


                    {/* Select */}
                    {application.status ===
                      "INTERVIEW" && (
                      <button
                        className="select-button"
                        onClick={() =>
                          updateStatus(
                            application.id,
                            "SELECTED"
                          )
                        }
                        disabled={
                          updatingId ===
                          application.id
                        }
                      >
                        {updatingId ===
                        application.id
                          ? "Updating..."
                          : "✓ Select Candidate"}
                      </button>
                    )}


                    {/* Reject */}
                    {application.status !==
                      "REJECTED" &&
                      application.status !==
                        "SELECTED" && (
                        <button
                          className="reject-button"
                          onClick={() =>
                            updateStatus(
                              application.id,
                              "REJECTED"
                            )
                          }
                          disabled={
                            updatingId ===
                            application.id
                          }
                        >
                          Reject
                        </button>
                      )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>


      {/* =================================================
          APPLICATION MODAL
      ================================================== */}
      {selectedApplication && (
        <div
          className="application-modal-overlay"
          onClick={() =>
            setSelectedApplication(null)
          }
        >

          <div
            className="application-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}
            <div className="application-modal-header">

              <div>

                <span className="modal-label">
                  CANDIDATE APPLICATION
                </span>

                <h2>
                  {selectedApplication.candidate_name ||
                    "Candidate"}
                </h2>

                <p>
                  {selectedApplication.candidate_email ||
                    "Email not available"}
                </p>

              </div>


              <button
                className="modal-close-button"
                onClick={() =>
                  setSelectedApplication(null)
                }
              >
                ×
              </button>

            </div>


            {/* Status */}
            <div className="modal-status-section">

              <span
                className={`recruiter-application-status ${getStatusClass(
                  selectedApplication.status
                )}`}
              >
                {formatStatus(
                  selectedApplication.status
                )}
              </span>

            </div>


            {/* Job Details */}
            <div className="modal-job-details">

              <div>
                <small>Applied For</small>

                <strong>
                  {selectedApplication.job_title ||
                    "Job Position"}
                </strong>
              </div>


              <div>
                <small>Company</small>

                <strong>
                  {selectedApplication.company_name ||
                    "Company"}
                </strong>
              </div>


              <div>
                <small>Location</small>

                <strong>
                  {selectedApplication.job_location ||
                    "Not specified"}
                </strong>
              </div>


              <div>
                <small>Applied On</small>

                <strong>
                  {formatDate(
                    selectedApplication.applied_at
                  )}
                </strong>
              </div>

            </div>


            {/* Cover Letter */}
            <div className="modal-cover-letter">

              <h3>Cover Letter</h3>

              <p>
                {selectedApplication.cover_letter ||
                  "No cover letter provided."}
              </p>

            </div>


            {/* Modal Actions */}
            <div className="modal-actions">

              {/* View Candidate */}
              <button
                className="view-candidate-button"
                onClick={() =>
                  handleViewCandidate(
                    selectedApplication.id
                  )
                }
                disabled={candidateLoadingId !== null}
              >
                {candidateLoadingId === selectedApplication.id
                  ? "Loading Candidate..."
                  : "View Candidate Profile"}
              </button>


              {/* Review */}
              {selectedApplication.status ===
                "APPLIED" && (
                <button
                  className="review-button"
                  onClick={() =>
                    updateStatus(
                      selectedApplication.id,
                      "UNDER_REVIEW"
                    )
                  }
                  disabled={
                    updatingId ===
                    selectedApplication.id
                  }
                >
                  Review Candidate
                </button>
              )}


              {/* Shortlist */}
              {selectedApplication.status !==
                "SHORTLISTED" &&
                selectedApplication.status !==
                  "REJECTED" &&
                selectedApplication.status !==
                  "SELECTED" && (
                <button
                  className="shortlist-button"
                  onClick={() =>
                    updateStatus(
                      selectedApplication.id,
                      "SHORTLISTED"
                    )
                  }
                  disabled={
                    updatingId ===
                    selectedApplication.id
                  }
                >
                  ✓ Shortlist Candidate
                </button>
              )}


              {/* Interview */}
              {selectedApplication.status ===
                "SHORTLISTED" && (
                <button
                  className="interview-button"
                  onClick={() =>
                    updateStatus(
                      selectedApplication.id,
                      "INTERVIEW"
                    )
                  }
                  disabled={
                    updatingId ===
                    selectedApplication.id
                  }
                >
                  🎯 Schedule Interview
                </button>
              )}


              {/* Select */}
              {selectedApplication.status ===
                "INTERVIEW" && (
                <button
                  className="select-button"
                  onClick={() =>
                    updateStatus(
                      selectedApplication.id,
                      "SELECTED"
                    )
                  }
                  disabled={
                    updatingId ===
                    selectedApplication.id
                  }
                >
                  ✓ Select Candidate
                </button>
              )}


              {/* Reject */}
              {selectedApplication.status !==
                "REJECTED" &&
                selectedApplication.status !==
                  "SELECTED" && (
                <button
                  className="reject-button"
                  onClick={() =>
                    updateStatus(
                      selectedApplication.id,
                      "REJECTED"
                    )
                  }
                  disabled={
                    updatingId ===
                    selectedApplication.id
                  }
                >
                  Reject Candidate
                </button>
              )}

            </div>

          </div>

        </div>
      )}


      {/* =================================================
          CANDIDATE PROFILE MODAL
      ================================================== */}

      {(candidateLoadingId !== null ||
        candidateError ||
        selectedCandidate) && (

        <div
          className="candidate-modal-overlay"
          onClick={() => {
            if (candidateLoadingId === null) {
              setSelectedCandidate(null);
              setCandidateError("");
            }
          }}
        >

          <div
            className="candidate-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Loading */}
            {candidateLoadingId !== null && (
              <div className="candidate-loading">

                <div className="loading-spinner"></div>

                <p>
                  Loading candidate profile...
                </p>

              </div>
            )}


            {/* Error */}
            {candidateLoadingId === null &&
              candidateError && (
                <div className="candidate-error">

                  <h3>
                    Unable to load profile
                  </h3>

                  <p>
                    {candidateError}
                  </p>

                  <button
                    className="view-application-button"
                    onClick={() => {
                      setCandidateError("");
                      setSelectedCandidate(null);
                    }}
                  >
                    Close
                  </button>

                </div>
              )}


            {/* Candidate Profile */}
            {candidateLoadingId === null &&
              !candidateError &&
              selectedCandidate && (
                <>

                  {/* Header */}
                  <div className="candidate-modal-header">

                    <div className="candidate-modal-title">

                      <span className="candidate-profile-badge">
                        CANDIDATE PROFILE
                      </span>

                      <h2>
                        {selectedCandidate.candidate_name ||
                          "Candidate"}
                      </h2>

                      <p>
                        {selectedCandidate.candidate_email ||
                          "Email not available"}
                      </p>

                    </div>


                    <button
                      className="candidate-modal-close"
                      onClick={() =>
                        setSelectedCandidate(null)
                      }
                    >
                      ×
                    </button>

                  </div>


                  {/* Contact Information */}
                  <div className="candidate-modal-section">

                    <h3>
                      Contact Information
                    </h3>

                    <div className="candidate-profile-info-grid">

                      <div>
                        <span>📧</span>

                        <div>
                          <small>Email</small>

                          <p>
                            {selectedCandidate.candidate_email ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>


                      <div>
                        <span>📱</span>

                        <div>
                          <small>Phone</small>

                          <p>
                            {selectedCandidate.phone ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>


                      <div>
                        <span>📍</span>

                        <div>
                          <small>Location</small>

                          <p>
                            {selectedCandidate.location ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>

                    </div>

                  </div>


                  {/* Professional Bio */}
                  <div className="candidate-modal-section">

                    <h3>
                      Professional Bio
                    </h3>

                    <p className="candidate-profile-text">
                      {selectedCandidate.bio ||
                        "No professional bio provided."}
                    </p>

                  </div>


                  {/* Education */}
                  <div className="candidate-modal-section">

                    <h3>
                      Education
                    </h3>

                    <p className="candidate-profile-text">
                      {selectedCandidate.education ||
                        "Education information not provided."}
                    </p>

                  </div>


                  {/* Experience */}
                  <div className="candidate-modal-section">

                    <h3>
                      Experience
                    </h3>

                    <p className="candidate-profile-text">
                      {selectedCandidate.experience ||
                        "Experience information not provided."}
                    </p>

                  </div>


                  {/* Resume */}
                  <div className="candidate-modal-resume">

                    <div>

                      <h3>
                        Resume
                      </h3>

                      <p>
                        {selectedCandidate.resume
                          ? "Candidate has uploaded a resume."
                          : "No resume uploaded."}
                      </p>

                    </div>


                    {selectedCandidate.resume && (
                      <a
                        href={
                          selectedCandidate.resume
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="view-resume-button"
                      >
                        📄 View Resume
                      </a>
                    )}

                  </div>

                </>
              )}

          </div>

        </div>
      )}

    </div>
  );
}

export default RecruiterApplications;