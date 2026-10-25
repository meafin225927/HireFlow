import axios from 'axios';

const API_BASE = '/api';

export const getJobs = async (params = {}) => {
  const response = await axios.get(`${API_BASE}/jobs`, { params });
  return response.data;
};

export const getJobById = async (id) => {
  const response = await axios.get(`${API_BASE}/jobs/${id}`);
  return response.data;
};

export const createJob = async (job) => {
  const response = await axios.post(`${API_BASE}/jobs`, job);
  return response.data;
};

export const updateJob = async (id, updates) => {
  const response = await axios.patch(`${API_BASE}/jobs/${id}`, updates);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await axios.delete(`${API_BASE}/jobs/${id}`);
  return response.data;
};
