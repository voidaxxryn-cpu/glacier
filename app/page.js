import { getTeamCount, getNeedsHelp } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [count, help] = await Promise.all([getTeamCount(), getNeedsHelp()]);
  const spots = 6 - count;

  return (
    <>
      <div className="hero anim-fade">
        <h1>Glacier</h1>
        <p className="subtitle">1.8.9 Ghost Client &mdash; C++ JNI Injectable</p>
        {spots > 0 ? (
          <div className="team-count">
            <strong>{spots}</strong> spot{spots !== 1 ? 's' : ''} remaining
          </div>
        ) : (
          <div className="team-count">Team is full — <strong>Glacier</strong> in development</div>
        )}
      </div>

      <div className="card">
        <h2>Ghost. Not Blatant.</h2>
        <p>
          Glacier is an injectable ghost client for Minecraft 1.8.9, built in C++ with JNI bridging.
          Designed to bypass anticheats while maintaining a legitimate playstyle.
          Aim assist, autoclicker, reach, and everything in between &mdash; undetected.
        </p>
      </div>

      <div className="card">
        <h2>The Team</h2>
        <p>
          6 members, 36 roles, one build. Every module, every system, every line of code is planned and assigned.
          When a member finishes their 6 roles, they help others finish theirs.
          When the team is full, registration locks. No randoms. No bloat.
        </p>
      </div>

      <div className="card">
        <h2>60+ Modules</h2>
        <p>
          Combat, Render, Utility, Movement, World, Inventory, Minigames &mdash; full catalog with keybinds, status tracking, and per-module assignment. Every module has a bind slot. Every bind is configurable.
        </p>
      </div>
    </>
  );
}
