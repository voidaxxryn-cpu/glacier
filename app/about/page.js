export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <h1>About Glacier</h1>
      </div>

      <div className="about-section" style={{ padding: '40px 0' }}>
        <h2>What is Glacier?</h2>
        <p>
          Glacier is a ghost client for Minecraft 1.8.9. Injectable via C++ DLL with JNI bridging.
          Designed for players who want a competitive edge without getting banned.
          Every module is tuned to look legitimate.
        </p>

        <h2>Ghost vs. Blatant</h2>
        <p>
          A ghost client is injectable software that bypasses anticheats by mimicking legitimate player behavior.
          Glacier is built around this philosophy: <strong>undetected, not obvious</strong>.
        </p>

        <h2>Architecture</h2>
        <ul style={{ listStyle: 'none', marginBottom: 16 }}>
          {[
            'C++ core for performance and low-level hooking',
            'JNI bridge to interact with Minecraft\'s Java VM',
            'DLL injection for runtime attachment',
            'Packet interception and modification via the network layer',
            'Thread-safe event system for module communication',
          ].map((item, i) => (
            <li key={i} style={{
              fontSize: 14, padding: '5px 0 5px 24px', position: 'relative',
              transition: 'padding-left 0.2s',
            }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>—</span>
              {item}
            </li>
          ))}
        </ul>

        <h2>Help System</h2>
        <p>
          Every member owns 6 roles. Once you finish yours, you help others finish theirs.
          No one sits idle. No one struggles alone. The team ships when everyone ships.
        </p>

        <h2>The Team</h2>
        <p>
          6 members. 36 roles divided by expertise. Everyone builds, everyone owns their part,
          and when your part is done, you help with the rest.
        </p>
      </div>
    </>
  );
}
