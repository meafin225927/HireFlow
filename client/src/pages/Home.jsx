import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export default function Home() {
  const { user } = useAuth()
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">DISCOVER TECH ROLES &amp; INTERNSHIPS</span>
          <h1>Your career.<br /><span>Starts here.</span></h1>
          <p>HireFlow connects job seekers with employers, making it easy to find the right opportunity and apply quickly.</p>
          <div className="button-row">
            <Link className="button" to={user ? '/dashboard' : '/register'}>{user ? 'Go to dashboard' : 'Get started'} <span aria-hidden="true">↗</span></Link>
            <Link className="button button-secondary" to={user ? '/jobs' : '/login'}>{user ? 'Browse jobs' : 'I already have an account'}</Link>
          </div>
          <p className="hero-caption">For job seekers, employers, and hiring managers.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="art-label">YOUR NEXT ROLE</span>
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-core">{'{ }'}<span>YOUR CAREER</span></div>
          <div className="skill-float float-one">&lt;/&gt; Development</div>
          <div className="skill-float float-two">✧ Design</div>
          <div className="skill-float float-three">↗ Management</div>
        </div>
      </section>
      <section className="feature-section" aria-labelledby="why-title">
        <div className="section-heading"><span className="eyebrow">MADE FOR JOB SEEKERS</span><h2 id="why-title">Everything you need to land your next role.</h2></div>
        <div className="card-grid">
          <article className="panel feature-card"><span className="feature-number">01 / DISCOVER</span><h3>Browse open positions.</h3><p>Search and filter jobs by title, location, or company to find the perfect fit.</p></article>
          <article className="panel feature-card"><span className="feature-number">02 / APPLY</span><h3>Submit your application.</h3><p>Apply directly with your resume and cover letter — all in one place.</p></article>
          <article className="panel feature-card"><span className="feature-number">03 / TRACK</span><h3>Follow your progress.</h3><p>Keep track of every application you've submitted and stay on top of your job search.</p></article>
        </div>
      </section>
    </>
  )
}
