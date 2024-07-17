const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const path  = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"/clinic-care/dist")))
app.use(express.urlencoded({ extended: true }));

// connecting frontend to backend
app.get('*',(req,res)=>
  res.sendFile(path.join(__dirname,"/clinic-care/dist/index.html"))
)
const port = process.env.PORT || 3000;
const uri ='mongodb+srv://sourabh19052003:414958%23IITM@care.keyd5dd.mongodb.net/?retryWrites=true&w=majority&appName=care' ;


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('Successfully connected to MongoDB Atlas!');
})
.catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});
// access the collections
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');


// signup request for patient
app.post('/usersignup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log("hit req");
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Create a new user instance
    const newUser = new User({ username, email, password });
    
    // Save user to database
    await newUser.save();
    
    res.status(201).json({ message: 'User signed up successfully' });
  } catch (err) {
    console.error('Error signing up user:', err);
    res.status(500).json({ message: 'Error signing up user' });
  }
});

// signup request for doctor
app.post('/doctorsignup', async (req, res) => {
  const { username, email,specialty, password } = req.body;
  console.log("hit req");
  try {
    const existingUser = await Doctor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Create a new user instance
    const newUser = new Doctor({ username, email,specialty, password });
    
    // Save user to database
    await newUser.save();
    
    res.status(201).json({ message: 'User signed up successfully' });
  } catch (err) {
    console.error('Error signing up user:', err);
    res.status(500).json({ message: 'Error signing up user' });
  }
});

// login check for patient
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if account exists or not 
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // console.log(doctor);
    // check if password match?
    if (password!=doctor.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({_id:doctor._id, username: doctor.username, email: doctor.email, specialty: doctor.specialty });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// login check for user
app.post('/login/user', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log(user);
    // check if password match?
    if (password!=user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({_id:user._id, username: user.username, email: user.email});
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// get all the doctor list to show to the user
app.post('/api/doctors', async (req, res) => {
  try {
      const doctors = await Doctor.find({}, 'username specialty');
      res.json(doctors);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// get all the patients detail linked to the doctor
app.post('/api/getpatients', async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);
    if (!_id) {
      return res.status(400).json({ error: '_id parameter is required' });
    }
    // fetch patients
    const patients = await Patient.find({ doctorId:_id });
    console.log(patients)
    res.json(patients);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});


// add the new patient to doctor link to the database
app.post('/api/patients', async (req, res) => {
  const { doctorId, email, name, description } = req.body;

  const newPatient = new Patient({
    doctorId,
    email,
    name,
    description
  });

  try {
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    console.error('Error saving patient data:', error);
    res.status(500).json({ error: 'Failed to save patient data' });
  }
});


// Start server
app.listen(3000,() => {
  console.log(`Server is running on http://localhost:3000`);
});