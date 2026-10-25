const mongoose = require('mongoose');

// Job Listing schema – replaces the old Team schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },               // formerly `name`
  companyName: { type: String, required: true },        // formerly `hackathonName`
  location: { type: String, default: 'Remote' },
  jobType: { type: String, enum: ['Full-Time','Internship','Part-Time','Contract'], default: 'Full-Time' },
  salaryRange: String,
  description: String,
  requiredSkills: [String],
  openings: { type: Number, default: 1 },               // formerly `maxTeamSize`
  status: { type: String, enum: ['open','closed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // creator
  acceptedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', jobSchema);
