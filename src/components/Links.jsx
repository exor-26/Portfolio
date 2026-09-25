export function Arrow({ direction = 'out' }) {
  const rotations = { out: 0, down: 90, up: -90 }
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" style={{ transform: `rotate(${rotations[direction]}deg)` }}>
      <path d="M4.5 15.5 15 5M5 5h10v10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function TextLink({ href, children }) {
  return <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">{children}<Arrow /></a>
}
