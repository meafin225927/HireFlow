import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useApiResource from '../hooks/useApiResource';
import api from '../services/api';
import { referenceId } from '../services/jobPresentation'; // utility to get job id from object if needed

/**
 * ApplicationForm component – used by candidates to apply for a job.
 * Mirrors the original JoinRequestForm but with job‑specific fields.
 */
export default function ApplicationForm({ job, user, onRefresh }) {
  // Load any existing applications of the current user for this job
  const { data, loading, error: historyError, reload } = useApiResource(
    '/applications/mine',
    user.id
  );
  const [resumeLink, setResumeLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdApplication, setCreatedApplication] = useState(null);
  const busy = useRef(false);
  const feedback = useRef(null);

  // Determine if the user already has an application for this job
  const existing =
    createdApplication ||
    data?.applications.find(
      (app) => referenceId(app.job) === job._id
    );

  async function submit(event) {
    event.preventDefault();
    if (busy.current || loading || historyError) return;
    if (resumeLink.length > 300) {
      setError('Resume/Portfolio link must be at most 300 characters.');
      feedback.current?.focus();
      return;
    }
    busy.current = true;
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        resumeLink: resumeLink.trim(),
        coverLetter: coverLetter.trim(),
      };
      const { data: response } = await api.post(
        `/jobs/${job._id}/applications`,
        payload
      );
      setCreatedApplication(response.application);
      setResumeLink('');
      setCoverLetter('');
    } catch (requestError) {
      setError(requestError.message);
      feedback.current?.focus();
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  if (existing) {
    const pending = existing.status === 'pending';
    return (
      <div className="application-confirmation" role="status">
        <span className="eyebrow">{pending ? 'APPLICATION SENT' : 'YOUR APPLICATION'}</span>
        <h3>
          {pending
            ? 'Your application is pending review'
            : existing.status === 'accepted'
            ? 'Your application was accepted'
            : 'Your application was rejected'}
        </h3>
        <p>
          {pending
            ? 'The recruiter will review your application. You don’t need to submit it again.'
            : existing.status === 'accepted'
            ? 'You have been hired for this position. Check your dashboard for details.'
            : 'This application was rejected. You can explore other jobs.'}
        </p>
        {existing.status === 'accepted' && (
          <button className="button button-secondary" onClick={onRefresh}>
            Refresh job details
          </button>
        )}
      </div>
    );
  }

  if (loading) return <p className="muted" role="status">Checking your existing applications…</p>;
  if (historyError)
    return (
      <div>
        <p className="error-banner" role="alert">
          {historyError.message}
        </p>
        <button className="button button-secondary" onClick={reload}>
          Retry application check
        </button>
      </div>
    );

  return (
    <form onSubmit={submit} aria-busy={submitting}>
      <div ref={feedback} tabIndex={-1} className={error ? 'error-banner' : 'sr-only'} role="alert">
        {error}
      </div>
      <div className="field">
        <label htmlFor="resumeLink">Resume / Portfolio URL</label>
        <input
          id="resumeLink"
          name="resumeLink"
          type="url"
          required
          value={resumeLink}
          onChange={(e) => setResumeLink(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="coverLetter">
          Cover Letter <span className="optional">(optional)</span>
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={5}
          maxLength={500}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />
        <span className="field-hint">{coverLetter.length} / 500 characters</span>
      </div>
      <div className="button-row">
        <button className="button" type="submit" disabled={submitting || loading}>
          {submitting ? 'Sending application…' : 'Send Application'}
        </button>
        {error && (
          <button
            className="button button-secondary"
            type="button"
            disabled={submitting}
            onClick={onRefresh}
          >
            Refresh job
          </button>
        )}
      </div>
      <span className="sr-only" role="status">
        {submitting ? 'Sending your application. Please wait.' : ''}
      </span>
    </form>
  );
}
