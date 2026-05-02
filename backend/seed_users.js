const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Doctor = require('./models/doctor');
const Nurse = require('./models/nurse');

async function seedData() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/hospital');
    console.log('Connected to DB');

    const salt = await bcrypt.genSalt(10);

    // Create Doctor
    const docEmail = 'alice.smith@hospital.com';
    const docExists = await Doctor.findOne({ email: docEmail });
    if (!docExists) {
      const docPassword = await bcrypt.hash('alice.smith@123', salt);
      const doctor = new Doctor({
        name: 'Dr. Alice Smith',
        email: docEmail,
        doctorId: '101',
        password: docPassword,
        specialization: 'Cardiology'
      });
      await doctor.save();
      console.log('Doctor created!');
    }

    // Create Nurse
    const nurseEmail = 'bob.nurse@hospital.com';
    const nurseExists = await Nurse.findOne({ email: nurseEmail });
    if (!nurseExists) {
      const nursePassword = await bcrypt.hash('bob.nurse@123', salt);
      const nurse = new Nurse({
        name: 'Nurse Bob',
        email: nurseEmail,
        password: nursePassword,
      });
      // Wait, let's look at the nurse Controller, department is optional and seems to be a string or objectId. We'll leave it out to be safe if it causes issues.
      await nurse.save();
      console.log('Nurse created!');
    }

    // Create Patient
    const patientEmail = 'johndoe@patient.com';
    const patientExists = await User.findOne({ email: patientEmail });
    if (!patientExists) {
      const patientPassword = await bcrypt.hash('Password@123', salt);
      const patient = new User({
        userName: 'John Doe',
        email: patientEmail,
        password: patientPassword,
      });
      await patient.save();
      console.log('Patient created!');
    }

    console.log('Seeding complete.');
    process.exit();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seedData();
