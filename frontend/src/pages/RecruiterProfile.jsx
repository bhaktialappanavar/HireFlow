import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/recruiter-profile.css";

function RecruiterProfile() {
  const [profile, setProfile] = useState({
    company: "",
    phone: "",
    designation: "",
    profile_photo: null,
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

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

      if (response.data.profile_photo) {
        setPhotoPreview(response.data.profile_photo);
      }
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

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setProfilePhoto(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("phone", profile.phone || "");
      formData.append("designation", profile.designation || "");

      if (profilePhoto) {
        formData.append("profile_photo", profilePhoto);
      }

      const response = await api.patch(
        "/auth/recruiter-profile/",
        formData
      );

      setProfile(response.data);
      setProfilePhoto(null);

      if (response.data.profile_photo) {
        setPhotoPreview(response.data.profile_photo);
      }

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
          <span className="profile-badge">
            👤 RECRUITER PROFILE
          </span>

          <h1>Recruiter Profile</h1>

          <p>
            Manage your professional information.
          </p>
        </div>

        <div className="profile-card">

          <div className="profile-card-header">

            <div className="profile-icon">
              👤
            </div>

            <div>
              <h2>Professional Information</h2>

              <p>
                Keep your recruiter information up to date.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* Profile Photo */}

            <div className="recruiter-profile-photo-section">

              <div className="recruiter-profile-photo-preview">

                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Recruiter Profile"
                  />
                ) : (
                  <div className="recruiter-profile-photo-placeholder">
                    👤
                  </div>
                )}

              </div>

              <div className="recruiter-profile-photo-upload">

                <label htmlFor="profile_photo">
                  Profile Photo
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


            {/* Company */}

            <div className="form-group">

              <label htmlFor="company">
                Company
              </label>

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


            {/* Designation */}

            <div className="form-group">

              <label htmlFor="designation">
                Designation
              </label>

              <input
                id="designation"
                name="designation"
                type="text"
                placeholder="e.g. HR Manager"
                value={profile.designation || ""}
                onChange={handleChange}
              />

            </div>


            {/* Phone */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter your phone number"
                value={profile.phone || ""}
                onChange={handleChange}
              />

            </div>


            {/* Messages */}

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


            {/* Save */}

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

