import { getTeam, getTeamCount } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const [team, count] = await Promise.all([getTeam(), getTeamCount()]);

  return (
    <>
      <div className="page-header">
        <h1>Team</h1>
        <p>{count} / 6 members &mdash; 36 roles &mdash; finish yours, help others</p>
      </div>

      <div className="team-grid">
        {team.map((member, i) => (
          <div
            className="team-card"
            key={member.id}
            style={{ animation: `fadeInUp 0.5s ease ${i * 0.08}s both` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3>{member.minecraft_username}</h3>
              {member.helping && <span className="helping-badge">Helping</span>}
            </div>
            <div className="discord">{member.discord_tag}</div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
              {member.roles_completed.length}/6 roles done
            </div>

            <ul className="role-list">
              {member.roles.map((role) => {
                const done = member.roles_completed.includes(role);
                return (
                  <li key={role}>
                    <span className="role-tag">{done ? '✓' : '○'}</span>
                    <span className={done ? 'role-done' : 'role-pending'}>{role}</span>
                  </li>
                );
              })}
            </ul>

            {member.helping && (
              <div className="helping-needed">
                Available to help — reach out on Discord
              </div>
            )}

            {!member.helping && member.remaining.length > 0 && (
              <div className="helping-needed">
                Needs help with: {member.remaining.join(', ')}
              </div>
            )}
          </div>
        ))}

        {Array.from({ length: 6 - count }).map((_, i) => (
          <div className="team-card open-slot" key={`open-${i}`}>
            <h3>Open Slot</h3>
            <div className="discord">—</div>
            <ul className="role-list">
              <li>Awaiting member</li>
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
