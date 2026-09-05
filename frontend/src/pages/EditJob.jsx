import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    job_type: "",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    skills: "",
    openings: "",
    deadline: "",
    description: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}/`);

      const job = response.data;

      setFormData({
        title: job.title || "",
        location: job.location || "",
        job_type: job.job_type || "",
        experience_level: job.experience_level || "",
        salary_min: job.salary_min || "",
        salary_max: job.salary_max || "",
        skills: job.skills || "",
        openings: job.openings || "",
        deadline: job.deadline || "",
        description: job.description || "",
        status: job.status || "",
      });
    } catch (error) {
      console.error("Load job error:", error);
      setError("Unable to load job details.");
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      await api.patch(`/jobs/${id}/update/`, {
        title: formData.title,
        location: formData.location,
        job_type: formData.job_type,
        experience_level: formData.experience_level,
        salary_min: Number(formData.salary_min),
        salary_max: Number(formData.salary_max),
        skills: formData.skills,
        openings: Number(formData.openings),
        deadline: formData.deadline,
        description: formData.description,
        status: formData.status,
      });

      setSuccess("Job updated successfully!");

      setTimeout(() => {
        navigate("/my-jobs");
      }, 1000);
    } catch (error) {
      console.error("Update job error:", error);

      if (error.response?.data) {
        setError(JSON.stringify(error.response.data));
      } else {
        setError("Unable to update the job.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading job...</h2>;
  }

  if (error && !formData.title) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Edit Job</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
          <br />
          <input
            type="text"
            name="title"
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
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            placeholder="Example: 0-2 years"
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
            value={formData.skills}
            onChange={handleChange}
            placeholder="Example: Python, Django, SQL"
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
          <label>Job Status</label>
          <br />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select status</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <br />

        <div>
          <label>Job Description</label>
          <br />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="8"
            required
          ></textarea>
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Job"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/my-jobs")}
        >
          Cancel
        </button>
      </form>

      {success && <p>{success}</p>}

      {error && <p>{error}</p>}
    </div>
  );
}

export default EditJob;