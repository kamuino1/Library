import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    // Salting and Hashing the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const newuser = new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId,
      employeeId: req.body.employeeId,
      age: req.body.age,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });

    // Save User and Return
    const user = await newuser.save();
    res.status(200).json(user);
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");

    // Find user by admissionId or employeeId
    const user = req.body.admissionId
      ? await User.findOne({ admissionId: req.body.admissionId })
      : await User.findOne({ employeeId: req.body.employeeId });

    console.log(user, "user");

    // Check if user exists
    if (!user) {
      return res.status(404).json("User not found");
    }

    // Validate password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json("Wrong Password");
    }

    // Return user details
    res.status(200).json(user);
  } catch (err) {
    console.error("Error during user login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
