import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/company-profile.css";

function CompanyProfile() {
  const [company, setCompany] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    industry: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const response = await api.get("/auth/company/");
      setCompany(response.data);
    } catch (error) {
      console.error("Company profile error:", error);
      setError("Unable to load company profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {

      const { logo, ...companyData } = company;

      const response = await api.patch("/auth/company/", companyData);

      setCompany(response.data);
      setSuccess("Company profile updated successfully!");
    } catch (error) {
      console.error("Company update error:", error);

      const data = error.response?.data;

      if (data) {
        const firstError = Object.values(data)[0];
        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : String(firstError)
        );
      } else {
        setError("Unable to update company profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="company-profile-loading">
        Loading company profile...
      </div>
    );
  }

  return (
    <div className="company-profile-page">
      <div className="company-profile-container">

        <div className="company-profile-header">
          <span className="company-profile-badge">
            🏢 COMPANY PROFILE
          </span>

          <h1>Company Profile</h1>

          <p>
            Manage your company information visible to candidates.
          </p>
        </div>

        <div className="company-profile-card">

          <div className="company-profile-card-header">
            <div className="company-profile-icon">
              🏢
            </div>

            <div>
              <h2>Company Information</h2>
              <p>
                Keep your company details up to date.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="name">Company Name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter company name"
                value={company.name || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe your company..."
                value={company.description || ""}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>

              <input
                id="website"
                name="website"
                type="url"
                placeholder="https://example.com"
                value={company.website || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Bangalore, Karnataka"
                value={company.location || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="industry">Industry</label>

              <input
                id="industry"
                name="industry"
                type="text"
                placeholder="e.g. Information Technology"
                value={company.industry || ""}
                onChange={handleChange}
              />
            </div>


            {success && (
              <div className="company-profile-success">
                ✓ {success}
              </div>
            )}

            {error && (
              <div className="company-profile-error">
                ⚠ {error}
              </div>
            )}

            <div className="company-profile-actions">
              <button
                type="submit"
                className="save-company-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default CompanyProfile;