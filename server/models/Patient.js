const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
