const express = require("express");
const Attendance = require("../models/Attendance");
const Member = require("../models/Member");

const router = express.Router();

const CAPACITY = 80;

// ========================================
// CHECK IN MEMBER
// ========================================

router.post("/checkin", async (req, res) => {
  try {
    const { member } = req.body;

    if (!member) {
      return res.status(400).json({
        message: "Member id required",
      });
    }

    const foundMember = await Member.findById(member);

    if (!foundMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // IMPORTANT:
    // Prevent duplicate check-in
    if (foundMember.currentlyInside) {
      return res.status(400).json({
        message: "Member is already checked in",
      });
    }

    // Check capacity
    const insideCount = await Member.countDocuments({
      currentlyInside: true,
    });

    if (insideCount >= CAPACITY) {
      return res.status(400).json({
        message: "Gym capacity is full",
      });
    }

    // Mark member as inside
    foundMember.currentlyInside = true;
    await foundMember.save();

    // Create attendance record
    const attendance = await Attendance.create({
      member: foundMember._id,
      status: "Present",
    });

    res.status(201).json({
      message: "Member checked in successfully",
      member: foundMember,
      attendance,
      inside: insideCount + 1,
      capacity: CAPACITY,
      available: CAPACITY - (insideCount + 1),
    });
  } catch (error) {
    console.error("Check-in error:", error);

    res.status(500).json({
      message: "Unable to check in member",
      error: error.message,
    });
  }
});

// ========================================
// CHECK OUT MEMBER
// ========================================

router.post("/checkout", async (req, res) => {
  try {
    const { member } = req.body;

    if (!member) {
      return res.status(400).json({
        message: "Member id required",
      });
    }

    const foundMember = await Member.findById(member);

    if (!foundMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    if (!foundMember.currentlyInside) {
      return res.status(400).json({
        message: "Member is not currently inside",
      });
    }

    // Mark member as outside
    foundMember.currentlyInside = false;
    await foundMember.save();

    const insideCount = await Member.countDocuments({
      currentlyInside: true,
    });

    res.json({
      message: "Member checked out successfully",
      member: foundMember,
      inside: insideCount,
      capacity: CAPACITY,
      available: CAPACITY - insideCount,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    res.status(500).json({
      message: "Unable to check out member",
      error: error.message,
    });
  }
});

// ========================================
// GET CURRENT GYM CAPACITY
// ========================================

router.get("/today", async (req, res) => {
  try {
    const insideCount = await Member.countDocuments({
      currentlyInside: true,
    });

    res.json({
      inside: insideCount,
      capacity: CAPACITY,
      available: CAPACITY - insideCount,
    });
  } catch (error) {
    console.error("Capacity error:", error);

    res.status(500).json({
      message: "Unable to get gym capacity",
    });
  }
});

// ========================================
// MARK ATTENDANCE
// ========================================

router.post("/", async (req, res) => {
  try {
    const { member, status } = req.body;

    if (!member) {
      return res.status(400).json({
        message: "Member id required",
      });
    }

    const attendance = await Attendance.create({
      member,
      status: status || "Present",
    });

    res.status(201).json({
      message: "Attendance marked",
      attendance,
    });
  } catch (error) {
    console.error("Attendance error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ========================================
// GET ALL ATTENDANCE
// ========================================

router.get("/", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("member", "name email phone")
      .sort({
        createdAt: -1,
      });

    res.json({
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// ========================================
// MEMBER ATTENDANCE
// ========================================

router.get("/member/:id", async (req, res) => {
  try {
    const data = await Attendance.find({
      member: req.params.id,
    }).sort({
      date: -1,
    });

    res.json({
      attendance: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;