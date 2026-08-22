import { useState } from "react";
import Home from "../user/Home";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
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

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setIsLoggedIn(true);
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Home />;
  }

  return (
    <div className="login-page">

      <div className="login-layout">

        {/* =========================
            LEFT / CONTENT SECTION
        ========================== */}

        <section className="login-content">

          <div className="brand">
            THE <span>LIFT</span>
          </div>

          <div className="content-main">

            <p className="content-label">
              TRAIN WITH PURPOSE
            </p>

            <h1>
              TRAIN
              <br />
              <span>DIFFERENT.</span>
            </h1>

            <p className="content-text">
              Build strength. Build discipline.
              Build the version of yourself
              you know you can become.
            </p>

            <div className="quote">
              <div className="quote-line"></div>

              <p>
                "Your only competition
                <br />
                is who you were yesterday."
              </p>
            </div>

          </div>

          <div className="content-footer">
            THE LIFT — POWERED BY FITFLOW
          </div>

        </section>


        {/* =========================
            RIGHT / LOGIN SECTION
        ========================== */}

        <section className="login-section">

          <div className="login-card">

            <div className="login-heading">

              <p className="login-label">
                MEMBER LOGIN
              </p>

              <h2>
                Welcome
                <br />
                <span>back.</span>
              </h2>

              <p className="login-description">
                Login to access your membership,
                workouts and progress.
              </p>

            </div>


            <form onSubmit={handleLogin}>

              {/* EMAIL */}

              <div className="input-group">

                <label htmlFor="email">
                  EMAIL
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>


              {/* PASSWORD */}

              <div className="input-group">

                <label htmlFor="password">
                  PASSWORD
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>


              {/* ERROR */}

              {error && (
                <p className="login-error">
                  {error}
                </p>
              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "VERIFYING..."
                  : "LOGIN →"}
              </button>

            </form>


            {/* SIGN UP */}

            <div className="login-footer">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                className="signup-link"
                onClick={() =>
                  alert("Signup page coming next.")
                }
              >
                JOIN THE LIFT
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Login;