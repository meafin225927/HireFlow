import { Link } from 'react-router-dom';

/**
 * JobCard component – displays a summary of a job listing.
 * Mirrors the original TeamCard but with job‑specific fields.
 */
export default function JobCard({ job, browseQuery }) {
  // Determine if the job is fully filled based on remaining openings.
  const isClosed = job.openings <= 0;
  return (
    <article className="panel job-card">
      <div className="job-card-top">
        <span className={`status-badge${isClosed ? ' is-closed' : ' is-open'}`}>
          {isClosed ? 'Closed' : 'Open'}
        </span>
        <span className="muted openings-count">
          {job.openings} position{job.openings !== 1 ? 's' : ''} available
        </span>
      </div>
      <h2>
        <Link to={`/jobs/${job._id}`} state={{ browseQuery }}>
          {job.title}
        </Link>
      </h2>
      <p className="company-name">{job.companyName}</p>
      <div className="job-meta">
        <span className="location">{job.location}</span>
        <span className="job-type badge">{job.jobType}</span>
        <span className="salary-range">{job.salaryRange}</span>
      </div>
      <p className="job-description" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
        {job.description}
      </p>
      <div className="job-card-skills">
        <h3 className="sr-only">Required skills</h3>
        {job.requiredSkills && job.requiredSkills.length ? (
          <ul className="skill-list">
            {job.requiredSkills.map((skill, idx) => (
              <li key={`${skill}-${idx}`}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No specific skills listed</p>
        )}
      </div>
      <div className="job-card-footer">
        <span className="muted">
          Posted by <strong>{job.creator?.name || 'Unavailable account'}</strong>
        </span>
        <Link
          to={`/jobs/${job._id}`}
          state={{ browseQuery }}
          className="button button-secondary button-small"
          aria-label={`View details for ${job.title}`}
        >
          View details <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
