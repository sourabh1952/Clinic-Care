const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

const User = require('./models/User');
const Doctor = require('./models/Doctor');


// Routes
app.post('/usersignup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log("hit req");
  try {
    // Check if email already exists
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

app.post('/doctorsignup', async (req, res) => {
  const { username, email,specialty, password } = req.body;
  console.log("hit req");
  try {
    // Check if email already exists
    // Check if email already exists
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


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log(doctor);
    if (password!=doctor.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ username: doctor.username, email: doctor.email, specialty: doctor.specialty });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});