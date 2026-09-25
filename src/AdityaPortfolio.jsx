import { projects } from './data/projects'
import ProjectCaseStudy from './components/ProjectCaseStudy'
import { Arrow, TextLink } from './components/Links'

const email = 'adityakumar3575@gmail.com'

export default function AdityaPortfolio() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="wordmark" href="#top" aria-label="Aditya Kumar, back to top">
            Aditya Kumar<span className="wordmark-dot" aria-hidden="true">.</span>
          </a>
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#contact">Contact <Arrow /></a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero container" id="top" aria-labelledby="hero-title">
          <p className="eyebrow"><span className="small-rule" aria-hidden="true" /> Product &amp; Systems Engineer</p>
          <h1 id="hero-title">I build products<br />and the systems<br className="mobile-break" /> <em>behind them.</em></h1>
          <div className="hero-bottom">
            <div className="hero-copy">
              <p className="hero-description">
                Android applications, business platforms, and practical AI workflows—from
                architecture and security decisions to integration and delivery.
              </p>
              <div className="hero-actions">
                <a className="button" href="#work">Explore my work <Arrow direction="down" /></a>
                <a className="text-link" href={`mailto:${email}`}>Get in touch <Arrow /></a>
              </div>
            </div>
            <div className="hero-note">
              <span className="meta-label">Independent work. Real responsibility.</span>
              <p>My own open-source product.<br />Systems built for clients.</p>
              <a href="#about">A little about how I work <Arrow /></a>
            </div>
          </div>
        </section>

        <section className="work-section container" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / Proof of work</p>
              <h2 id="work-title">Built around real needs.</h2>
            </div>
            <p className="section-caption">One independent product.<br />Two client platforms.</p>
          </div>
          <div className="project-list">
            {projects.map(project => <ProjectCaseStudy key={project.id} project={project} />)}
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="container about-grid">
            <div className="about-heading">
              <p className="eyebrow">02 / How I work</p>
              <h2 id="about-title">The whole product.<br /><em>The small details.</em></h2>
              <p className="location">Based in Bhagalpur, India.</p>
            </div>
            <div className="about-copy">
              <p className="about-lead">I like working where the interface meets the system behind it.</p>
              <p>
                My work spans product architecture, Android development, backend workflows,
                and access control. I care about what happens after the happy path: a difficult
                media file, a request with the wrong permissions, or a voice query that needs clarification.
              </p>
              <p>
                I use AI agents as part of my development process. I own the architecture,
                product logic, integration, debugging, security decisions, and acceptance testing.
                The responsibility for what ships stays with me.
              </p>
            </div>
          </div>
        </section>

        <section className="contact-section container" id="contact" aria-labelledby="contact-title">
          <p className="eyebrow">03 / Let’s talk</p>
          <div className="contact-grid">
            <h2 id="contact-title">Have a product or system that needs <em>careful engineering?</em></h2>
            <div className="contact-copy">
              <p>Available for focused freelance and contract work.</p>
              <a className="contact-email" href={`mailto:${email}`}>{email} <Arrow /></a>
              <div className="contact-links">
                <TextLink href="https://github.com/exor-26">GitHub</TextLink>
                <TextLink href="https://www.linkedin.com/in/aditya-kumar-5b0471334/">LinkedIn</TextLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer container">
        <span>© {new Date().getFullYear()} Aditya Kumar</span>
        <a href="#top">Back to top <Arrow direction="up" /></a>
      </footer>
    </>
  )
}
