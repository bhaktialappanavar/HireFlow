import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, location, jobType]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs/", {
        params: {
          search: search,
          location: location,
          job_type: jobType,
        },
      });

      console.log("Jobs response:", response.data);

      if (Array.isArray(response.data.results)) {
        setJobs(response.data.results);
      } else {
        setJobs([]);
        setError("Invalid jobs data received from server.");
      }
    } catch (error) {
      console.error("Jobs error:", error);
      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const formatJobType = (type) => {
    if (!type) return "";

    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatSalary = (min, max) => {
    if (!min && !max) {
      return null;
    }

    if (min && max) {
      return `₹${Number(min).toLocaleString()} - ₹${Number(
        max
      ).toLocaleString()}`;
    }

    if (min) {
      return `₹${Number(min).toLocaleString()}+`;
    }

    return `Up to ₹${Number(max).toLocaleString()}`;
  };

  const formatSkills = (skills) => {
    if (!skills) {
      return [];
    }

    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");
  };

  return (
    <div className="jobs-page">

      {/* Page Header */}

      <section className="jobs-hero">

        <div className="jobs-hero-content">

          <span className="jobs-badge">
            💼 CAREER OPPORTUNITIES
          </span>

          <h1>
            Find your next
            <span> opportunity.</span>
          </h1>

          <p>
            Explore jobs that match your skills, experience
            and career goals.
          </p>

        </div>

      </section>


      {/* Search & Filters */}

      <section className="jobs-container">

        <div className="job-search-box">

          <div className="search-input-wrapper">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search jobs, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-wrapper">
            <span>📍</span>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Bangaluru">Bangaluru</option>
              <option value="Belgaum">Belgaum</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="filter-wrapper">
            <span>💼</span>

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">All Job Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>

        </div>


        {/* Results Header */}

        <div className="jobs-results-header">

          <div>
            <h2>Available Jobs</h2>

            <p>
              {loading
                ? "Finding opportunities..."
                : `${jobs.length} jobs found`}
            </p>
          </div>

        </div>


        {/* Loading */}

        {loading && (
          <div className="jobs-message">
            <div className="loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="jobs-message">
            <h2>{error}</h2>
            <p>Please try again later.</p>
          </div>
        )}


        {/* No Jobs */}

        {!loading && !error && jobs.length === 0 && (
          <div className="jobs-message">

            <div className="empty-icon">
              🔍
            </div>

            <h2>No jobs found</h2>

            <p>
              Try changing your search or filters to find
              more opportunities.
            </p>

          </div>
        )}


        {/* Job Cards */}

        {!loading && !error && jobs.length > 0 && (

          <div className="jobs-grid">

            {jobs.map((job) => {

              const skills = formatSkills(job.skills);
              const salary = formatSalary(
                job.salary_min,
                job.salary_max
              );

              return (
                <div
                  className="professional-job-card"
                  key={job.id}
                >

                  <div className="job-card-top">

                    <div className="company-placeholder">
                      💼
                    </div>

                    <span className="job-type-badge">
                      {formatJobType(job.job_type)}
                    </span>

                  </div>


                  <div className="job-card-content">

                    <h2>{job.title}</h2>

                    <p className="job-company">
                      {job.company_name}
                    </p>

                    <div className="job-info">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        💼 {job.experience_level || "Not specified"}
                      </span>

                    </div>


                    {salary && (
                      <div className="salary">
                        💰 {salary}
                      </div>
                    )}


                    {skills.length > 0 && (

                      <div className="skills-list">

                        {skills.slice(0, 5).map(
                          (skill, index) => (
                            <span key={index}>
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    )}

                  </div>


                  <div className="job-card-footer">

                    <Link to={`/jobs/${job.id}`}>
                      <button className="details-button">
                        View Details
                        <span>→</span>
                      </button>
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default Jobs;