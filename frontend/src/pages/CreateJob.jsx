import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
    <div>
      <h1>Post a Job</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
          <br />
          <input
            type="text"
            name="title"
            placeholder="Enter job title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Job Type</label>
          <br />
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

        <br />

        <div>
          <label>Experience Required</label>
          <br />
          <input
            type="text"
            name="experience"
            placeholder="Example: 0-2 years"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Minimum Salary</label>
          <br />
          <input
            type="number"
            name="salary_min"
            placeholder="Minimum salary"
            value={formData.salary_min}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Maximum Salary</label>
          <br />
          <input
            type="number"
            name="salary_max"
            placeholder="Maximum salary"
            value={formData.salary_max}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Skills</label>
          <br />
          <input
            type="text"
            name="skills"
            placeholder="Example: Python, Django, SQL"
            value={formData.skills}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Number of Openings</label>
          <br />
          <input
            type="number"
            name="openings"
            placeholder="Number of openings"
            value={formData.openings}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Application Deadline</label>
          <br />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Job Description</label>
          <br />
          <textarea
            name="description"
            placeholder="Describe the job..."
            rows="8"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>

      {success && <p>{success}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default CreateJob;

