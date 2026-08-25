const express = require("express");
const NutritionPlan = require("../models/NutritionPlan");
const Member = require("../models/Member");

const router = express.Router();

// ========================================
// CREATE / UPDATE NUTRITION PLAN
// POST /api/nutrition
// ========================================

router.post("/", async (req, res) => {
  try {
    const {
      member,
      age,
      gender,
      height,
      weight,
      activityLevel,
      goal,
    } = req.body;

    if (
      !member ||
      !age ||
      !gender ||
      !height ||
      !weight ||
      !activityLevel ||
      !goal
    ) {
      return res.status(400).json({
        message: "All nutrition details are required",
      });
    }

    // ========================================
    // FIND MEMBER
    // ========================================

    // Frontend sends logged-in USER ID.
    // Member model stores that ID inside userId.
    let foundMember = await Member.findOne({
      userId: member,
    });

    // Also allow actual Member ID
    // This makes the route work with either ID.
    if (!foundMember) {
      foundMember = await Member.findById(member);
    }

    if (!foundMember) {
      return res.status(404).json({
        message: "Member profile not found",
      });
    }

    // ========================================
    // BMR CALCULATION
    // ========================================

    let bmr;

    if (gender === "male") {
      bmr =
        10 * Number(weight) +
        6.25 * Number(height) -
        5 * Number(age) +
        5;
    } else {
      bmr =
        10 * Number(weight) +
        6.25 * Number(height) -
        5 * Number(age) -
        161;
    }

    // ========================================
    // ACTIVITY MULTIPLIER
    // ========================================

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const multiplier = activityMultipliers[activityLevel];

    if (!multiplier) {
      return res.status(400).json({
        message: "Invalid activity level",
      });
    }

    let dailyCalories = bmr * multiplier;

    // ========================================
    // GOAL ADJUSTMENT
    // ========================================

    if (goal === "lose_weight") {
      dailyCalories -= 400;
    }

    if (goal === "gain_weight") {
      dailyCalories += 300;
    }

    if (goal === "build_muscle") {
      dailyCalories += 250;
    }

    dailyCalories = Math.round(dailyCalories);

    // ========================================
    // MACROS
    // ========================================

    const numericWeight = Number(weight);

    const protein = Math.round(numericWeight * 1.6);
    const proteinCalories = protein * 4;

    const fats = Math.round(numericWeight * 0.8);
    const fatCalories = fats * 9;

    const remainingCalories =
      dailyCalories -
      proteinCalories -
      fatCalories;

    const carbs = Math.max(
      0,
      Math.round(remainingCalories / 4)
    );

    // ========================================
    // SAVE / UPDATE PLAN
    // ========================================

    const nutritionPlan =
      await NutritionPlan.findOneAndUpdate(
        {
          member: foundMember._id,
        },
        {
          member: foundMember._id,
          age: Number(age),
          gender,
          height: Number(height),
          weight: Number(weight),
          activityLevel,
          goal,
          dailyCalories,
          protein,
          carbs,
          fats,
        },
        {
          new: true,
          upsert: true,
        }
      );

    return res.status(200).json({
      message: "Nutrition plan created successfully",
      nutritionPlan,
    });
  } catch (error) {
    console.error("NUTRITION ERROR:", error);

    return res.status(500).json({
      message: "Unable to create nutrition plan",
      error: error.message,
    });
  }
});

// ========================================
// GET MEMBER NUTRITION PLAN
// GET /api/nutrition/:memberId
// ========================================

router.get("/:memberId", async (req, res) => {
  try {
    let member = await Member.findOne({
      userId: req.params.memberId,
    });

    if (!member) {
      member = await Member.findById(req.params.memberId);
    }

    if (!member) {
      return res.status(404).json({
        message: "Member profile not found",
      });
    }

    const nutritionPlan =
      await NutritionPlan.findOne({
        member: member._id,
      });

    if (!nutritionPlan) {
      return res.status(404).json({
        message: "Nutrition plan not found",
      });
    }

    return res.json({
      nutritionPlan,
    });
  } catch (error) {
    console.error("GET NUTRITION ERROR:", error);

    return res.status(500).json({
      message: "Unable to get nutrition plan",
      error: error.message,
    });
  }
});

module.exports = router;