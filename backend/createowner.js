const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("./src/models/User");

dotenv.config();

const createOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "owner@thelift.com";
    const password = "Owner@12345";

    const existingOwner = await User.findOne({ email });

    if (existingOwner) {
      console.log("Owner already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await User.create({
      name: "The Lift Owner",
      email,
      password: hashedPassword,
      role: "owner",
    });

    console.log("Owner created successfully!");
    console.log("Email:", owner.email);
    console.log("Password:", password);
    console.log("Role:", owner.role);

    process.exit(0);
  } catch (error) {
    console.error("Error creating owner:", error.message);
    process.exit(1);
  }
};

createOwner();