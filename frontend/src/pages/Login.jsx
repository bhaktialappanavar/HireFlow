import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login/", {
        username: username,
        password: password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      const userResponse = await api.get("/auth/me/", {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(userResponse.data));

      const role = userResponse.data.role;

      if (role === "CANDIDATE") {
        navigate("/candidate-dashboard");
      } else if (role === "RECRUITER") {
        navigate("/recruiter-dashboard");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid username or password.");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;

