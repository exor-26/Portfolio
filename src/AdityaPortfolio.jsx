const projects = [
  {
    number: "01",
    visual: "cinestream",
    name: "CineStream",
    category: "Android application",
    status: "On Google Play · Open source",
    description:
      "A free, offline video player for Android. It brings device videos into a searchable MediaStore library and uses Media3 playback with an on-device FFmpeg fallback for difficult files.",
    detail:
      "Playback resume, audio and subtitle selection, gesture controls, picture-in-picture, and file management are built around modern Android storage rules.",
    technologies: ["Java", "Android", "Media3", "FFmpeg"],
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.exor.cinestream",
        primary: true,
      },
      {
        label: "Source code",
        href: "https://github.com/exor-26/CineStream",
      },
    ],
  },
  {
    number: "02",
    visual: "kiepl",
    name: "KIEPL ERP–CRM",
    category: "Internal business platform",
    status: "Live client system · Contract",
    description:
      "An internal operations platform for KIEPL, bringing employee records, attendance, leave, payments, vendors, and purchase orders into role-specific workflows.",
    detail:
      "Its API verifies Firebase identity and App Check tokens, applies server-side role checks, and denies direct client access to Firestore data. Selected actions also use request throttling.",
    technologies: ["Firebase", "Cloud Functions", "Role-based access", "Web"],
    links: [
      {
        label: "Company website",
        href: "https://kiepl.co",
      },
    ],
    note: "The ERP–CRM and its source are private client systems.",
  },
  {
    number: "03",
    visual: "cardbox",
    name: "CardBox",
    category: "Service marketplace",
    status: "Client platform · In development",
    description:
      "A multi-profession service platform spanning consumer and admin Android apps, a web client, and a PHP/MySQL API for provider discovery, booking, and operational workflows.",
    detail:
      "Voice-led discovery combines on-device speech input, model-assisted intent classification, and deterministic fallback before server-side routing. Model calls have time and output limits to control cost and latency.",
    technologies: ["React Native", "PHP", "MySQL", "Voice discovery"],
    links: [],
    note: "Built through the Star Photo Lab company repository; source access is private.",
  },
];

function ExternalLink({ href, children, primary = false }) {
  return (
    <a
      className={primary ? "project-link project-link-primary" : "project-link"}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function ProjectVisual({ project }) {
  return (
    <aside className={`project-visual project-visual-${project.visual}`} aria-label={`${project.name} system view`}>
      <div className="visual-header">
        <span>System view</span>
        <span>{project.number} / 03</span>
      </div>

      {project.visual === "cinestream" && (
        <div className="visual-content visual-content-cinestream">
          <div className="play-orbit"><span className="play-symbol" aria-hidden="true">▶</span></div>
          <div className="visual-flow"><span>MediaStore</span><span aria-hidden="true">→</span><span>Media3</span></div>
          <p>On-device FFmpeg fallback</p>
        </div>
      )}

      {project.visual === "kiepl" && (
        <div className="visual-content visual-content-kiepl">
          <div className="access-line"><span>01</span><strong>Identity + App Check</strong></div>
          <div className="access-line"><span>02</span><strong>Server-side roles</strong></div>
          <div className="access-line"><span>03</span><strong>Scoped data access</strong></div>
          <p>Verified access boundary</p>
        </div>
      )}

      {project.visual === "cardbox" && (
        <div className="visual-content visual-content-cardbox">
          <div className="voice-bars" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
          <div className="voice-label">Voice-led discovery</div>
          <div className="visual-flow"><span>Speech</span><span aria-hidden="true">→</span><span>Intent</span><span aria-hidden="true">→</span><span>Results</span></div>
          <p>Deterministic fallback</p>
        </div>
      )}
    </aside>
  );
}

export default function AdityaPortfolio() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <div className="container header-inner">
          <a className="wordmark" href="#top" aria-label="Aditya Kumar, back to top">
            aditya<span>.</span>
          </a>
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> Aditya Kumar · Product &amp; Systems Engineer</p>
              <h1 id="hero-title">Software built for <em>real use.</em></h1>
              <p className="hero-description">
                I design and build Android products and operational systems,
                from media playback to service discovery and internal business tools.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  Explore selected work <span aria-hidden="true">↘</span>
                </a>
                <a className="button button-secondary" href="mailto:adityakumar3575@gmail.com">
                  Get in touch <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className="hero-aside" aria-label="Professional focus">
              <span className="aside-heading">Based in Bhagalpur, India</span>
              <span>Android products</span>
              <span>Operational platforms</span>
              <span>Architecture &amp; delivery</span>
            </div>
          </div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="container">
            <div className="section-intro">
              <div>
                <p className="section-kicker">01 / Selected work</p>
                <h2 id="work-title">Three systems. Different constraints.</h2>
              </div>
              <p>
                Public software and client platforms, each described at its
                actual stage of delivery.
              </p>
            </div>

            <div className="project-list">
              {projects.map((project) => (
                <article className="project" key={project.name}>
                  <div className="project-index">{project.number}</div>
                  <div className="project-main">
                    <div className="project-topline">
                      <span className="project-category">{project.category}</span>
                      <span className="project-status">{project.status}</span>
                    </div>
                    <div className="project-layout">
                      <div className="project-copy">
                        <h3>{project.name}</h3>
                        <p className="project-description">{project.description}</p>
                        <p className="project-detail">{project.detail}</p>
                        <ul className="technology-list" aria-label={project.name + " technologies"}>
                          {project.technologies.map((technology) => (
                            <li key={technology}>{technology}</li>
                          ))}
                        </ul>
                        <div className="project-footer">
                          <div className="project-links">
                            {project.links.map((link) => (
                              <ExternalLink key={link.label} href={link.href} primary={link.primary}>
                                {link.label}
                              </ExternalLink>
                            ))}
                          </div>
                          {project.note && <p className="project-note">{project.note}</p>}
                        </div>
                      </div>
                      <ProjectVisual project={project} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="container about-grid">
            <div>
              <p className="section-kicker">02 / About</p>
              <h2 id="about-title">Product thinking, close to the code.</h2>
            </div>
            <div className="about-copy">
              <p>
                I work across product architecture, mobile development, backend
                workflows, and security boundaries. My focus is making useful
                software that can be operated and improved after it ships.
              </p>
              <div className="capabilities" aria-label="Areas of work">
                <span>Android &amp; React Native</span>
                <span>Backend APIs &amp; Firebase</span>
                <span>Access control &amp; reliability</span>
                <span>AI-assisted workflows</span>
              </div>
              <p className="work-context">
                CineStream is my open-source product. KIEPL and CardBox are
                freelance or contract client work.
              </p>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="container contact-inner">
            <p className="section-kicker">03 / Contact</p>
            <h2 id="contact-title">Have a product to build or improve?</h2>
            <p>Available for focused freelance and contract work.</p>
            <div className="contact-links">
              <a href="mailto:adityakumar3575@gmail.com">adityakumar3575@gmail.com <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/exor-26" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
              <a href="https://www.linkedin.com/in/aditya-kumar-5b0471334/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© 2026 Aditya Kumar</span>
          <span>Product &amp; Systems Engineer · Bhagalpur, India</span>
        </div>
      </footer>
    </div>
  );
}
