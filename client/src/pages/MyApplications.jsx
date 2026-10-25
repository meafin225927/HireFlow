import React, { useEffect, useState } from 'react';
import { getMyApplications } from '../services/applicationService';
import JobCard from '../components/JobCard';
import PageState from '../components/PageState';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <PageState title="Loading applications…" headingAs="h2" loading />;
  }

  if (error) {
    return (
      <PageState
        title="Couldn’t load applications"
        headingAs="h2"
        error
        actions={<button className="button" onClick={() => window.location.reload()}>Retry</button>}
      >
        {error.message}
      </PageState>
    );
  }

  return (
    <section>
      <h2>My Applications</h2>
      {applications.length ? (
        <div className="applications-grid">
          {applications.map((app) => (
            <JobCard key={app._id} job={app.job} />
          ))}
        </div>
      ) : (
        <p>You have not applied to any jobs yet.</p>
      )}
    </section>
  );
}
