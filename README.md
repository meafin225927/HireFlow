# HireFlow

HireFlow is a job application web platform built with the MERN stack (MongoDB, Express, React, Node.js). It connects job seekers with employers, making it easy to discover opportunities, apply, and manage the hiring process.

## Features

- **Browse Jobs** — Search and filter job listings by title, location, or company.
- **Post Jobs** — Employers can create and publish job listings.
- **Apply to Jobs** — Job seekers can submit applications with resume and cover letter.
- **My Jobs** — Employers can view and manage the jobs they've posted.
- **My Applications** — Job seekers can track the status of their applications.
- **Manage Applicants** — Employers can review and manage applicants for each job.
- **Admin Dashboard** — Administrators can moderate all job listings.
- **Authentication** — Secure login and registration with role-based access control.

## Tech Stack

| Layer     | Technology            |
|-----------|-----------------------|
| Frontend  | React, React Router, Vite |
| Backend   | Node.js, Express      |
| Database  | MongoDB, Mongoose     |
| Auth      | JWT, bcrypt           |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/meafin225927/HireFlow.git
cd HireFlow

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the App

```bash
# Start the server (from /server)
npm run dev

# Start the client (from /client)
npm run dev
```

The client runs at `http://localhost:5175` and the server at `http://localhost:5000`.

## Project Structure

```
HireFlow/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── context/
│   └── index.html
├── server/          # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── config/
└── README.md
```

## License

This project is part of a college MERN capstone.
