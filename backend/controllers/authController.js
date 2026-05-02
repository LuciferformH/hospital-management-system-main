const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const Doctor = require("../models/doctor.js");
const Nurse = require("../models/nurse.js");
const verifyToken = require("../middlewares/verifyToken");
const { isValidEmail, isValidPassword } = require("../utils/validation");


router.post("/register", async (req, res, next) => {
  const { userName, email, password } = req.body;
  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.json({ message: "Success" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;


  try {
    let user, doctor, nurse;
    let isPasswordValid = false;

    user = await User.findOne({ email }).select("+password");
    doctor = await Doctor.findOne({ email }).select("+password");
    nurse = await Nurse.findOne({ email }).select("+password");

    if (user || doctor || nurse) {

      if (user) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else if (doctor) {
        isPasswordValid = await bcrypt.compare(password, doctor.password);
      } else if (nurse) {
        isPasswordValid = await bcrypt.compare(password, nurse.password);
      }

      if (isPasswordValid) {
        let token, role, loggedInUser;
        if (user) {
          token = jwt.sign({ id: user._id, role: user.role }, process.env.jwtsecret, {
            expiresIn: "2d",
          });
          role = user.role;
          loggedInUser = user.toObject();
        } else if (doctor) {
          token = jwt.sign({ id: doctor._id, role: doctor.role }, process.env.jwtsecret, {
            expiresIn: "2d",
          });
          role = doctor.role;
          loggedInUser = doctor.toObject();
        } else if (nurse) {
          token = jwt.sign({ id: nurse._id, role: nurse.role }, process.env.jwtsecret, {
            expiresIn: "2d",
          });
          role = nurse.role;
          loggedInUser = nurse.toObject();
        }
        
        // Remove password if it somehow slipped in (though select: false should handle it)
        delete loggedInUser.password;

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
        });
        
        res.json({ status: "Success", role, user: loggedInUser });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User Logged Out" });
});

router.get("/check-admin", async (req, res, next) => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    res.json({ hasAdmin: adminCount > 0 });
  } catch (error) {
    next(error);
  }
});

router.post("/register-initial-admin", async (req, res, next) => {
  const { userName, email, password } = req.body;
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return res.status(403).json({ error: "Admin already exists. Use the standard login." });
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      userName,
      email,
      password: hashedPassword,
      role: "admin"
    });

    const savedAdmin = await newAdmin.save();
    res.json({ message: "Success" });
  } catch (error) {
    next(error);
  }
});



router.post("/change-password", verifyToken, async (req, res, next) => {
  const { id, role, oldPassword, newPassword } = req.body;

  try {
    let user;
    if (role === 'patient' || role === 'admin') {
      user = await User.findById(id).select("+password");
    } else if (role === 'doctor') {
      user = await Doctor.findById(id).select("+password");
    } else if (role === 'nurse') {
      user = await Nurse.findById(id).select("+password");
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
