// src/services/jobPresentation.js
// Utility functions for presenting job data in the UI.

/**
 * Returns a string identifier for a job used in URLs and component keys.
 * Assumes a job object has an `_id` or `id` property.
 * If neither is present, falls back to the job title.
 */
export function referenceId(job) {
  if (!job) return '';
  return job._id ?? job.id ?? String(job.title ?? '').replace(/\s+/g, '-').toLowerCase();
}

// Additional presentation helpers can be added here in the future.
