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

  // ================= NUTRITION STATE =================
  const [showNutrition, setShowNutrition] = useState(false);
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutritionResult, setNutritionResult] = useState(null);

  const [nutritionForm, setNutritionForm] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "moderate",
    goal: "build_muscle",
  });

  const [showCalories, setShowCalories] = useState(false);
const [calorieResult, setCalorieResult] = useState(null);
  const [calorieForm, setCalorieForm] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "moderate",
    goal: "maintain",
  });

  // ================= TARGET WEIGHT STATE =================
  const [showTargetWeight, setShowTargetWeight] = useState(false);
  const [targetWeightLoading, setTargetWeightLoading] = useState(false);
  const [targetWeightData, setTargetWeightData] = useState(null);
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  // ================= PROGRESS TRACKING STATE =================
  const [showProgress, setShowProgress] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressHistory, setProgressHistory] = useState([]);
  const [progressWeight, setProgressWeight] = useState("");
  const [progressMeasurements, setProgressMeasurements] = useState({
    chest: "",
    waist: "",
    arms: "",
  });

  // ================= WORKOUT STATE =================
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [selectedWorkoutDay, setSelectedWorkoutDay] = useState("Push");

  const workoutPlans = {
    Push: [
      ["Bench Press", "4 × 8–10"],
      ["Incline Dumbbell Press", "3 × 10–12"],
      ["Shoulder Press", "3 × 8–10"],
      ["Lateral Raises", "3 × 12–15"],
      ["Triceps Pushdown", "3 × 10–12"],
    ],
    Pull: [
      ["Lat Pulldown", "4 × 8–12"],
      ["Barbell Row", "3 × 8–10"],
      ["Seated Cable Row", "3 × 10–12"],
      ["Face Pulls", "3 × 12–15"],
      ["Biceps Curls", "3 × 10–12"],
    ],
    Legs: [
      ["Squats", "4 × 6–10"],
      ["Romanian Deadlift", "3 × 8–10"],
      ["Leg Press", "3 × 10–12"],
      ["Leg Curl", "3 × 10–12"],
      ["Calf Raises", "4 × 12–15"],
    ],
    "Full Body": [
      ["Squats", "3 × 8–10"],
      ["Bench Press", "3 × 8–10"],
      ["Lat Pulldown", "3 × 10–12"],
      ["Shoulder Press", "3 × 10"],
      ["Plank", "3 × 30–60 sec"],
    ],
  };



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

    if (feature === "nutrition") {
      setNutritionResult(null);
      setShowNutritionForm(false);
      setShowNutrition(true);
    }
    if (feature === "calories") {
  setCalorieResult(null);
  setShowCalories(true);
}

    if (feature === "targetWeight") {
      setShowTargetWeight(true);
      loadTargetWeight();
    }

    if (feature === "workouts") {
      setSelectedWorkoutDay("Push");
      setShowWorkouts(true);
    }

    if (feature === "progress") {
      openProgress();
    }

  };

  const loadProgress = async () => {
    if (!user?.id) return;

    try {
      setProgressLoading(true);

      const saved = localStorage.getItem(`lift_progress_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProgressHistory(parsed);
        }
      }
    } catch (error) {
      console.error("Progress load error:", error);
    } finally {
      setProgressLoading(false);
    }
  };

  const openProgress = async () => {
    setProgressWeight("");
    setProgressMeasurements({
      chest: "",
      waist: "",
      arms: "",
    });
    await loadProgress();
    setShowProgress(true);
  };

  const saveProgressEntry = (e) => {
    e.preventDefault();

    const weight = Number(progressWeight);

    if (!weight || weight <= 0) {
      alert("Enter a valid weight.");
      return;
    }

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      weight,
      measurements: {
        chest: progressMeasurements.chest
          ? Number(progressMeasurements.chest)
          : null,
        waist: progressMeasurements.waist
          ? Number(progressMeasurements.waist)
          : null,
        arms: progressMeasurements.arms
          ? Number(progressMeasurements.arms)
          : null,
      },
    };

    const updated = [...progressHistory, entry].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setProgressHistory(updated);

    if (user?.id) {
      localStorage.setItem(
        `lift_progress_${user.id}`,
        JSON.stringify(updated)
      );
    }

    setProgressWeight("");
    setProgressMeasurements({
      chest: "",
      waist: "",
      arms: "",
    });
  };

  const deleteProgressEntry = (id) => {
    const updated = progressHistory.filter((entry) => entry.id !== id);
    setProgressHistory(updated);

    if (user?.id) {
      localStorage.setItem(
        `lift_progress_${user.id}`,
        JSON.stringify(updated)
      );
    }
  };

  const loadTargetWeight = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/members/user/${user.id}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load target weight");
      }

      const member = data.member;

      setTargetWeightData(member);
      setCurrentWeight(member.currentWeight || "");
      setTargetWeight(member.targetWeight || "");
    } catch (error) {
      console.error("Target weight load error:", error);
      alert(error.message || "Unable to load target weight.");
    }
  };

  const saveTargetWeight = async (e) => {
    e.preventDefault();

    const current = Number(currentWeight);
    const target = Number(targetWeight);

    if (!current || current <= 0 || !target || target <= 0) {
      alert("Enter valid current and target weights.");
      return;
    }

    try {
      setTargetWeightLoading(true);

      const response = await fetch(
        `http://localhost:5001/api/members/user/${user.id}/target-weight`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentWeight: current,
            targetWeight: target,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to save target weight"
        );
      }

      setTargetWeightData(data.member);
      setCurrentWeight(data.member.currentWeight);
      setTargetWeight(data.member.targetWeight);
    } catch (error) {
      console.error("Target weight save error:", error);
      alert(error.message || "Unable to save target weight.");
    } finally {
      setTargetWeightLoading(false);
    }
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setNutritionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createNutritionPlan = async (e) => {
    e.preventDefault();

    if (
      !nutritionForm.age ||
      !nutritionForm.height ||
      !nutritionForm.weight
    ) {
      alert("Please fill all nutrition details.");
      return;
    }

    if (!user?.id) {
      alert("Please login again.");
      return;
    }

    try {
      setNutritionLoading(true);

      const memberRes = await fetch(
        `http://localhost:5001/api/members/user/${user.id}`
      );

      const memberData = await memberRes.json();

      if (!memberRes.ok || !memberData?.member?._id) {
        throw new Error(
          memberData?.message || "Member profile not found"
        );
      }

      const response = await fetch(
        "http://localhost:5001/api/nutrition",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            member: memberData.member._id,
            age: nutritionForm.age,
            gender: nutritionForm.gender,
            height: nutritionForm.height,
            weight: nutritionForm.weight,
            activityLevel: nutritionForm.activityLevel,
            goal: nutritionForm.goal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to create nutrition plan"
        );
      }

      setNutritionResult(data.nutritionPlan);
      setShowNutritionForm(false);
    } catch (error) {
      console.error("Nutrition plan error:", error);
      alert(error.message || "Unable to create nutrition plan.");
    } finally {
      setNutritionLoading(false);
    }
  };

  const handleCalorieChange = (e) => {
    const { name, value } = e.target;
    setCalorieForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateCalories = (e) => {
    e.preventDefault();

    const age = Number(calorieForm.age);
    const height = Number(calorieForm.height);
    const weight = Number(calorieForm.weight);

    if (!age || age <= 0 || !height || height <= 0 || !weight || weight <= 0) {
      alert("Please enter valid age, height and weight.");
      return;
    }

    const bmr =
      10 * weight +
      6.25 * height -
      5 * age +
      (calorieForm.gender === "male" ? 5 : -161);

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    let calories =
      bmr * (activityMultipliers[calorieForm.activityLevel] || 1.55);

    if (calorieForm.goal === "lose_weight") calories -= 500;
    else if (calorieForm.goal === "gain_weight") calories += 300;
    else if (calorieForm.goal === "build_muscle") calories += 250;

    setCalorieResult(Math.max(1200, Math.round(calories)));
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

        <div
          className="member-feature-card large"
          onClick={() => handleFeatureClick("nutrition")}
          style={{ cursor: "pointer" }}
        >

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
            onClick={() => handleFeatureClick("nutrition")}
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
        <div
  className="member-feature-card"
  onClick={() => handleFeatureClick("calories")}
  style={{ cursor: "pointer" }}
>
  <div className="feature-card-top">
    <div className="big-icon">🔥</div>
    <span>03</span>
  </div>

  <h3>Daily Calories</h3>

  <p>
    Know how many calories you need every day
    according to your activity and goal.
  </p>

  <div
    className="feature-link"
    onClick={(e) => {
      e.stopPropagation();
      handleFeatureClick("calories");
    }}
  >
    Calculate Calories →
  </div>
</div>
        {/* 04 TARGET WEIGHT */}

<div
  className="member-feature-card"
  onClick={() => handleFeatureClick("targetWeight")}
  style={{ cursor: "pointer" }}
>
  <div className="feature-card-top">
    <div className="big-icon">
      🎯
    </div>

    <span>04</span>
  </div>

  <h3>Target Weight</h3>

  {targetWeightData?.targetWeight ? (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "24px",
        }}
      >
        <div>
          <span
            style={{
              color: "#888",
              fontSize: "13px",
            }}
          >
            CURRENT
          </span>

          <strong
            style={{
              display: "block",
              fontSize: "28px",
              marginTop: "5px",
            }}
          >
            {targetWeightData.currentWeight} kg
          </strong>
        </div>

        <div>
          <span
            style={{
              color: "#888",
              fontSize: "13px",
            }}
          >
            TARGET
          </span>

          <strong
            style={{
              display: "block",
              fontSize: "28px",
              marginTop: "5px",
            }}
          >
            {targetWeightData.targetWeight} kg
          </strong>
        </div>
      </div>

          <div
        className="feature-link"
        onClick={(e) => {
          e.stopPropagation();
          handleFeatureClick("targetWeight");
        }}
        style={{ marginTop: "22px" }}
      >
        Update Goal →
      </div>
    </>
  ) : (
    <>
      <p>
        Set your target weight and track how far
        you are from your goal.
      </p>

      <div
        className="feature-link"
        onClick={(e) => {
          e.stopPropagation();
          handleFeatureClick("targetWeight");
        }}
      >
        Set Your Goal →
      </div>
    </>
  )}
</div>



        {/* 05 WORKOUT */}

        <div
          className="member-feature-card"
          onClick={() => handleFeatureClick("workouts")}
          style={{ cursor: "pointer" }}
        >

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
            onClick={(e) => {
              e.stopPropagation();
              handleFeatureClick("workouts");
            }}
          >
            View Workouts →
          </div>

        </div>




        {/* 06 PROGRESS */}

        <div
          className="member-feature-card"
          onClick={() => handleFeatureClick("progress")}
          style={{ cursor: "pointer" }}
        >

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
            onClick={(e) => {
              e.stopPropagation();
              handleFeatureClick("progress");
            }}
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




    {/* ================= PROGRESS TRACKING ================= */}

    {showProgress && (
      <div
        onClick={() => setShowProgress(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "650px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "20px",
            padding: "40px",
            position: "relative",
            color: "white",
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => setShowProgress(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>

          <p className="section-label">PROGRESS TRACKING</p>

          <h2>
            Track your <span>progress.</span>
          </h2>

          <p>
            Log your weight and measurements to see how your body changes over
            time.
          </p>

          {(() => {
            const first = progressHistory[0];
            const latest = progressHistory[progressHistory.length - 1];

            const weightChange =
              first && latest
                ? Number((latest.weight - first.weight).toFixed(1))
                : 0;

            const target = Number(targetWeightData?.targetWeight);
            const latestWeight = latest?.weight;

            return (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginTop: "28px",
                  }}
                >
                  <div
                    style={{
                      padding: "18px",
                      background: "#181818",
                      border: "1px solid #333",
                      borderRadius: "12px",
                    }}
                  >
                    <span style={{ color: "#888", fontSize: "12px" }}>
                      CURRENT
                    </span>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "26px",
                        marginTop: "6px",
                      }}
                    >
                      {latestWeight ? `${latestWeight} kg` : "—"}
                    </strong>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      background: "#181818",
                      border: "1px solid #333",
                      borderRadius: "12px",
                    }}
                  >
                    <span style={{ color: "#888", fontSize: "12px" }}>
                      TARGET
                    </span>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "26px",
                        marginTop: "6px",
                      }}
                    >
                      {target ? `${target} kg` : "—"}
                    </strong>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      background: "#181818",
                      border: "1px solid #333",
                      borderRadius: "12px",
                    }}
                  >
                    <span style={{ color: "#888", fontSize: "12px" }}>
                      CHANGE
                    </span>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "26px",
                        marginTop: "6px",
                      }}
                    >
                      {progressHistory.length > 1
                        ? `${weightChange > 0 ? "+" : ""}${weightChange} kg`
                        : "—"}
                    </strong>
                  </div>
                </div>

                <form
                  onSubmit={saveProgressEntry}
                  style={{ marginTop: "28px" }}
                >
                  <h3 style={{ marginBottom: "16px" }}>Add Progress</h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                    }}
                  >
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
                          fontSize: "16px",
                        }}
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="e.g. 72.5"
                        value={progressWeight}
                        onChange={(e) => setProgressWeight(e.target.value)}
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>CHEST (CM)</label>
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
                          fontSize: "16px",
                        }}
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="Optional"
                        value={progressMeasurements.chest}
                        onChange={(e) =>
                          setProgressMeasurements((prev) => ({
                            ...prev,
                            chest: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="input-group">
                      <label>WAIST (CM)</label>
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
                          fontSize: "16px",
                        }}
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="Optional"
                        value={progressMeasurements.waist}
                        onChange={(e) =>
                          setProgressMeasurements((prev) => ({
                            ...prev,
                            waist: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="input-group">
                      <label>ARMS (CM)</label>
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
                          fontSize: "16px",
                        }}
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="Optional"
                        value={progressMeasurements.arms}
                        onChange={(e) =>
                          setProgressMeasurements((prev) => ({
                            ...prev,
                            arms: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <button
                    className="primary-btn"
                    type="submit"
                    style={{ marginTop: "22px" }}
                  >
                    SAVE PROGRESS →
                  </button>
                </form>

                <div style={{ marginTop: "30px" }}>
                  <h3 style={{ marginBottom: "14px" }}>Progress History</h3>

                  {progressHistory.length === 0 ? (
                    <div
                      style={{
                        padding: "20px",
                        background: "#181818",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        color: "#888",
                      }}
                    >
                      No progress entries yet. Add your first check-in above.
                    </div>
                  ) : (
                    [...progressHistory]
                      .reverse()
                      .map((entry) => (
                        <div
                          key={entry.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "16px",
                            padding: "16px 18px",
                            background: "#181818",
                            border: "1px solid #333",
                            borderRadius: "12px",
                            marginBottom: "10px",
                          }}
                        >
                          <div>
                            <strong>{entry.weight} kg</strong>
                            <div
                              style={{
                                color: "#777",
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              {new Date(entry.date).toLocaleDateString()}
                              {entry.measurements?.chest
                                ? ` • Chest ${entry.measurements.chest} cm`
                                : ""}
                              {entry.measurements?.waist
                                ? ` • Waist ${entry.measurements.waist} cm`
                                : ""}
                              {entry.measurements?.arms
                                ? ` • Arms ${entry.measurements.arms} cm`
                                : ""}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteProgressEntry(entry.id)}
                            style={{
                              background: "transparent",
                              border: "1px solid #444",
                              borderRadius: "8px",
                              color: "#aaa",
                              padding: "8px 10px",
                              cursor: "pointer",
                            }}
                          >
                            DELETE
                          </button>
                        </div>
                      ))
                  )}
                </div>

                <button
                  type="button"
                  className="secondary-btn"
                  style={{ marginTop: "12px" }}
                  onClick={() => setShowProgress(false)}
                >
                  DONE
                </button>
              </>
            );
          })()}
        </div>
      </div>
    )}

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

    {/* ================= DAILY CALORIES ================= */}

    {showCalories && (
      <div
        onClick={() => setShowCalories(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "550px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "20px",
            padding: "40px",
            position: "relative",
            color: "white",
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => setShowCalories(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>

          <p className="section-label">DAILY CALORIES</p>

          <h2>
            Know your <span>calorie needs.</span>
          </h2>

          <p>
            Calculate how many calories you need each day based on your
            body, activity level and fitness goal.
          </p>

          {calorieResult !== null ? (
            <div style={{ marginTop: "28px" }}>
              <div
                style={{
                  padding: "28px",
                  background: "#181818",
                  border: "1px solid #333",
                  borderRadius: "14px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color: "#aaa",
                    fontSize: "13px",
                    letterSpacing: "1px",
                  }}
                >
                  DAILY CALORIE REQUIREMENT
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "52px",
                    marginTop: "10px",
                  }}
                >
                  {calorieResult}
                </strong>

                <span style={{ color: "#aaa" }}>kcal / day</span>
              </div>

              <button
                type="button"
                className="secondary-btn"
                style={{ marginTop: "20px" }}
                onClick={() => setCalorieResult(null)}
              >
                CALCULATE AGAIN
              </button>
            </div>
          ) : (
            <form onSubmit={calculateCalories} style={{ marginTop: "28px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="input-group">
                  <label>AGE</label>
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
                      fontSize: "16px",
                    }}
                    type="number"
                    min="1"
                    max="120"
                    name="age"
                    placeholder="e.g. 22"
                    value={calorieForm.age}
                    onChange={handleCalorieChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>GENDER</label>
                  <select
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      marginTop: "8px",
                      padding: "14px 16px",
                      background: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "16px",
                    }}
                    name="gender"
                    value={calorieForm.gender}
                    onChange={handleCalorieChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

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
                      fontSize: "16px",
                    }}
                    type="number"
                    min="1"
                    name="height"
                    placeholder="e.g. 175"
                    value={calorieForm.height}
                    onChange={handleCalorieChange}
                    required
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
                      fontSize: "16px",
                    }}
                    type="number"
                    min="1"
                    step="0.1"
                    name="weight"
                    placeholder="e.g. 70"
                    value={calorieForm.weight}
                    onChange={handleCalorieChange}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: "18px" }}>
                <label>ACTIVITY LEVEL</label>
                <select
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "8px",
                    padding: "14px 16px",
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "16px",
                  }}
                  name="activityLevel"
                  value={calorieForm.activityLevel}
                  onChange={handleCalorieChange}
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>

              <div style={{ marginTop: "18px" }}>
                <label>FITNESS GOAL</label>
                <select
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "8px",
                    padding: "14px 16px",
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "16px",
                  }}
                  name="goal"
                  value={calorieForm.goal}
                  onChange={handleCalorieChange}
                >
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain_weight">Gain Weight</option>
                  <option value="build_muscle">Build Muscle</option>
                </select>
              </div>

              <button
                className="primary-btn"
                type="submit"
                style={{ marginTop: "26px" }}
              >
                CALCULATE CALORIES →
              </button>
            </form>
          )}
        </div>
      </div>
    )}

    {/* ================= TARGET WEIGHT ================= */}

    {showTargetWeight && (
      <div
        onClick={() => setShowTargetWeight(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "550px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "20px",
            padding: "40px",
            position: "relative",
            color: "white",
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => setShowTargetWeight(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>

          <p className="section-label">TARGET WEIGHT</p>

          <h2>
            Set your <span>goal.</span>
          </h2>

          <p>
            Set your current weight and target weight to track how
            close you are to your goal.
          </p>

          {targetWeightData?.targetWeight ? (
            <>
              <div
                style={{
                  marginTop: "28px",
                  padding: "24px",
                  background: "#181818",
                  border: "1px solid #333",
                  borderRadius: "14px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "18px",
                  }}
                >
                  <div>
                    <span style={{ color: "#888" }}>CURRENT</span>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "32px",
                        marginTop: "6px",
                      }}
                    >
                      {targetWeightData.currentWeight} kg
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: "#888" }}>TARGET</span>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "32px",
                        marginTop: "6px",
                      }}
                    >
                      {targetWeightData.targetWeight} kg
                    </strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  color: "#aaa",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                {Math.abs(
                  Number(targetWeightData.targetWeight) -
                  Number(targetWeightData.currentWeight)
                )} kg to go
              </div>

              <button
                type="button"
                className="secondary-btn"
                style={{ marginTop: "20px" }}
                onClick={() => {
                  setTargetWeightData(null);
                }}
              >
                UPDATE GOAL
              </button>
            </>
          ) : (
            <form onSubmit={saveTargetWeight} style={{ marginTop: "28px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="input-group">
                  <label>CURRENT WEIGHT (KG)</label>
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
                      fontSize: "16px",
                    }}
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder="e.g. 75"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>TARGET WEIGHT (KG)</label>
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
                      fontSize: "16px",
                    }}
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder="e.g. 68"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                className="primary-btn"
                type="submit"
                disabled={targetWeightLoading}
                style={{
                  marginTop: "26px",
                  opacity: targetWeightLoading ? 0.7 : 1,
                  cursor: targetWeightLoading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {targetWeightLoading
                  ? "SAVING..."
                  : "SET TARGET →"}
              </button>
            </form>
          )}
        </div>
      </div>
    )}

    {/* ================= NUTRITION PLAN ================= */}

    {showNutrition && (
      <div
        onClick={() => setShowNutrition(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "20px",
            padding: "40px",
            position: "relative",
            color: "white",
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => setShowNutrition(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>

          <p className="section-label">NUTRITION PLAN</p>

          <h2>
            Fuel your <span>progress.</span>
          </h2>

          <p>
            Create a personalized nutrition plan based on your body,
            activity level and fitness goal.
          </p>

          {nutritionResult ? (
            <div style={{ marginTop: "28px" }}>
              <div
                style={{
                  padding: "24px",
                  background: "#181818",
                  border: "1px solid #333",
                  borderRadius: "14px",
                  marginBottom: "18px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#aaa",
                    fontSize: "13px",
                    letterSpacing: "1px",
                  }}
                >
                  DAILY TARGET
                </p>

                <strong
                  style={{
                    display: "block",
                    fontSize: "42px",
                    marginTop: "8px",
                  }}
                >
                  {nutritionResult.dailyCalories}
                </strong>

                <span style={{ color: "#aaa" }}>kcal / day</span>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >
                  <div>
                    <strong>{nutritionResult.protein}g</strong>
                    <br />
                    <span style={{ color: "#888" }}>Protein</span>
                  </div>

                  <div>
                    <strong>{nutritionResult.carbs}g</strong>
                    <br />
                    <span style={{ color: "#888" }}>Carbs</span>
                  </div>

                  <div>
                    <strong>{nutritionResult.fats}g</strong>
                    <br />
                    <span style={{ color: "#888" }}>Fats</span>
                  </div>
                </div>
              </div>

              <h3 style={{ marginBottom: "14px" }}>
                Your Meal Plan
              </h3>

              {Array.isArray(nutritionResult.mealPlan) &&
              nutritionResult.mealPlan.length > 0 ? (
                nutritionResult.mealPlan.map((meal, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "20px",
                      background: "#181818",
                      border: "1px solid #333",
                      borderRadius: "14px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "14px",
                        gap: "12px",
                      }}
                    >
                      <strong style={{ fontSize: "18px" }}>
                        {meal.meal}
                      </strong>

                      <span style={{ color: "#b6ff00" }}>
                        {meal.calories} kcal
                      </span>
                    </div>

                    {Array.isArray(meal.foods) &&
                      meal.foods.map((food, foodIndex) => (
                        <div
                          key={foodIndex}
                          style={{
                            padding: "9px 0",
                            borderBottom:
                              foodIndex !== meal.foods.length - 1
                                ? "1px solid #292929"
                                : "none",
                            color: "#ccc",
                          }}
                        >
                          • {food}
                        </div>
                      ))}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "18px",
                    background: "#181818",
                    border: "1px solid #333",
                    borderRadius: "14px",
                    color: "#aaa",
                  }}
                >
                  Meal plan data is not available.
                </div>
              )}

              <button
                type="button"
                className="primary-btn"
                style={{ marginTop: "12px" }}
                onClick={() => {
                  setNutritionResult(null);
                  setShowNutrition(false);
                }}
              >
                DONE →
              </button>
            </div>
          ) : !showNutritionForm ? (
            <div style={{ marginTop: "30px" }}>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setShowNutritionForm(true)}
              >
                CREATE NUTRITION PLAN →
              </button>
            </div>
          ) : (
            <form
              onSubmit={createNutritionPlan}
              style={{ marginTop: "28px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="input-group">
                  <label>AGE</label>
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
                      fontSize: "16px",
                    }}
                    type="number"
                    min="1"
                    max="120"
                    name="age"
                    placeholder="e.g. 22"
                    value={nutritionForm.age}
                    onChange={handleNutritionChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>GENDER</label>
                  <select
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      marginTop: "8px",
                      padding: "14px 16px",
                      background: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "16px",
                    }}
                    name="gender"
                    value={nutritionForm.gender}
                    onChange={handleNutritionChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

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
                      fontSize: "16px",
                    }}
                    type="number"
                    min="1"
                    name="height"
                    placeholder="e.g. 175"
                    value={nutritionForm.height}
                    onChange={handleNutritionChange}
                    required
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
                      fontSize: "16px",
                    }}
                    type="number"
                    min="1"
                    name="weight"
                    placeholder="e.g. 70"
                    value={nutritionForm.weight}
                    onChange={handleNutritionChange}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: "18px" }}>
                <label>ACTIVITY LEVEL</label>
                <select
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "8px",
                    padding: "14px 16px",
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "16px",
                  }}
                  name="activityLevel"
                  value={nutritionForm.activityLevel}
                  onChange={handleNutritionChange}
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>

              <div style={{ marginTop: "18px" }}>
                <label>FITNESS GOAL</label>
                <select
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "8px",
                    padding: "14px 16px",
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "16px",
                  }}
                  name="goal"
                  value={nutritionForm.goal}
                  onChange={handleNutritionChange}
                >
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain_weight">Gain Weight</option>
                  <option value="build_muscle">Build Muscle</option>
                </select>
              </div>

              <button
                className="primary-btn"
                type="submit"
                disabled={nutritionLoading}
                style={{
                  marginTop: "26px",
                  opacity: nutritionLoading ? 0.7 : 1,
                  cursor: nutritionLoading ? "not-allowed" : "pointer",
                }}
              >
                {nutritionLoading
                  ? "CREATING..."
                  : "GENERATE MY PLAN →"}
              </button>
            </form>
          )}
        </div>
      </div>
    )}


    {/* ================= WORKOUT PLANS ================= */}

    {showWorkouts && (
      <div
        onClick={() => setShowWorkouts(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "620px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "20px",
            padding: "40px",
            position: "relative",
            color: "white",
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => setShowWorkouts(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>

          <p className="section-label">WORKOUT PLANS</p>

          <h2>
            Train with <span>purpose.</span>
          </h2>

          <p>
            Follow a structured workout built around your training goals.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
              marginTop: "28px",
            }}
          >
            {Object.keys(workoutPlans).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedWorkoutDay(day)}
                style={{
                  padding: "12px 8px",
                  borderRadius: "10px",
                  border:
                    selectedWorkoutDay === day
                      ? "1px solid #b6ff00"
                      : "1px solid #333",
                  background:
                    selectedWorkoutDay === day ? "#1b260d" : "#181818",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "22px" }}>
            {workoutPlans[selectedWorkoutDay].map(([exercise, sets], index) => (
              <div
                key={exercise}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "17px 18px",
                  background: "#181818",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <span
                    style={{
                      color: "#777",
                      fontSize: "12px",
                      marginRight: "10px",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{exercise}</strong>
                </div>

                <span style={{ color: "#b6ff00", whiteSpace: "nowrap" }}>
                  {sets}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="primary-btn"
            style={{ marginTop: "14px" }}
            onClick={() => setShowWorkouts(false)}
          >
            DONE →
          </button>
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