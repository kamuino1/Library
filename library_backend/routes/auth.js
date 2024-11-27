import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newuser = new User({
      fullName: req.body.fullName,
      username: req.body.username,
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

    const user = await User.findOne({ username: req.body.username });

    console.log(user, "user");

    if (!user) {
      return res.status(404).json("Không tìm thấy user");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json("Sai mật khẩu");
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error during user login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
