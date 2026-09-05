import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/recruiter-profile.css";

function RecruiterProfile() {
  const [profile, setProfile] = useState({
    company: "",
    phone: "",
    designation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/auth/recruiter-profile/");
      setProfile(response.data);
    } catch (error) {
      console.error("Profile error:", error);
      setError("Unable to load recruiter profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await api.patch(
        "/auth/recruiter-profile/",
        profile
      );

      setProfile(response.data);
      setSuccess("Recruiter profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      setError("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading recruiter profile...
      </div>
    );
  }

  return (
    <div className="recruiter-profile-page">
      <div className="recruiter-profile-container">

        <div className="profile-header">
          <span className="profile-badge">👤 RECRUITER PROFILE</span>
          <h1>Recruiter Profile</h1>
          <p>Manage your professional information.</p>
        </div>

        <div className="profile-card">

          <div className="profile-card-header">
            <div className="profile-icon">👤</div>

            <div>
              <h2>Professional Information</h2>
              <p>
                Keep your recruiter information up to date.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="company">Company</label>

              <input
                id="company"
                type="text"
                value={profile.company || ""}
                disabled
              />

              <small>
                Company information can be managed from the Company Profile.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="designation">Designation</label>

              <input
                id="designation"
                name="designation"
                type="text"
                placeholder="e.g. HR Manager"
                value={profile.designation || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter your phone number"
                value={profile.phone || ""}
                onChange={handleChange}
              />
            </div>

            {success && (
              <div className="profile-success">
                ✓ {success}
              </div>
            )}

            {error && (
              <div className="profile-error">
                ⚠ {error}
              </div>
            )}

            <div className="profile-actions">
              <button
                type="submit"
                className="save-profile-button"
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

export default RecruiterProfile;