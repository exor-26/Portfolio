import { TextLink } from './Links'

export default function ProjectCaseStudy({ project }) {
  return (
    <article className={`project project-${project.id}`} aria-labelledby={`${project.id}-title`}>
      <div className="project-topline">
        <p className="project-category"><span className="project-number">{project.number}</span>{project.category}</p>
        <span className={`project-status ${project.inDevelopment ? 'status-development' : ''}`}><span className="status-dot" aria-hidden="true" />{project.status}</span>
      </div>
      <div className="project-grid">
        <div className="project-copy">
          <h3 id={`${project.id}-title`}>{project.name}</h3>
          <p className="project-headline">{project.headline}</p>
          <p className="project-description">{project.description}</p>
          <div className="project-ownership"><span className="meta-label">My role</span><p>{project.role}</p></div>
          <ul className="technology-list" aria-label={`${project.name} technologies`}>
            {project.technologies.map(technology => <li key={technology}>{technology}</li>)}
          </ul>
          {project.links.length > 0 && <div className="project-links">
            {project.links.map(link => <TextLink key={link.label} href={link.href}>{link.label}</TextLink>)}
          </div>}
        </div>
        <aside className="project-aside" aria-label={`${project.name} engineering focus`}>
            <span className="meta-label">Engineering focus</span>
            <p className="focus-title">{project.focus.title}</p>
            <p>{project.focus.description}</p>
            <div className="project-boundary"><span className="meta-label">Delivery &amp; access</span><p>{project.context}</p></div>
        </aside>
      </div>
      <details className="engineering-details">
        <summary><span>Engineering details<span className="summary-hint"> / Decisions &amp; tradeoffs</span></span><span className="disclosure-icon" aria-hidden="true" /></summary>
        <div className="engineering-content">
          {project.details.map(detail => <div key={detail.title}><h4>{detail.title}</h4><p>{detail.text}</p></div>)}
        </div>
      </details>
    </article>
  )
}
