import "./Login.css";

function Login() {
  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <section className="login-intro">

        <div className="login-logo">
          THE <span>LIFT</span>
        </div>

        <div className="intro-content">

          <p className="intro-label">TRAIN WITH PURPOSE</p>

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

          <p className="login-label">MEMBER LOGIN</p>

          <h2>
            Welcome
            <span>back.</span>
          </h2>

          <p className="login-description">
            Login to access your membership, workouts and progress.
          </p>

          <form>

            <div className="input-group">
              <label>EMAIL</label>
              <input
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="input-group">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="login-button">
              LOGIN <span>→</span>
            </button>

          </form>

          <p className="signup-text">
            Don't have an account?
            <button type="button" className="signup-link">
              JOIN THE LIFT
            </button>
          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;