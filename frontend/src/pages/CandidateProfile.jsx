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
    profile_photo: null,
    resume: null,
  });

  const [resume, setResume] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/auth/profile/")
      .then((response) => {
        setProfile(response.data);

        if (response.data.profile_photo) {
          setPhotoPreview(response.data.profile_photo);
        }

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

  const handleResumeChange = (event) => {
    setResume(event.target.files[0]);
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setProfilePhoto(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("phone", profile.phone || "");
      formData.append("location", profile.location || "");
      formData.append("bio", profile.bio || "");
      formData.append("education", profile.education || "");
      formData.append("experience", profile.experience || "");

      if (profilePhoto) {
        formData.append("profile_photo", profilePhoto);
      }

      if (resume) {
        formData.append("resume", resume);
      }

      const response = await api.patch(
        "/auth/profile/",
        formData
      );

      setProfile(response.data);
      setResume(null);
      setProfilePhoto(null);

      if (response.data.profile_photo) {
        setPhotoPreview(response.data.profile_photo);
      }

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

        {/* Profile Photo */}
        <div className="profile-form-section">

          <h2>Profile Photo</h2>

          <p>
            Add a professional photo to help recruiters recognize you.
          </p>

          <div className="profile-photo-section">

            <div className="profile-photo-preview">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                />
              ) : (
                <div className="profile-photo-placeholder">
                  👤
                </div>
              )}
            </div>

            <div className="profile-photo-upload">

              <label htmlFor="profile_photo">
                Upload Profile Photo
              </label>

              <input
                id="profile_photo"
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
              />

              <small>
                Accepted formats: JPG, JPEG, PNG
              </small>

            </div>

          </div>

        </div>


        {/* Personal Information */}
        <div className="profile-form-section">

          <h2>Personal Information</h2>

          <p>
            Tell recruiters a little about yourself.
          </p>

          <div className="profile-form-grid">

            <div className="profile-field">
              <label htmlFor="phone">
                Phone
              </label>

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
              <label htmlFor="location">
                Location
              </label>

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

            <label htmlFor="bio">
              Professional Bio
            </label>

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


        {/* Education & Experience */}
        <div className="profile-form-section">

          <h2>Education & Experience</h2>

          <p>
            Add information that highlights your background.
          </p>

          <div className="profile-field">

            <label htmlFor="education">
              Education
            </label>

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

            <label htmlFor="experience">
              Experience
            </label>

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


        {/* Resume */}
        <div className="profile-form-section">

          <h2>Resume</h2>

          <p>
            Upload your latest resume for recruiters to review.
          </p>

          <div className="profile-field">

            <label htmlFor="resume">
              Upload Resume
            </label>

            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />

            <small>
              Accepted formats: PDF, DOC, DOCX
            </small>

          </div>

          {profile.resume && (
            <div className="current-resume">

              <p>
                Current Resume:
              </p>

              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                View Current Resume
              </a>

            </div>
          )}

        </div>


        {/* Messages */}
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


        {/* Save */}
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

