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

    let foundMember = await Member.findOne({
      userId: member,
    });

    // Also allow actual Member ID
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
    const fats = Math.round(numericWeight * 0.8);

    const proteinCalories = protein * 4;
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
    // MEAL PLAN
    // ========================================

    let mealPlan;

    if (goal === "lose_weight") {
      mealPlan = [
        {
          meal: "Breakfast",
          foods: [
            "3 egg whites + 1 whole egg",
            "40g oats",
            "1 apple",
          ],
          calories: Math.round(dailyCalories * 0.25),
        },
        {
          meal: "Lunch",
          foods: [
            "150g grilled chicken",
            "100g cooked rice",
            "Mixed vegetables",
            "Curd",
          ],
          calories: Math.round(dailyCalories * 0.30),
        },
        {
          meal: "Evening Snack",
          foods: [
            "Greek yogurt",
            "10 almonds",
            "1 fruit",
          ],
          calories: Math.round(dailyCalories * 0.15),
        },
        {
          meal: "Dinner",
          foods: [
            "150g grilled chicken/fish",
            "100g cooked rice or 2 small rotis",
            "Large serving of vegetables",
          ],
          calories: Math.round(dailyCalories * 0.30),
        },
      ];
    } else if (goal === "build_muscle") {
      mealPlan = [
        {
          meal: "Breakfast",
          foods: [
            "3 whole eggs",
            "60g oats",
            "1 banana",
            "250ml milk",
          ],
          calories: Math.round(dailyCalories * 0.25),
        },
        {
          meal: "Lunch",
          foods: [
            "180g chicken",
            "150g cooked rice",
            "Mixed vegetables",
            "Curd",
          ],
          calories: Math.round(dailyCalories * 0.30),
        },
        {
          meal: "Evening Snack",
          foods: [
            "Protein shake",
            "1 banana",
            "20g peanut butter",
          ],
          calories: Math.round(dailyCalories * 0.15),
        },
        {
          meal: "Dinner",
          foods: [
            "180g chicken/fish/paneer",
            "150g cooked rice or 3 rotis",
            "Mixed vegetables",
          ],
          calories: Math.round(dailyCalories * 0.30),
        },
      ];
    } else if (goal === "gain_weight") {
      mealPlan = [
        {
          meal: "Breakfast",
          foods: [
            "4 whole eggs",
            "80g oats",
            "1 banana",
            "300ml milk",
          ],
          calories: Math.round(dailyCalories * 0.25),
        },
        {
          meal: "Lunch",
          foods: [
            "200g chicken/paneer",
            "200g cooked rice",
            "Vegetables",
            "Curd",
          ],
          calories: Math.round(dailyCalories * 0.30),
        },
        {
          meal: "Evening Snack",
          foods: [
            "Protein shake",
            "1 banana",
            "30g peanut butter",
            "Handful of nuts",
          ],
          calories: Math.round(dailyCalories * 0.15),
        },
        {
          meal: "Dinner",
          foods: [
            "200g chicken/paneer",
            "200g cooked rice or 3 rotis",
            "Vegetables",
          ],
          calories: Math.round(dailyCalories * 0.30),
        },
      ];
    } else {
      // Maintain weight
      mealPlan = [
        {
          meal: "Breakfast",
          foods: [
            "3 whole eggs",
            "50g oats",
            "1 banana",
            "250ml milk",
          ],
          calories: Math.round(dailyCalories * 0.25),
        },
        {
          meal: "Lunch",
          foods: [
            "150g chicken/paneer",
            "150g cooked rice",
            "Mixed vegetables",
            "Curd",
          ],
          calories: Math.round(dailyCalories * 0.30),
        },
        {
          meal: "Evening Snack",
          foods: [
            "Greek yogurt",
            "1 fruit",
            "15g almonds",
          ],
          calories: Math.round(dailyCalories * 0.15),
        },
        {
          meal: "Dinner",
          foods: [
            "150g chicken/fish/paneer",
            "150g cooked rice or 2 rotis",
            "Mixed vegetables",
          ],
          calories: Math.round(dailyCalories * 0.30),
        },
      ];
    }

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
          mealPlan,
        },
        {
          new: true,
          upsert: true,
        }
      );

    return res.status(200).json({
      message: "Nutrition plan created successfully",

      nutritionPlan: {
        ...nutritionPlan.toObject(),
        mealPlan,
      },
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
      member = await Member.findById(
        req.params.memberId
      );
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
    console.error(
      "GET NUTRITION ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to get nutrition plan",
    });
  }
});

module.exports = router;