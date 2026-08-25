const mongoose = require("mongoose");

const nutritionPlanSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      unique: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },

    height: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    activityLevel: {
      type: String,
      required: true,
      enum: [
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
      ],
    },

    goal: {
      type: String,
      required: true,
      enum: [
        "lose_weight",
        "maintain_weight",
        "gain_weight",
        "build_muscle",
      ],
    },

    dailyCalories: {
      type: Number,
      required: true,
    },

    protein: {
      type: Number,
      required: true,
    },

    carbs: {
      type: Number,
      required: true,
    },

    fats: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "NutritionPlan",
  nutritionPlanSchema
);