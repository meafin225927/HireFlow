import axios from 'axios';

const API_BASE = '/api';

export const applyToJob = async (jobId, application) => {
  const response = await axios.post(`${API_BASE}/applications`, { job: jobId, ...application });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await axios.get(`${API_BASE}/applications/mine`);
  return response.data;
};

export const decideApplication = async (appId, status) => {
  const response = await axios.patch(`${API_BASE}/applications/${appId}`, { status });
  return response.data;
};
