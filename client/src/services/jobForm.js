export function initialJobFields(job) {
  return {
    title: job?.title || '',
    companyName: job?.companyName || '',
    location: job?.location || '',
    jobType: job?.jobType || '',
    salaryRange: job?.salaryRange || '',
    description: job?.description || '',
    requiredSkills: job?.requiredSkills?.join(', ') || '',
    openings: String(job?.openings ?? 1),
  };
}

export function validateJobFields(fields, job) {
  const errors = {};
  const values = {
    title: fields.title.trim(),
    companyName: fields.companyName.trim(),
    location: fields.location.trim(),
    jobType: fields.jobType.trim(),
    salaryRange: fields.salaryRange.trim(),
    description: fields.description.trim(),
    requiredSkills: fields.requiredSkills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean),
    openings: Number(fields.openings),
  };

  if (!values.title) errors.title = 'Enter a job title.';
  if (!values.companyName) errors.companyName = 'Enter the company/organization name.';
  if (!values.location) errors.location = 'Enter the job location.';
  if (!values.jobType) errors.jobType = 'Select a job type.';
  if (!values.salaryRange) errors.salaryRange = 'Enter a salary range or stipend.';
  if (!values.description) errors.description = 'Provide a job description.';
  if (!Number.isSafeInteger(values.openings) || values.openings < 1) {
    errors.openings = 'Openings must be a positive integer.';
  }

  // PATCH only changed fields
  if (job) {
    const original = initialJobFields(job);
    for (const field of [
      'title',
      'companyName',
      'location',
      'jobType',
      'salaryRange',
      'description',
      'requiredSkills',
      'openings',
    ]) {
      const newVal = values[field];
      const oldVal = original[field];
      // compare arrays for requiredSkills
      const equal = Array.isArray(newVal)
        ? JSON.stringify(newVal) === JSON.stringify(job.requiredSkills)
        : newVal === oldVal;
      if (equal) delete values[field];
    }
  }

  return { errors, values };
}
