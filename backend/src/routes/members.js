const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");
const Member = require("../models/Member");

const router = express.Router();

// ========================================
// ADD NEW MEMBER
// POST /api/members
// ========================================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      plan,
      feesPaid,
      membershipStart,
      membershipExpiry,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email and phone are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    // Generate temporary password
    const temporaryPassword = crypto
      .randomBytes(4)
      .toString("hex");

    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    // Create login account
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "member",
    });

    try {
      // Create member profile
      const member = await Member.create({
        userId: user._id,
        name,
        email: normalizedEmail,
        phone,
        plan: plan || "Starter",
        feesPaid: feesPaid || 0,
        membershipStart:
          membershipStart || new Date(),
        membershipExpiry,
        status: "Active",

        // Weight fields initially empty
        startingWeight: null,
        currentWeight: null,
        targetWeight: null,
      });

      return res.status(201).json({
        message: "Member created successfully",

        credentials: {
          email: normalizedEmail,
          temporaryPassword,
        },

        member,
      });
    } catch (error) {
      // Roll back User if Member creation fails
      await User.findByIdAndDelete(user._id);

      throw error;
    }
  } catch (error) {
    console.error("Add member error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ========================================
// GET MEMBER BY USER ID
// GET /api/members/user/:userId
// ========================================

router.get("/user/:userId", async (req, res) => {
  try {
    const member = await Member.findOne({
      userId: req.params.userId,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member profile not found",
      });
    }

    return res.json({
      member,
    });
  } catch (error) {
    console.error(
      "Get member by user ID error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ========================================
// SET / UPDATE TARGET WEIGHT
// PATCH /api/members/user/:userId/target-weight
// ========================================

router.patch(
  "/user/:userId/target-weight",
  async (req, res) => {
    try {
      const {
        targetWeight,
        currentWeight,
      } = req.body;

      // Validate target weight
      if (
        targetWeight === undefined ||
        targetWeight === null ||
        Number(targetWeight) <= 0
      ) {
        return res.status(400).json({
          message: "Valid target weight is required",
        });
      }

      // Find member using logged-in user's ID
      const member = await Member.findOne({
        userId: req.params.userId,
      });

      if (!member) {
        return res.status(404).json({
          message: "Member profile not found",
        });
      }

      const newTargetWeight = Number(targetWeight);

      // If frontend sends current weight,
      // update current weight too.
      if (
        currentWeight !== undefined &&
        currentWeight !== null &&
        Number(currentWeight) > 0
      ) {
        const newCurrentWeight = Number(currentWeight);

        member.currentWeight = newCurrentWeight;

        // Set starting weight only once
        if (
          member.startingWeight === null ||
          member.startingWeight === undefined
        ) {
          member.startingWeight = newCurrentWeight;
        }
      }

      member.targetWeight = newTargetWeight;

      await member.save();

      return res.json({
        message: "Target weight updated successfully",
        member,
      });
    } catch (error) {
      console.error(
        "Target weight update error:",
        error
      );

      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// ========================================
// GET ALL MEMBERS
// GET /api/members
// ========================================

router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({
      createdAt: -1,
    });

    return res.json({
      members,
    });
  } catch (error) {
    console.error(
      "Get members error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ========================================
// DELETE MEMBER
// DELETE /api/members/:id
// ========================================

router.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findById(
      req.params.id
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Delete login account
    if (member.userId) {
      await User.findByIdAndDelete(
        member.userId
      );
    }

    // Delete member profile
    await Member.findByIdAndDelete(
      req.params.id
    );

    return res.json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete member error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;