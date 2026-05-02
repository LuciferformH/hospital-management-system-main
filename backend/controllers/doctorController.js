const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Doctor = require("../models/doctor");
const checkAdmin = require("../middlewares/checkAdmin");
const verifyToken = require("../middlewares/verifyToken");
const Appointment = require("../models/appointment");
const Communication = require("../models/communication");
const { isValidEmail } = require("../utils/validation");

router.get("/get-doctors", verifyToken, async (req, res, next) => {

  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    next(error);
  }
});

router.put("/profile-update", verifyToken, async (req, res, next) => {
  const { userId, updatedProfile } = req.body;
  try {
    const updatedUser = await Doctor.findByIdAndUpdate(
      userId,
      { $set: updatedProfile },
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: "Success", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    next(error);
  }
});



router.delete("/delete-doctor/:id", checkAdmin, async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await Doctor.findByIdAndDelete(userId);
    res.json({ msg: "Doctor deleted successfully" });
  } catch (error) {
    next(error);
  }
});


router.post("/add-doctor", checkAdmin, async (req, res, next) => {
  const { name, email, specialization } = req.body;
  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await Doctor.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Doctor with this email already exists" });
    }
    const lastDoctor = await Doctor.findOne().sort({ doctorId: -1 });
    let doctorId;
    if (lastDoctor) {
      const lastDoctorId = parseInt(lastDoctor.doctorId, 10);
      doctorId = (lastDoctorId + 1).toString();
    } else {
      doctorId = "1";
    }
    const firstemail = email.split('@')[0];
    const password = firstemail + '@123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Doctor({
      name,
      email,
      doctorId: doctorId,
      password: hashedPassword,
      specialization
    });

    const savedUser = await newUser.save();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
});


router.get("/get-appointments/:id", async (req, res, next) => {
  const doctorId = req.params.id;
  try {
    const appointments = await Appointment.find({ doctorId });

    if (appointments.length === 0) {
      return res.json({ message: "No appointments found" });
    } else {
      res.json(appointments);
    }

  } catch (error) {
    next(error);
  }
});

router.post("/add-message", verifyToken, async (req, res, next) => {

  const { email, message, from } = req.body;

  const newEntry = new Communication({ email, message, from });

  try {
    await newEntry.save();
    res.status(200).json("Successfully sent");
  } catch (error) {
    next(error);
  }
});
router.get("/get-message/:email", verifyToken, async (req, res, next) => {

  const email = req.params.email; // Correct way to access email from request parameters

  try {
    const message = await Communication.find({ email });
    res.json(message);
  } catch (error) {
    next(error);
  }
});


module.exports = router;