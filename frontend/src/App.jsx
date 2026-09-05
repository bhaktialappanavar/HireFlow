import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles/navbar.css";
import "./styles/footer.css";
import "./styles/home.css";
import "./styles/jobs.css";
import "./styles/job-details.css";
import "./styles/apply-job.css";
import "./styles/my-applications.css";
import "./styles/recruiter-applications.css";
import "./styles/recruiter-dashboard.css";
import "./styles/my-jobs.css";
import CandidateProfile from "./pages/CandidateProfile";
import RecruiterProfile from "./pages/RecruiterProfile";
import CompanyProfile from "./pages/CompanyProfile";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import MyJobs from "./pages/MyJobs";
import RecruiterApplications from "./pages/RecruiterApplications";
import EditJob from "./pages/EditJob";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/jobs" element={<Jobs />} />

            <Route path="/jobs/:id" element={<JobDetails />} />

            <Route
              path="/jobs/:id/apply"
              element={
                <ProtectedRoute role="CANDIDATE">
                  <ApplyJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-applications"
              element={
                <ProtectedRoute role="CANDIDATE">
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            <Route 
            path="/candidate-profile" element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <CandidateProfile />
              </ProtectedRoute>
            }
          />

            <Route
              path="/candidate-dashboard"
              element={
                <ProtectedRoute role="CANDIDATE">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />

            <Route
            path="/recruiter-profile"
            element={
            <ProtectedRoute allowedRoles={["RECRUITER"]}>
              <RecruiterProfile />
              </ProtectedRoute>
            }
            />

            <Route
              path="/recruiter-dashboard"
              element={
                <ProtectedRoute role="RECRUITER">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-job"
              element={
                <ProtectedRoute role="RECRUITER">
                  <CreateJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-jobs"
              element={
                <ProtectedRoute role="RECRUITER">
                  <MyJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter-applications"
              element={
                <ProtectedRoute role="RECRUITER">
                  <RecruiterApplications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jobs/:id/edit"
              element={
                <ProtectedRoute role="RECRUITER">
                  <EditJob />
                </ProtectedRoute>
              }
            />

            <Route
            path="/company-profile"
            element={
            <ProtectedRoute allowedRoles={["RECRUITER"]}>
              <CompanyProfile />
              </ProtectedRoute>
            }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;