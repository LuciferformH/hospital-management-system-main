const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ContactUs = require("../models/contactUs");
const verifyToken = require("../middlewares/verifyToken");

router.post("/add-contact-us", async (req, res, next) => {
  const { name, phone, email, message } = req.body;

  try {
    const newContactUs = new ContactUs({
      name,
      phone,
      email,
      message,
    });

    const savedContactUs = await newContactUs.save();
    res.status(200).json(savedContactUs);
  } catch (error) {
    next(error);
  }
});

router.get("/get-users", verifyToken, async (req, res, next) => {
  try {
    const findUser = await User.find();
    if (!findUser || findUser.length === 0) {
      return res.status(200).json({ message: "No user found", users: [] });
    }
    res.status(200).json(findUser);
  } catch (error) {
    next(error);
  }
});

router.put("/profile-update", verifyToken, async (req, res, next) => {
  const { userId, updatedProfile } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedProfile },
      { new: true, runValidators: true }
    );

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({ status: "Success", user: userResponse });
  } catch (error) {
    next(error);
  }
});

router.get("/get-medications/:userEmail", verifyToken, async (req, res, next) => {
  const userEmail = req.params.userEmail;
  try {
    const user = await User.findOne({ email: userEmail });
    if (user) {
      res.status(200).json(user.medicalHistory || []);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/add-medications/:userEmail', verifyToken, async (req, res, next) => {
  try {
    const { userEmail } = req.params;
    const { name, dosage, frequency } = req.body;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.medicalHistory.push({
      medications: [{ name, dosage, frequency }],
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
