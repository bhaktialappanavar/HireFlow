import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/jobs/applications/", {
        job: id,
        cover_letter: coverLetter,
      });

      setSuccess("Application submitted successfully!");

      setTimeout(() => {
        navigate("/my-applications");
      }, 1500);
    } catch (error) {
      console.error("Application error:", error);

      const responseData = error.response?.data;

      if (responseData?.job) {
        setError(
          Array.isArray(responseData.job)
            ? responseData.job[0]
            : responseData.job
        );
      } else if (responseData?.detail) {
        setError(responseData.detail);
      } else {
        setError(
          "Unable to submit application. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-page">
      <div className="apply-container">

        <div className="apply-header">
          <span className="apply-badge">📝 JOB APPLICATION</span>

          <h1>Apply for this position</h1>

          <p>
            Take the next step in your career by submitting
            your application.
          </p>
        </div>

        <div className="apply-card">

          <div className="apply-card-header">
            <div className="apply-icon">💼</div>

            <div>
              <h2>Application Form</h2>
              <p>
                Tell the recruiter why you're a great fit
                for this position.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="coverLetter">
                Cover Letter
              </label>

              <textarea
                id="coverLetter"
                placeholder="Write your cover letter here..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows="10"
                required
              />

              <small>
                Explain your skills, experience and why you
                are interested in this position.
              </small>
            </div>

            {success && (
              <div className="application-success">
                ✓ {success}
              </div>
            )}

            {error && (
              <div className="application-error">
                ⚠ {error}
              </div>
            )}

            <div className="apply-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-application-button"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Application →"}
              </button>

            </div>

          </form>
        </div>

        <div className="application-note">
          🔒 Your application information will be shared
          securely with the recruiter.
        </div>

      </div>
    </div>
  );
}

export default ApplyJob;