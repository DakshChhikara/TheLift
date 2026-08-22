import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // Wrong credentials
      if (!response.ok) {
        alert(data.message || "Invalid email or password");
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Tell App.jsx that login was successful
      onLogin(data.user);

    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}

      <section className="login-intro">

        <div className="login-logo">
          THE <span>LIFT</span>
        </div>

        <div className="intro-content">

          <p className="intro-label">
            TRAIN WITH PURPOSE
          </p>

          <h1>
            TRAIN
            <span>DIFFERENT.</span>
          </h1>

          <p className="intro-text">
            Build strength. Build discipline. Build the version of yourself
            you know you can become.
          </p>

          <div className="quote">
            "Your only competition
            <br />
            is who you were yesterday."
          </div>

        </div>

        <p className="intro-footer">
          THE LIFT — POWERED BY FITFLOW
        </p>

      </section>


      {/* RIGHT SIDE */}

      <section className="login-side">

        <div className="login-card">

          <p className="login-label">
            MEMBER LOGIN
          </p>

          <h2>
            Welcome
            <span>back.</span>
          </h2>

          <p className="login-description">
            Login to access your membership, workouts and progress.
          </p>


          <form onSubmit={handleLogin}>

            <div className="input-group">

              <label>EMAIL</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            <div className="input-group">

              <label>PASSWORD</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>


            <button
              type="submit"
              className="login-button"
            >
              LOGIN <span>→</span>
            </button>

          </form>


          <p className="signup-text">

            Don't have an account?

            <button
              type="button"
              className="signup-link"
            >
              JOIN THE LIFT
            </button>

          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;