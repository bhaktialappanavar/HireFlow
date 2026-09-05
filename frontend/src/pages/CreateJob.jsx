import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/create-job.css";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    job_type: "",
    experience: "",
    salary_min: "",
    salary_max: "",
    skills: "",
    openings: "",
    deadline: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/jobs/create/", {
        ...formData,
        salary_min: Number(formData.salary_min),
        salary_max: Number(formData.salary_max),
        openings: Number(formData.openings),
      });

      setSuccess("Job posted successfully!");

      setTimeout(() => {
        navigate("/my-jobs");
      }, 1500);
    } catch (error) {
      console.error("Create job error:", error);

      if (error.response?.data) {
        setError(JSON.stringify(error.response.data));
      } else {
        setError("Unable to post the job.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-page">
      <div className="create-job-container">

        <div className="create-job-header">
          <h1>Post a Job</h1>
          <p>Create a new opportunity and find the right candidate.</p>
        </div>

        <div className="create-job-card">

          {success && (
            <div className="create-job-success">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="create-job-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-job-form">

            <div className="create-job-form-group">
              <label>Job Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter job title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-job-form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-job-row">

              <div className="create-job-form-group">
                <label>Job Type</label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select job type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>

              <div className="create-job-form-group">
                <label>Experience Required</label>
                <input
                  type="text"
                  name="experience"
                  placeholder="Example: 0-2 years"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="create-job-row">

              <div className="create-job-form-group">
                <label>Minimum Salary</label>
                <input
                  type="number"
                  name="salary_min"
                  placeholder="Minimum salary"
                  value={formData.salary_min}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-job-form-group">
                <label>Maximum Salary</label>
                <input
                  type="number"
                  name="salary_max"
                  placeholder="Maximum salary"
                  value={formData.salary_max}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="create-job-form-group">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                placeholder="Example: Python, Django, SQL"
                value={formData.skills}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-job-row">

              <div className="create-job-form-group">
                <label>Number of Openings</label>
                <input
                  type="number"
                  name="openings"
                  placeholder="Number of openings"
                  value={formData.openings}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-job-form-group">
                <label>Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="create-job-form-group">
              <label>Job Description</label>
              <textarea
                name="description"
                placeholder="Describe the job, responsibilities, requirements..."
                rows="8"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="create-job-submit"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default CreateJob;