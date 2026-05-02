const express = require("express");
const router = express.Router();
const Nurse = require("../models/nurse");
const bcrypt = require("bcrypt");

const checkAdmin = require("../middlewares/checkAdmin");
const verifyToken = require("../middlewares/verifyToken");
const { isValidEmail } = require("../utils/validation");

router.get("/get-nurses", verifyToken, async (req, res, next) => {
  try {
    const nurses = await Nurse.find({}).populate("department", "name");

    res.json(nurses);
  } catch (error) {
    next(error);
  }
});
router.get("/get-allNurses", verifyToken, async (req, res, next) => {
  try {
    const nurses = await Nurse.find();
    res.json(nurses);
  } catch (error) {
    next(error);
  }
});

router.post("/add-nurse", checkAdmin, async (req, res, next) => {
  const { name, email, department } = req.body;
  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await Nurse.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Nurse with this email already exists" });
    }
    const firstemail = email.split('@')[0];
    const password = firstemail + '@123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nurseData = {
      name,
      email,
      password: hashedPassword,
    };

    if (department && department.trim() !== "") {
      nurseData.department = department;
    }

    const newUser = new Nurse(nurseData);

    const savedUser = await newUser.save();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
});


router.put("/profile-update", verifyToken, async (req, res, next) => {
  const { userId, updatedProfile } = req.body;
  try {
    const updatedUser = await Nurse.findByIdAndUpdate(
      userId,
      { $set: updatedProfile },
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: "Success", user: updatedUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

