const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    // Link this member profile to the login user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    plan: {
      type: String,
      enum: ["Starter", "Pro", "Elite"],
      default: "Starter",
    },

    feesPaid: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Expired", "Inactive"],
      default: "Active",
    },

    membershipStart: {
      type: Date,
      default: Date.now,
    },

    membershipExpiry: {
      type: Date,
    },

    currentlyInside: {
      type: Boolean,
      default: false,
    },

    // ================================
    // WEIGHT / TARGET WEIGHT
    // ================================

    startingWeight: {
      type: Number,
      default: null,
    },

    currentWeight: {
      type: Number,
      default: null,
    },

    targetWeight: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);