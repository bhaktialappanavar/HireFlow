import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            🚀 Your career journey starts here
          </div>

          <h1>
            Find the right job.
            <br />
            Build your <span>future.</span>
          </h1>

          <p>
            HireFlow connects talented candidates with
            great companies. Discover opportunities that
            match your skills, experience and career goals.
          </p>

          <div className="hero-buttons">

            <Link to="/jobs">
              <button className="primary-button">
                Find Jobs →
              </button>
            </Link>

            <Link to="/register">
              <button className="secondary-button">
                Create Account
              </button>
            </Link>

          </div>

          <div className="hero-stats">

            <div>
              <strong>100+</strong>
              <span>Job Opportunities</span>
            </div>

            <div>
              <strong>50+</strong>
              <span>Companies</span>
            </div>

            <div>
              <strong>500+</strong>
              <span>Active Candidates</span>
            </div>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-card main-card">

            <div className="job-icon">
              💼
            </div>

            <div>
              <h3>Find Your Dream Job</h3>
              <p>Opportunities waiting for you</p>
            </div>

          </div>

          <div className="hero-card floating-card">

            <span className="success-icon">✓</span>

            <div>
              <strong>Career Growth</strong>
              <p>Start today</p>
            </div>

          </div>

        </div>

      </section>


      {/* Features */}

      <section className="features-section">

        <div className="section-heading">

          <span>WHY HIRE FLOW?</span>

          <h2>
            Everything you need for your career
          </h2>

          <p>
            A simple platform designed to make job
            searching and hiring easier.
          </p>

        </div>

        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              🔍
            </div>

            <h3>Find Opportunities</h3>

            <p>
              Search thousands of opportunities using
              skills, location and job type.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              🎯
            </div>

            <h3>Easy Applications</h3>

            <p>
              Apply to jobs quickly and keep track of
              your applications in one place.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              🏢
            </div>

            <h3>For Recruiters</h3>

            <p>
              Post jobs, manage applications and discover
              talented candidates.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="cta-section">

        <div>

          <h2>
            Ready to take the next step?
          </h2>

          <p>
            Start exploring opportunities today.
          </p>

        </div>

        <Link to="/jobs">
          <button className="cta-button">
            Explore Jobs →
          </button>
        </Link>

      </section>

    </div>
  );
}

export default Home;