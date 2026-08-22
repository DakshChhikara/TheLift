import "./Home.css";

function Home() {
  return (
    <main className="home-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          THE<span>LIFT</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#experience">Experience</a>
          <a href="#membership">Membership</a>
          <a href="#contact">Contact</a>
        </div>

        <button className="nav-button">
          Join The Lift
        </button>
      </nav>


      {/* HERO */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <span></span>
            LIVE GYM EXPERIENCE
          </div>

          <p className="hero-eyebrow">
            TRAINING / PERFORMANCE / COMMUNITY
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
            <button className="primary-button">
              Book a Free Trial <span>→</span>
            </button>

            <button className="secondary-button">
              Explore The Lift
            </button>
          </div>

        </div>


        {/* LIVE CARD */}
        <div className="gym-card">

          <div className="card-top">
            <div>
              <div className="live-status">
                <span></span>
                LIVE NOW
              </div>

              <h3>Gym Capacity</h3>
            </div>

            <p>Updated just now</p>
          </div>

          <div className="capacity">
            <strong>47</strong>
            <span>/80 people</span>
          </div>

          <div className="capacity-bar">
            <div></div>
          </div>

          <p className="spots">
            33 spots available right now
          </p>

          <div className="gym-stats">

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

        </div>

      </section>


      {/* STATS */}
      <section className="stats-section">

        <div>
          <strong>500+</strong>
          <span>ACTIVE MEMBERS</span>
        </div>

        <div>
          <strong>12</strong>
          <span>EXPERT TRAINERS</span>
        </div>

        <div>
          <strong>50+</strong>
          <span>EQUIPMENT</span>
        </div>

        <div>
          <strong>4.9 ★</strong>
          <span>MEMBER RATING</span>
        </div>

      </section>


      {/* ADMIN / GYM MANAGEMENT */}
      <section className="dashboard-section" id="features">

        <div className="dashboard-copy">

          <p className="section-label">
            FOR THE LIFT TEAM
          </p>

          <h2>
            One dashboard.
            <br />
            Complete control.
          </h2>

          <p>
            A simple view of what matters to the gym team —
            members, attendance, leads, renewals and performance.
          </p>

          <ul>
            <li>Member & membership management</li>
            <li>Attendance and live capacity</li>
            <li>Expiring membership alerts</li>
            <li>Lead & trial tracking</li>
            <li>Business performance overview</li>
          </ul>

          <button className="primary-button">
            Request a Demo
          </button>

        </div>


        <div className="dashboard-card">

          <div className="dashboard-header">
            <h3>The Lift Dashboard</h3>

            <span>
              <i></i>
              LIVE
            </span>
          </div>

          <div className="dashboard-grid">

            <div>
              <span>Members</span>
              <strong>524</strong>
            </div>

            <div>
              <span>Today Attendance</span>
              <strong>183</strong>
            </div>

            <div>
              <span>Live Inside</span>
              <strong>47</strong>
            </div>

            <div>
              <span>New Leads</span>
              <strong>28</strong>
            </div>

            <div>
              <span>Renewals Due</span>
              <strong>16</strong>
            </div>

            <div>
              <span>Conversion</span>
              <strong>38%</strong>
            </div>

          </div>

          <div className="chart">

            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="active"></div>
            <div></div>

          </div>

        </div>

      </section>


      {/* MEMBERSHIP */}
      <section className="membership-section" id="membership">

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


        <div className="plans">

          {/* STARTER */}
          <div className="plan-card">

            <h3>Starter</h3>

            <div className="price">
              ₹1,999 <span>/mo</span>
            </div>

            <p>For getting started.</p>

            <ul>
              <li>Full gym access</li>
              <li>QR exercise guides</li>
              <li>Progress tracking</li>
              <li>AI fitness assistant</li>
            </ul>

            <button className="plan-button">
              Choose Starter
            </button>

          </div>


          {/* PRO */}
          <div className="plan-card popular">

            <div className="popular-badge">
              MOST POPULAR
            </div>

            <h3>Pro</h3>

            <div className="price">
              ₹2,999 <span>/mo</span>
            </div>

            <p>For serious progress.</p>

            <ul>
              <li>Everything in Starter</li>
              <li>Trainer guidance</li>
              <li>Nutrition guidance</li>
              <li>Advanced progress tracking</li>
            </ul>

            <button className="primary-button">
              Choose Pro
            </button>

          </div>


          {/* ELITE */}
          <div className="plan-card">

            <h3>Elite</h3>

            <div className="price">
              ₹4,999 <span>/mo</span>
            </div>

            <p>Maximum support.</p>

            <ul>
              <li>Everything in Pro</li>
              <li>Personal training</li>
              <li>Custom workout planning</li>
              <li>Priority support</li>
            </ul>

            <button className="plan-button">
              Choose Elite
            </button>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer id="contact">

        <div className="footer-logo">
          THE<span>LIFT</span>
        </div>

        <p>
          TRAIN HARD. LIVE STRONG.
        </p>

        <span>
          © 2026 The Lift. All rights reserved.
        </span>

      </footer>

    </main>
  );
}

export default Home;