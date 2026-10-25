import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useApiResource from '../hooks/useApiResource';
import PageState from '../components/PageState';
import JobCard from '../components/JobCard';

function positiveInteger(value, fallback) {
  return /^[1-9]\d*$/.test(value || '') && Number.isSafeInteger(Number(value))
    ? Number(value)
    : fallback;
}

export default function BrowseJobs() {
  const [params, setParams] = useSearchParams();
  const [filterReset, setFilterReset] = useState(0);
  const search = params.get('search') || '';
  const limit = Math.min(positiveInteger(params.get('limit'), 10), 50);
  const requestedPage = positiveInteger(params.get('page'), 1);
  const page = Number.isSafeInteger((requestedPage - 1) * limit) ? requestedPage : 1;
  const query = new URLSearchParams({ search, page: String(page), limit: String(limit) }).toString();
  const { data, error, loading, reload } = useApiResource(`/jobs?${query}`);

  function clearFilters() {
    setParams({});
    setFilterReset((prev) => prev + 1);
  }

  function applyFilters(nextSearch) {
    const next = new URLSearchParams();
    if (nextSearch) next.set('search', nextSearch);
    next.set('page', '1');
    if (limit !== 10) next.set('limit', String(limit));
    setParams(next);
  }

  function changePage(nextPage) {
    const next = new URLSearchParams(params);
    next.set('page', String(nextPage));
    setParams(next);
  }

  return (
    <section>
      <div className="page-heading">
        <span className="eyebrow">JOB LISTING</span>
        <h1>Find Your Next Opportunity</h1>
      </div>
      {/* Simple search box */}
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          applyFilters(form.get('search').trim());
        }}
        aria-label="Search jobs"
      >
        <input
          name="search"
          placeholder="Search by title, company, or keyword"
          defaultValue={search}
        />
        <button type="submit" className="button">Search</button>
        <button type="button" className="button button-secondary" onClick={clearFilters}>Clear</button>
      </form>

      {loading ? (
        <PageState title="Loading jobs…" headingAs="h2" loading />
      ) : error ? (
        <PageState
          title="Couldn’t load jobs"
          headingAs="h2"
          error
          actions={<button className="button" onClick={reload}>Retry</button>}
        >
          {error.message}
        </PageState>
      ) : (
        <> 
          <div className="results-heading" role="status">
            <h2>{data.total} {data.total === 1 ? 'job' : 'jobs'} found</h2>
          </div>
          {data.jobs.length ? (
            <div className="jobs-grid">
              {data.jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <PageState title="No jobs found" headingAs="h2" />
          )}
          {(data.totalPages > 1 || data.page > 1) && (
            <nav className="pagination" aria-label="Job results pages">
              <button
                className="button button-secondary"
                disabled={data.page <= 1}
                onClick={() => changePage(data.page - 1)}
              >
                Previous
              </button>
              <span aria-live="polite">
                Page {data.page} · {data.totalPages} {data.totalPages === 1 ? 'page' : 'pages'}
              </span>
              <button
                className="button button-secondary"
                disabled={data.page >= data.totalPages}
                onClick={() => changePage(data.page + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
