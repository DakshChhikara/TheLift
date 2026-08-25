import { useEffect, useState } from "react";
import "./home.css";
function Home({
  user,
  onLoginRequired,
  onLogout
}) {

  const isLoggedIn = !!user;
  const [insideMembers, setInsideMembers] = useState(0);
const capacity = 80;

  const [showBMI, setShowBMI] = useState(false);
  const [bmiHeight, setBmiHeight] = useState("");
  const [bmiWeight, setBmiWeight] = useState("");
  const [bmiResult, setBmiResult] = useState(null);

useEffect(() => {
  const fetchCapacity = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/attendance/today");
      const data = await res.json();

      setInsideMembers(Number(data.inside || 0));
    } catch (error) {
      console.error("Capacity fetch error:", error);
    }
  };

  fetchCapacity();

  const interval = setInterval(fetchCapacity, 5000);

  return () => clearInterval(interval);
}, []);


  const handleFeatureClick = (feature) => {

    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (feature === "bmi") {
      setBmiHeight("");
      setBmiWeight("");
      setBmiResult(null);
      setShowBMI(true);
    }

  };

  const calculateBMI = () => {
    const height = Number(bmiHeight);
    const weight = Number(bmiWeight);

    if (!height || !weight || height <= 0 || weight <= 0) {
      setBmiResult({
        value: null,
        message: "Enter a valid height and weight."
      });
      return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBMI = Number(bmi.toFixed(1));

    let category = "Normal weight";

    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi < 30) {
      category = "Overweight";
    } else {
      category = "Obesity";
    }

    setBmiResult({
      value: roundedBMI,
      message: category
    });
  };


  return (

    <div className="home">


      {/* ================= NAVBAR ================= */}

      <nav className="navbar">


        <div className="logo">
          THE<span>LIFT</span>
        </div>



        <div className="nav-links">

          <a href="#features">
            Features
          </a>

          <a href="#experience">
            Experience
          </a>

          <a href="#membership">
            Membership
          </a>

          <a href="#contact">
            Contact
          </a>

        </div>



        <div>

          {isLoggedIn ? (

            <button
              className="nav-btn"
              onClick={onLogout}
            >
              Logout
            </button>

          ) : (

            <button
              className="nav-btn"
              onClick={onLoginRequired}
            >
              Join The Lift <span>↗</span>
            </button>

          )}

        </div>


      </nav>




      {/* ================= HERO ================= */}


      <section
        className="hero"
        id="experience"
      >


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

            <span>
              DIFFERENT.
            </span>

          </h1>



          <p className="hero-description">

            The Lift is a modern training space built around
            serious workouts, smarter guidance and a better
            member experience.

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

            <h3>
              Gym Capacity
            </h3>

          </div>

          <p>
            Updated just now
          </p>

        </div>


        {isLoggedIn ? (

          <>

<div className="capacity-number">
  {insideMembers} <small>/{capacity} people</small>
</div>


            <div className="capacity-bar">
  <div
    style={{
      width: `${(insideMembers / capacity) * 100}%`,
    }}
  ></div>
</div>


            <p className="available">
  {capacity - insideMembers} spots available right now
</p>



            <div className="capacity-grid">


              <div>
                <strong>
                  8/10
                </strong>

                <span>
                  Gym Rating
                </span>
              </div>



              <div>

                <strong>
                  24/7
                </strong>

                <span>
                  Access Available
                </span>

              </div>



              <div>

                <strong>
                  12
                </strong>

                <span>
                  Expert Trainers
                </span>

              </div>



              <div>

                <strong>
                  500+
                </strong>

                <span>
                  Active Members
                </span>

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


            <button
              onClick={onLoginRequired}
            >
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

          <h3>
            Premium Equipment
          </h3>

          <p>
            Train with quality equipment.
          </p>

        </div>


      </div>



      <div className="feature">

        <div className="feature-icon">
          □
        </div>


        <div>

          <h3>
            Smart Workouts
          </h3>

          <p>
            Structured programs for every goal.
          </p>

        </div>


      </div>



      <div className="feature">

        <div className="feature-icon">
          ♧
        </div>


        <div>

          <h3>
            Expert Guidance
          </h3>

          <p>
            Get better with the right guidance.
          </p>

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

            <span>
              01
            </span>

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

        <div
  className="member-feature-card"
  onClick={() => handleFeatureClick("bmi")}
  style={{ cursor: "pointer" }}
>
  <div className="feature-card-top">
    <div className="big-icon">
      ◉
    </div>

    <span>
      02
    </span>
  </div>

  <h3>
    BMI Calculator
  </h3>

  <p>
    Understand your current body status
    using your height and weight.
  </p>

  <div className="feature-link">
    Calculate BMI →
  </div>
</div>




        {/* 03 CALORIES */}

        <div className="member-feature-card">

          <div className="feature-card-top">

            <div className="big-icon">
              🔥
            </div>

            <span>
              03
            </span>

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

            <span>
              04
            </span>

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

            <span>
              05
            </span>

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

            <span>
              06
            </span>

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
        Simple memberships built for beginners,
        regular lifters and people who are ready to go all in.
      </p>


      <div className="membership-grid">


        <div className="membership-card">

          <h3>
            Starter
          </h3>

          <div className="price">
            ₹1,999 <span>/mo</span>
          </div>

          <p>
            For getting started.
          </p>

          <button
            className="secondary-btn"
            onClick={handleFeatureClick}
          >
            Choose Starter
          </button>

        </div>




        <div className="membership-card popular">

          <div className="popular-badge">
            MOST POPULAR
          </div>

          <h3>
            Pro
          </h3>

          <div className="price">
            ₹2,999 <span>/mo</span>
          </div>

          <p>
            For serious progress.
          </p>


          <button
            className="primary-btn"
            onClick={handleFeatureClick}
          >
            Choose Pro
          </button>

        </div>




        <div className="membership-card">

          <h3>
            Elite
          </h3>

          <div className="price">
            ₹4,999 <span>/mo</span>
          </div>

          <p>
            Maximum support.
          </p>


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
        <span>
          train different?
        </span>
      </h2>


      <p>
        Have a question about memberships,
        training or anything else?
        Talk to The Lift team.
      </p>


      <button className="primary-btn">
        Contact The Lift →
      </button>


    </section>




    {/* ================= FOOTER ================= */}


    {showBMI && (
      <div
        onClick={() => setShowBMI(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "550px",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "20px",
            padding: "40px",
            position: "relative",
            color: "white",
            boxSizing: "border-box"
          }}
        >
          <button
            onClick={() => setShowBMI(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: 1
            }}
          >
            ×
          </button>

          <p className="section-label">BMI CALCULATOR</p>
          <h2>Know your <span>numbers.</span></h2>
          <p>Enter your height and weight to calculate your BMI.</p>

          <div
            className="bmi-inputs"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              margin: "28px 0"
            }}
          >
            <div className="input-group">
              <label>HEIGHT (CM)</label>
              <input
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  marginTop: "8px",
                  padding: "14px 16px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "16px"
                }}
                type="number"
                min="1"
                placeholder="e.g. 175"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>WEIGHT (KG)</label>
              <input
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  marginTop: "8px",
                  padding: "14px 16px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "16px"
                }}
                type="number"
                min="1"
                placeholder="e.g. 70"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(e.target.value)}
              />
            </div>
          </div>

          <button className="primary-btn" onClick={calculateBMI}>
            CALCULATE BMI →
          </button>

          {bmiResult && (
            <div
              className="bmi-result"
              style={{
                marginTop: "24px",
                padding: "20px",
                background: "#181818",
                border: "1px solid #333",
                borderRadius: "12px",
                textAlign: "center"
              }}
            >
              {bmiResult.value !== null ? (
                <>
                  <span>Your BMI</span>
                  <strong>{bmiResult.value}</strong>
                  <p>{bmiResult.message}</p>
                </>
              ) : (
                <p>{bmiResult.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    )}

    <footer>

      <div>
  <span style={{ color: "white" }}>THE</span>
  <span>LIFT</span>
</div>


      <p>
        © 2026 THE LIFT — POWERED BY FITFLOW
      </p>


    </footer>


  </div>

  );

}


export default Home;