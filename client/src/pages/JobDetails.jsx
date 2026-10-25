import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import useApiResource from '../hooks/useApiResource';
import PageState from '../components/PageState';
import ApplicationForm from '../components/ApplicationForm';
import { referenceId } from '../services/jobPresentation';

export default function JobDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { data, error, loading, reload } = useApiResource(`/jobs/${encodeURIComponent(id)}`);
  const browseQuery = typeof location.state?.browseQuery === 'string' ? location.state.browseQuery : '';
  const backToJobs = `/jobs${browseQuery ? `?${browseQuery}` : ''}`;

  if (loading) return <PageState title="Loading job details" loading>Fetching job information…</PageState>;
  if (error) return (
    <PageState
      title={error.status === 404 ? 'Job not found' : 'Unable to load job'}
      error
      actions={
        <>
          <button className="button" onClick={reload}>Try again</button>
          <Link className="button button-secondary" to={backToJobs}>Back to jobs</Link>
        </>
      }
    >
      {error.message}
    </PageState>
  );

  const { job } = data;
  const isCreator = user && referenceId(job.creator) === user.id;
  const hasApplied = false; // placeholder, actual check handled inside ApplicationForm

  return (
    <section>
      <Link className="back-link" to={backToJobs}>← Back to jobs</Link>
      {location.state?.notice && <p className="success-banner" role="status">{location.state.notice}</p>}
      <div className="page-heading job-details-heading">
        <span className="eyebrow">JOB LISTING</span>
        <h1>{job.title}</h1>
        <p className="company-name">{job.companyName}</p>
        <div className="job-meta">
          <span className="location">{job.location}</span>
          <span className="job-type badge">{job.jobType}</span>
          <span className="salary-range">{job.salaryRange}</span>
        </div>
      </div>
      <div className="job-details-grid">
        <div className="job-details-main">
          <article className="panel detail-panel">
            <h2>Job Description</h2>
            <p className="job-description">{job.description}</p>
            <h3>Required Skills</h3>
            {job.requiredSkills && job.requiredSkills.length ? (
              <ul className="skill-list">
                {job.requiredSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No specific skills listed.</p>
            )}
          </article>
        </div>
        <aside className="panel apply-panel" aria-labelledby="apply-title">
          <h2 id="apply-title">Apply for this job</h2>
          {user ? (
            <ApplicationForm job={job} user={user} onRefresh={reload} />
          ) : (
            <p className="muted">Please <Link to="/login" state={{ from: location.pathname + location.search }}>log in</Link> to apply.</p>
          )}
          {isCreator && (
            <div className="creator-actions">
              <Link className="button button-full" to={`/jobs/${job._id}/manage`}>Manage applications</Link>
              <Link className="button button-secondary button-full" to={`/jobs/${job._id}/edit`}>Edit job</Link>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
