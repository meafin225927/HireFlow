const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeLink: { type: String, required: true },
  relevantSkills: { type: [String], default: [] },
  coverLetter: { type: String },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate applications to the same job by the same user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
