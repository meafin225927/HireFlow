import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import useApiResource from '../hooks/useApiResource';
import JobForm from '../components/JobForm';
import DeleteJobDialog from '../components/DeleteJobDialog';
import PageState from '../components/PageState';
import { updateJob, deleteJob } from '../services/jobService';
import { referenceId } from '../services/jobPresentation';

function EditJobContent({ job }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const busy = useRef(false);

  async function save(values) {
    const { job: updated } = await updateJob(job._id, values);
    navigate(`/jobs/${updated._id}`, { replace: true, state: { notice: 'Job updated successfully.' } });
  }

  async function remove() {
    if (busy.current || saving) return;
    busy.current = true;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteJob(job._id);
      navigate('/my-jobs', { replace: true, state: { notice: 'Job deleted successfully.' } });
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      busy.current = false;
      setDeleting(false);
    }
  }

  return (
    <>
      <JobForm job={job} onSubmit={save} onBusyChange={setSaving} disabled={deleting} />
      <section className="panel danger-zone" aria-labelledby="delete-heading">
        <div>
          <h2 id="delete-heading">Delete job</h2>
          <p>This permanently removes the job posting and all related applications.</p>
        </div>
        <button
          className="button button-danger"
          disabled={saving || deleting}
          onClick={() => {
            setDeleteError('');
            setConfirming(true);
          }}
        >
          Delete Job
        </button>
      </section>
      {confirming && (
        <DeleteJobDialog
          jobTitle={job.title}
          busy={deleting}
          error={deleteError}
          onCancel={() => setConfirming(false)}
          onConfirm={remove}
        />
      )}
    </>
  );
}

export default function EditJob() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, loading, error, reload } = useApiResource(`/jobs/${encodeURIComponent(id)}`, user.id);

  if (loading) return <PageState title="Loading job editor" loading>Getting your current job details…</PageState>;
  if (error) return (
    <PageState
      title={error.status === 404 ? 'Job not found' : 'Job editor unavailable'}
      error
      actions={
        <>
          <button className="button" onClick={reload}>Try again</button>
          <Link className="button button-secondary" to="/my-jobs">My Jobs</Link>
        </>
      }
    >
      {error.message}
    </PageState>
  );

  if (referenceId(data.job.creator) !== user.id) return (
    <PageState title="Only the creator can edit this job" error>
      <Link className="button" to={`/jobs/${data.job._id}`}>View job</Link>
    </PageState>
  );

  return (
    <section className="job-form-page">
      <Link className="back-link" to={`/jobs/${data.job._id}`}>← Back to job</Link>
      <div className="page-heading">
        <span className="eyebrow">UPDATE JOB POSTING</span>
        <h1>Edit job</h1>
        <p>{data.job.title}</p>
      </div>
      <EditJobContent key={`${data.job._id}:${user.id}`} job={data.job} />
    </section>
  );
}
