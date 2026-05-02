const express = require("express");
const router = express.Router();
const checkAdmin = require("../middlewares/checkAdmin");
const verifyToken = require("../middlewares/verifyToken");

const Doctor = require("../models/doctor");
const Nurse = require("../models/nurse");
const User = require("../models/user");
const Department = require("../models/department");
const ContactUs = require("../models/contactUs");
const newsLetter = require("../models/newsLetter");


router.post("/new-letter", async (req, res, next) => {
  const { email } = req.body
  console.log("Newsletter request received for:", email); // Debug log
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const newletter = new newsLetter({
      email,
    });
    const savedletter = await newletter.save();
    console.log("Newsletter saved successfully"); // Debug log
    res.status(200).json({ status: "Saved", savedletter });
  } catch (error) {
    console.error("Newsletter error:", error); // Debug log
    next(error);
  }
})

router.use(verifyToken);
router.use(checkAdmin);

router.get("/get-users", async (req, res, next) => {
  try {
    const users = await User.find({ role: "patient" });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete-user/:id", async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
});

router.get("/get-contacts", async (req, res, next) => {
  try {
    const contacts = await ContactUs.find({});

    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.post("/add-department", async (req, res, next) => {
  const { name, description, head, staff } = req.body;
  try {
    const existingdept = await Department.findOne({ name });

    if (existingdept) {
      return res
        .status(400)
        .json({ error: "Department with same name already exists" });
    }
    const newDept = new Department({
      name,
      description,
      head,
      staff,
    });

    const savedDept = await newDept.save();
    res.status(200).json(savedDept);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete-department/:id", async (req, res, next) => {
  try {
    const deletedDept = await Department.findByIdAndDelete(req.params.id);
    res.json(deletedDept);
  } catch (error) {
    next(error);
  }
});

router.get("/get-department", async (req, res, next) => {
  try {
    const depts = await Department.find({}).populate("head", "name");
    res.json(depts);
  } catch (error) {
    next(error);
  }
});


router.get("/get-count", async (req, res, next) => {
  try {
    const patientcou = await User.countDocuments({ role: "patient" }).exec();
    const queriescou = await ContactUs.countDocuments({}).exec();
    const deptcou = await Department.countDocuments({}).exec();
    const doccou = await Doctor.countDocuments({}).exec();
    const nursecou = await Nurse.countDocuments({}).exec();

    res.json({
      patientcou,
      queriescou,
      deptcou,
      doccou,
      nursecou,
    });
  } catch (error) {
    next(error);
  }
});





router.get("/get-sent-newsletter", async (req, res, next) => {
  try {
    const sentnews = await newsLetter.find();
    res.json(sentnews);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
