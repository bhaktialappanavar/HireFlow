import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/candidate-profile.css";

function CandidateProfile() {
  const [profile, setProfile] = useState({
    phone: "",
    location: "",
    bio: "",
    education: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/auth/profile/")
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Profile error:", error);
        setError("Unable to load your profile.");
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await api.patch("/auth/profile/", profile);

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="candidate-profile-loading">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="candidate-profile-page">
      <div className="candidate-profile-header">
        <div>
          <span className="candidate-profile-badge">
            PROFILE
          </span>

          <h1>Candidate Profile</h1>

          <p>
            Keep your profile updated to make your job applications
            stronger.
          </p>
        </div>
      </div>

      <form
        className="candidate-profile-form"
        onSubmit={handleSubmit}
      >
        <div className="profile-form-section">
          <h2>Personal Information</h2>
          <p>Tell recruiters a little about yourself.</p>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label htmlFor="phone">Phone</label>

              <input
                id="phone"
                name="phone"
                type="text"
                value={profile.phone || ""}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="location">Location</label>

              <input
                id="location"
                name="location"
                type="text"
                value={profile.location || ""}
                onChange={handleChange}
                placeholder="e.g. Bangalore, Karnataka"
              />
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="bio">Professional Bio</label>

            <textarea
              id="bio"
              name="bio"
              rows="5"
              value={profile.bio || ""}
              onChange={handleChange}
              placeholder="Write a short introduction about yourself..."
            />
          </div>
        </div>

        <div className="profile-form-section">
          <h2>Education & Experience</h2>
          <p>Add information that highlights your background.</p>

          <div className="profile-field">
            <label htmlFor="education">Education</label>

            <textarea
              id="education"
              name="education"
              rows="4"
              value={profile.education || ""}
              onChange={handleChange}
              placeholder="e.g. BE Computer Science and Engineering"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="experience">Experience</label>

            <textarea
              id="experience"
              name="experience"
              rows="4"
              value={profile.experience || ""}
              onChange={handleChange}
              placeholder="Describe your experience, internships, or projects..."
            />
          </div>
        </div>

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        <div className="profile-form-actions">
          <button
            type="submit"
            className="profile-save-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CandidateProfile;