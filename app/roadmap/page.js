import { getTimeline } from '@/lib/store';

export default async function RoadmapPage() {
  const tl = await getTimeline();

  return (
    <>
      <div className="page-header">
        <h1>Roadmap</h1>
        <p>Development timemap — 4 phases to launch</p>
      </div>

      <div className="timeline">
        {[1, 2, 3, 4].map((phase) => (
          <div className="phase-group" key={phase}>
            <div className="phase-header">
              Phase {phase}
              <span className="phase-badge">{tl[phase]?.length || 0} milestone{(tl[phase]?.length || 0) !== 1 ? 's' : ''}</span>
            </div>
            {(tl[phase] || []).map((event, i) => (
              <div
                className="timeline-item"
                key={event.id}
                style={{ animationDelay: `${0.1 + i * 0.06}s` }}
              >
                <div className="tl-title">{event.title}</div>
                {event.desc && <div className="tl-desc">{event.desc}</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
