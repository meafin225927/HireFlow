import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { initialJobFields, validateJobFields } from '../services/jobForm';

/**
 * JobForm component – used for creating or editing a job listing.
 * Mirrors the original TeamForm but with job‑specific fields.
 */
export default function JobForm({ job, onSubmit, onBusyChange, disabled = false }) {
  const [fields, setFields] = useState(() => initialJobFields(job));
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [errorStatus, setErrorStatus] = useState(null);
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const feedback = useRef(null);
  const forbidden = errorStatus === 403 || errorStatus === 404;

  function update(event) {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setError('');
    setNotice('');
    setErrorStatus(null);
  }

  async function submit(event) {
    event.preventDefault();
    if (busy.current || disabled || forbidden) return;
    const { errors: validation, values } = validateJobFields(fields, job);
    setErrors(validation);
    setError('');
    setNotice('');
    if (Object.keys(validation).length) {
      event.currentTarget.elements.namedItem(Object.keys(validation)[0])?.focus();
      return;
    }
    if (job && !Object.keys(values).length) {
      setNotice('There are no changes to save.');
      return;
    }
    busy.current = true;
    setSubmitting(true);
    onBusyChange?.(true);
    try {
      await onSubmit(values);
    } catch (requestError) {
      setError(requestError.message);
      setErrorStatus(requestError.status);
      feedback.current?.focus();
    } finally {
      busy.current = false;
      setSubmitting(false);
      onBusyChange?.(false);
    }
  }

  function errorAttributes(name) {
    return {
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : `${name}-hint`,
    };
  }

  return (
    <form className="panel job-form" onSubmit={submit} noValidate aria-busy={submitting}>
      <div ref={feedback} tabIndex={-1} className={error ? 'error-banner' : 'sr-only'} role="alert">
        {error}
      </div>
      {errorStatus === 409 && job && (
        <p className="notice-banner">
          Job may have changed. Check the current details before trying again.{' '}
          <Link to={`/jobs/${job._id}`}>View job details</Link>
        </p>
      )}
      {forbidden && (
        <p className="notice-banner">
          {errorStatus === 403
            ? 'Editing is no longer permitted for this account.'
            : 'This job is no longer available.'}{' '}
          <Link to="/my-jobs">Back to My Jobs</Link>
        </p>
      )}
      {notice && <p className="success-banner" role="status">{notice}</p>}
      <fieldset disabled={submitting || disabled || forbidden}>
        {/* Job Title */}
        <div className="field">
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            name="title"
            required
            value={fields.title}
            onChange={update}
            {...errorAttributes('title')}
          />
          {errors.title ? (
            <span id="title-error" className="field-error">
              {errors.title}
            </span>
          ) : (
            <span id="title-hint" className="field-hint">
              A concise title for the position.
            </span>
          )}
        </div>
        {/* Company Name */}
        <div className="field">
          <label htmlFor="companyName">Company / Organization</label>
          <input
            id="companyName"
            name="companyName"
            required
            value={fields.companyName}
            onChange={update}
            {...errorAttributes('companyName')}
          />
          {errors.companyName ? (
            <span id="companyName-error" className="field-error">
              {errors.companyName}
            </span>
          ) : (
            <span id="companyName-hint" className="field-hint">
              Name of the hiring company or team.
            </span>
          )}
        </div>
        {/* Location */}
        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            required
            value={fields.location}
            onChange={update}
            {...errorAttributes('location')}
          />
          {errors.location ? (
            <span id="location-error" className="field-error">
              {errors.location}
            </span>
          ) : (
            <span id="location-hint" className="field-hint">
              e.g., Remote, Bengaluru, Hybrid
            </span>
          )}
        </div>
        {/* Job Type */}
        <div className="field">
          <label htmlFor="jobType">Job Type</label>
          <input
            id="jobType"
            name="jobType"
            required
            placeholder="Full-Time, Internship, Part-Time, Contract"
            value={fields.jobType}
            onChange={update}
            {...errorAttributes('jobType')}
          />
          {errors.jobType ? (
            <span id="jobType-error" className="field-error">
              {errors.jobType}
            </span>
          ) : (
            <span id="jobType-hint" className="field-hint">
              Specify the employment type.
            </span>
          )}
        </div>
        {/* Salary Range */}
        <div className="field">
          <label htmlFor="salaryRange">Salary / Stipend</label>
          <input
            id="salaryRange"
            name="salaryRange"
            required
            value={fields.salaryRange}
            onChange={update}
            {...errorAttributes('salaryRange')}
          />
          {errors.salaryRange ? (
            <span id="salaryRange-error" className="field-error">
              {errors.salaryRange}
            </span>
          ) : (
            <span id="salaryRange-hint" className="field-hint">
              e.g., "₹6 LPA – ₹10 LPA" or "₹15,000/mo"
            </span>
          )}
        </div>
        {/* Description */}
        <div className="field">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            rows={6}
            required
            value={fields.description}
            onChange={update}
            {...errorAttributes('description')}
          />
          {errors.description ? (
            <span id="description-error" className="field-error">
              {errors.description}
            </span>
          ) : (
            <span id="description-hint" className="field-hint">
              Detailed responsibilities and requirements.
            </span>
          )}
        </div>
        {/* Required Skills */}
        <div className="field">
          <label htmlFor="requiredSkills">
            Required Skills{' '}
            <span className="optional">(optional)</span>
          </label>
          <input
            id="requiredSkills"
            name="requiredSkills"
            placeholder="React, Node.js, Python"
            value={fields.requiredSkills}
            onChange={update}
            aria-describedby="requiredSkills-hint"
          />
          <span id="requiredSkills-hint" className="field-hint">
            Separate skills with commas.
          </span>
        </div>
        {/* Openings */}
        <div className="field">
          <label htmlFor="openings">Open Positions</label>
          <input
            id="openings"
            name="openings"
            type="number"
            min={1}
            required
            value={fields.openings}
            onChange={update}
            {...errorAttributes('openings')}
          />
          {errors.openings ? (
            <span id="openings-error" className="field-error">
              {errors.openings}
            </span>
          ) : (
            <span id="openings-hint" className="field-hint">
              Number of positions you are hiring for.
            </span>
          )}
        </div>
        {/* Buttons */}
        <div className="button-row">
          <button className="button" type="submit">
            {submitting
              ? job
                ? 'Saving changes…'
                : 'Creating job…'
              : job
              ? 'Save changes'
              : 'Post Job'}
          </button>
          <Link
            className="button button-secondary"
            to={job ? `/jobs/${job._id}` : '/my-jobs'}
            onClick={(event) => {
              if (busy.current) event.preventDefault();
            }}
            aria-disabled={submitting}
          >
            Cancel
          </Link>
        </div>
      </fieldset>
      <span className="sr-only" role="status">
        {submitting ? 'Saving your job. Please wait.' : ''}
      </span>
    </form>
  );
}
