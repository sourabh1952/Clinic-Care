const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  specialty: { type: String, required: true },
  password: { type: String, required: true },
});

const Doctor = mongoose.model('Doctor', userSchema);

module.exports = Doctor;
