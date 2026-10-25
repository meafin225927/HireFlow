import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AdminRoute, GuestRoute, ProtectedRoute } from './components/RouteGuards'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BrowseJobs from './pages/BrowseJobs';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import JobDetails from './pages/JobDetails';
import MyJobs from './pages/MyJobs';
import ManageApplicants from './pages/ManageApplicants';
import MyApplications from './pages/MyApplications';
import AdminJobs from './pages/AdminJobs'


import TeamDetails from './pages/TeamDetails'
import CreateTeam from './pages/CreateTeam'
import MyTeams from './pages/MyTeams'
import EditTeam from './pages/EditTeam'
import ManageRequests from './pages/ManageRequests'
import MyRequests from './pages/MyRequests'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<BrowseJobs />} />
        <Route path="jobs/new" element={<PostJob />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="jobs/:id/edit" element={<EditJob />} />
        <Route path="my-jobs" element={<MyJobs />} />
        <Route path="my-applications" element={<MyApplications />} />
        <Route path="admin/jobs" element={<AdminJobs />} />
        <Route path="jobs/:id/applicants" element={<ManageApplicants />} />
        <Route path="teams/:id" element={<TeamDetails />} />
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="teams/new" element={<CreateTeam />} />
          <Route path="my-teams" element={<MyTeams />} />
          <Route path="teams/:id/edit" element={<EditTeam />} />
          <Route path="teams/:id/manage" element={<ManageRequests />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
