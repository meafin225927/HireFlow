const mongoose = require('mongoose');
const Job = require('../models/Team'); // The Team model file now exports Job
const Application = require('../models/Application');

// Editable fields for a job listing
const editableFields = ['title','companyName','location','jobType','salaryRange','description','requiredSkills','openings'];
const publicUserFields = '_id name skills';

function validateJob(body, partial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Provide a JSON object containing job fields.' };
  }
  const fields = Object.keys(body);
  if (partial && (!fields.length || fields.some((f) => !editableFields.includes(f)))) {
    return { error: `Only ${editableFields.join(', ')} may be edited.` };
  }
  const values = {};
  // Required fields for creation
  if (!partial || Object.hasOwn(body, 'title')) {
    if (typeof body.title !== 'string' || !body.title.trim()) return { error: 'title must be a non‑empty string.' };
    values.title = body.title.trim();
  }
  if (!partial || Object.hasOwn(body, 'companyName')) {
    if (typeof body.companyName !== 'string' || !body.companyName.trim()) return { error: 'companyName must be a non‑empty string.' };
    values.companyName = body.companyName.trim();
  }
  if (!partial || Object.hasOwn(body, 'location')) {
    values.location = (body.location || 'Remote').trim();
  }
  if (!partial || Object.hasOwn(body, 'jobType')) {
    const allowed = ['Full-Time', 'Internship', 'Part-Time', 'Contract'];
    if (!allowed.includes(body.jobType)) return { error: `jobType must be one of ${allowed.join(', ')}` };
    values.jobType = body.jobType;
  }
  if (!partial || Object.hasOwn(body, 'salaryRange')) {
    if (body.salaryRange && typeof body.salaryRange !== 'string') return { error: 'salaryRange must be a string.' };
    values.salaryRange = body.salaryRange?.trim();
  }
  if (!partial || Object.hasOwn(body, 'description')) {
    if (body.description && typeof body.description !== 'string') return { error: 'description must be a string.' };
    values.description = body.description?.trim();
  }
  if (!partial || Object.hasOwn(body, 'requiredSkills')) {
    const skills = body.requiredSkills ?? [];
    if (!Array.isArray(skills) || !skills.every((s) => typeof s === 'string')) return { error: 'requiredSkills must be an array of strings.' };
    values.requiredSkills = skills.map((s) => s.trim());
  }
  if (!partial || Object.hasOwn(body, 'openings')) {
    if (!Number.isSafeInteger(body.openings) || body.openings < 1) return { error: 'openings must be a positive integer.' };
    values.openings = body.openings;
  }
  return { values };
}

function escapeRegex(v) {
  return v.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
}

function validJobId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ error: 'Invalid job ID.' });
  }
  return next();
}

// CREATE JOB
async function createJob(req, res, next) {
  const { values, error } = validateJob(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const job = await Job.create({ ...values, createdBy: req.user.id, acceptedCount: 0 });
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
}

// BROWSE JOBS – supports search, skill, location, jobType, pagination
async function browseJobs(req, res, next) {
  const { search, skill, location, jobType, page = '1', limit = '10' } = req.query;
  const pageNum = Number(page);
  const limitNum = Math.min(Number(limit), 50);
  const skip = (pageNum - 1) * limitNum;
  const filter = {};

  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ title: regex }, { companyName: regex }];
  }
  if (skill?.trim()) {
    filter.requiredSkills = { $regex: new RegExp(`^${escapeRegex(skill.trim())}$`, 'i') };
  }
  if (location?.trim()) {
    filter.location = { $regex: new RegExp(escapeRegex(location.trim()), 'i') };
  }
  if (jobType?.trim()) {
    filter.jobType = jobType.trim();
  }

  try {
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limitNum).populate('createdBy', publicUserFields),
      Job.countDocuments(filter)
    ]);
    return res.status(200).json({ jobs, page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return next(err);
  }
}

async function getJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', publicUserFields);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    return res.status(200).json({ job });
  } catch (err) {
    return next(err);
  }
}

async function updateJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    if (job.createdBy.toString() !== req.user.id) return res.status(403).json({ error: 'Only the job creator may edit this job.' });
    const { values, error } = validateJob(req.body, true);
    if (error) return res.status(400).json({ error });
    const updated = await Job.findOneAndUpdate({ _id: job._id, createdBy: req.user.id }, { $set: values }, { new: true, runValidators: true });
    return res.status(200).json({ job: updated });
  } catch (err) {
    return next(err);
  }
}

async function deleteJob(req, res, next) {
  let session;
  try {
    session = await mongoose.startSession();
    const result = await session.withTransaction(async () => {
      const job = await Job.findById(req.params.id).session(session);
      if (!job) return 404;
      if (job.createdBy.toString() !== req.user.id) return 403;
      await Application.deleteMany({ job: job._id }, { session });
      await Job.deleteOne({ _id: job._id }, { session });
      return 204;
    });
    if (result === 404) return res.status(404).json({ error: 'Job not found.' });
    if (result === 403) return res.status(403).json({ error: 'Only the job creator may delete this job.' });
    return res.status(204).end();
  } catch (err) {
    return next(err);
  } finally {
    if (session) await session.endSession();
  }
}

async function myJobs(req, res, next) {
  try {
    const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1, _id: -1 }).populate('createdBy', publicUserFields);
    return res.status(200).json({ jobs });
  } catch (err) {
    return next(err);
  }
}

module.exports = { validJobId, createJob, browseJobs, getJob, updateJob, deleteJob, myJobs };