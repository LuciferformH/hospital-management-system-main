const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");

const verifyToken = require("../middlewares/verifyToken");

router.get("/get-appointments/:email", verifyToken, async (req, res, next) => {
  const { email } = req.params;
  try {
    const appointment = await Appointment.find({ email }).populate("doctor");
    if (appointment.length === 0) {
      res.json({ message: "No Appointments Booked!" });
    } else {
      res.json(appointment);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/get-appointment/:id", verifyToken, async (req, res, next) => {
  const { id } = req.params;
  try {
    const appointments = await Appointment.find({ doctor: id })

    if (appointments.length === 0) {
      res.json({ message: "No Appointments Booked!" });
    } else {
      res.json(appointments);
    }
  } catch (error) {
    next(error);
  }
});


router.post("/add-appointment", verifyToken, async (req, res, next) => {
  const { doctor, patient, appointmentDate, reason, phone, email, time } = req.body;

  try {
    const newAppointment = new Appointment({
      doctor,
      patient,
      appointmentDate,
      reason,
      phone,
      email,
      time
    });

    const savedAppointment = await newAppointment.save();
    res.status(200).json(savedAppointment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
