const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sourabh19052003:414958%23IITM@care.keyd5dd.mongodb.net/Clinic-care?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
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
