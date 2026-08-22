import "./home.css";

function Home({ onLoginRequired }) {
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  const handleFeatureClick = () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    alert("Feature access granted!");
  };

  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          THE<span>LIFT</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#experience">Experience</a>
          <a href="#membership">Membership</a>
          <a href="#contact">Contact</a>
        </div>

        <div>
          <button className="nav-btn">
            Join The Lift <span>↗</span>
          </button>

          {isLoggedIn && (
            <button
              className="nav-btn"
              onClick={handleLogout}
              style={{ marginLeft: "10px" }}
            >
              Logout
            </button>
          )}
        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero" id="experience">

        <div className="hero-left">

          <div className="live-badge">
            <span></span>
            LIVE GYM EXPERIENCE
          </div>

          <p className="hero-label">
            TRAINING • PERFORMANCE • COMMUNITY
          </p>

          <h1>
            TRAIN
            <br />
            <span>DIFFERENT.</span>
          </h1>

          <p className="hero-description">
            The Lift is a modern training space built around serious
            workouts, smarter guidance and a better member experience.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Book a Free Trial →
            </button>

            <button className="secondary-btn">
              Explore The Lift
            </button>

          </div>

        </div>


        {/* ================= GYM CAPACITY ================= */}

        <div className="capacity-card">

          <div className="capacity-top">

            <div>

              <p className="live-text">
                <span></span> LIVE NOW
              </p>

              <h3>Gym Capacity</h3>

            </div>

            <p>Updated just now</p>

          </div>


          {isLoggedIn ? (

            <>
              <div className="capacity-number">
                47 <small>/80 people</small>
              </div>

              <div className="capacity-bar">
                <div></div>
              </div>

              <p className="available">
                33 spots available right now
              </p>

              <div className="capacity-grid">

                <div>
                  <strong>8/10</strong>
                  <span>Gym Rating</span>
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>Access Available</span>
                </div>

                <div>
                  <strong>12</strong>
                  <span>Expert Trainers</span>
                </div>

                <div>
                  <strong>500+</strong>
                  <span>Active Members</span>
                </div>

              </div>
            </>

          ) : (

            <div className="capacity-locked">

              <div className="lock-icon">
                🔒
              </div>

              <h4>
                Member Access Required
              </h4>

              <p>
                Login to view live gym capacity and member information.
              </p>

              <button onClick={onLoginRequired}>
                LOGIN TO VIEW →
              </button>

            </div>

          )}

        </div>

      </section>


      {/* ================= QUICK FEATURES ================= */}

      <section className="feature-strip">

        <div className="feature">

          <div className="feature-icon">
            ◇
          </div>

          <div>
            <h3>Premium Equipment</h3>
            <p>Train with quality equipment.</p>
          </div>

        </div>


        <div className="feature">

          <div className="feature-icon">
            □
          </div>

          <div>
            <h3>Smart Workouts</h3>
            <p>Structured programs for every goal.</p>
          </div>

        </div>


        <div className="feature">

          <div className="feature-icon">
            ♧
          </div>

          <div>
            <h3>Expert Guidance</h3>
            <p>Get better with the right guidance.</p>
          </div>

        </div>

      </section>


      {/* ================= MEMBER FEATURES ================= */}

      <section
        className="member-features"
        id="features"
      >

        <div className="section-heading">

          <p className="section-label">
            BUILT FOR YOUR PROGRESS
          </p>

          <h2>
            Everything you need
            <br />
            to <span>level up.</span>
          </h2>

          <p>
            Your fitness journey, organized in one place.
            Know what your body needs and train with purpose.
          </p>

        </div>


        <div className="member-feature-grid">


          {/* 01 NUTRITION */}

          <div className="member-feature-card large">

            <div className="feature-card-top">

              <div className="big-icon">
                🥗
              </div>

              <span>01</span>

            </div>

            <h3>
              Personalized Nutrition Plan
            </h3>

            <p>
              Get a nutrition plan based on your body,
              lifestyle, fitness goal and daily calorie needs.
            </p>

            <div
              className="feature-link"
              onClick={handleFeatureClick}
            >
              Explore Nutrition →
            </div>

          </div>


          {/* 02 BMI */}

          <div className="member-feature-card">

            <div className="feature-card-top">

              <div className="big-icon">
                ◉
              </div>

              <span>02</span>

            </div>

            <h3>
              BMI Calculator
            </h3>

            <p>
              Understand your current body status
              using your height and weight.
            </p>

            <div
              className="feature-link"
              onClick={handleFeatureClick}
            >
              Calculate BMI →
            </div>

          </div>


          {/* 03 CALORIES */}

          <div className="member-feature-card">

            <div className="feature-card-top">

              <div className="big-icon">
                🔥
              </div>

              <span>03</span>

            </div>

            <h3>
              Daily Calories
            </h3>

            <p>
              Know how many calories you need every day
              according to your activity and goal.
            </p>

            <div
              className="feature-link"
              onClick={handleFeatureClick}
            >
              Calculate Calories →
            </div>

          </div>


          {/* 04 TARGET WEIGHT */}

          <div className="member-feature-card">

            <div className="feature-card-top">

              <div className="big-icon">
                🎯
              </div>

              <span>04</span>

            </div>

            <h3>
              Target Weight
            </h3>

            <p>
              Set your target weight and track how far
              you are from your goal.
            </p>

            <div
              className="feature-link"
              onClick={handleFeatureClick}
            >
              Set Your Goal →
            </div>

          </div>


          {/* 05 WORKOUT */}

          <div className="member-feature-card">

            <div className="feature-card-top">

              <div className="big-icon">
                💪
              </div>

              <span>05</span>

            </div>

            <h3>
              Workout Plans
            </h3>

            <p>
              Follow structured workouts designed
              around your fitness level and goals.
            </p>

            <div
              className="feature-link"
              onClick={handleFeatureClick}
            >
              View Workouts →
            </div>

          </div>


          {/* 06 PROGRESS */}

          <div className="member-feature-card">

            <div className="feature-card-top">

              <div className="big-icon">
                ↗
              </div>

              <span>06</span>

            </div>

            <h3>
              Progress Tracking
            </h3>

            <p>
              Track weight, measurements, workouts
              and your overall progress over time.
            </p>

            <div
              className="feature-link"
              onClick={handleFeatureClick}
            >
              Track Progress →
            </div>

          </div>

        </div>

      </section>


      {/* ================= MEMBERSHIP ================= */}

      <section
        className="membership-section"
        id="membership"
      >

        <p className="section-label">
          MEMBERSHIP
        </p>

        <h2>
          Pick your level.
          <br />
          Then raise it.
        </h2>

        <p className="membership-description">
          Simple memberships built for beginners, regular lifters
          and people who are ready to go all in.
        </p>


        <div className="membership-grid">

          {/* STARTER */}

          <div className="membership-card">

            <h3>Starter</h3>

            <div className="price">
              ₹1,999 <span>/mo</span>
            </div>

            <p>
              For getting started.
            </p>

            <ul>
              <li>✓ Full gym access</li>
              <li>✓ QR exercise guides</li>
              <li>✓ Progress tracking</li>
              <li>✓ AI fitness assistant</li>
            </ul>

            <button
              className="secondary-btn"
              onClick={handleFeatureClick}
            >
              Choose Starter
            </button>

          </div>


          {/* PRO */}

          <div className="membership-card popular">

            <div className="popular-badge">
              MOST POPULAR
            </div>

            <h3>Pro</h3>

            <div className="price">
              ₹2,999 <span>/mo</span>
            </div>

            <p>
              For serious progress.
            </p>

            <ul>
              <li>✓ Everything in Starter</li>
              <li>✓ Trainer guidance</li>
              <li>✓ Nutrition guidance</li>
              <li>✓ Advanced progress tracking</li>
            </ul>

            <button
              className="primary-btn"
              onClick={handleFeatureClick}
            >
              Choose Pro
            </button>

          </div>


          {/* ELITE */}

          <div className="membership-card">

            <h3>Elite</h3>

            <div className="price">
              ₹4,999 <span>/mo</span>
            </div>

            <p>
              Maximum support.
            </p>

            <ul>
              <li>✓ Everything in Pro</li>
              <li>✓ Personal training</li>
              <li>✓ Custom workout planning</li>
              <li>✓ Priority support</li>
            </ul>

            <button
              className="secondary-btn"
              onClick={handleFeatureClick}
            >
              Choose Elite
            </button>

          </div>

        </div>

      </section>


      {/* ================= CONTACT ================= */}

      <section
        className="contact-section"
        id="contact"
      >

        <p className="section-label">
          GET IN TOUCH
        </p>

        <h2>
          Ready to
          <br />
          <span>train different?</span>
        </h2>

        <p>
          Have a question about memberships, training or
          anything else? Talk to The Lift team.
        </p>

        <button className="primary-btn">
          Contact The Lift →
        </button>

      </section>


      {/* ================= FOOTER ================= */}

      <footer>

        <div>
          THE<span>LIFT</span>
        </div>

        <p>
          © 2026 THE LIFT — POWERED BY FITFLOW
        </p>

      </footer>

    </div>
  );
}

export default Home;