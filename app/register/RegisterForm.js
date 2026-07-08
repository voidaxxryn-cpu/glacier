'use client';
import { useState } from 'react';
import { registerMember } from './actions';
import { useRouter } from 'next/navigation';

export default function RegisterForm({ available }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    const fd = new FormData(e.target);
    const result = await registerMember(fd);

    if (result.redirect) {
      router.push(result.redirect);
    } else if (result.error) {
      setError(result.error);
      setPending(false);
    } else if (result.success) {
      setSuccess(result.success);
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="msg msg-error">{error}</div>}
      {success && <div className="msg msg-success">{success}</div>}

      <div className="card">
        <div className="form-group">
          <label htmlFor="minecraft_username">Minecraft Username</label>
          <input type="text" id="minecraft_username" name="minecraft_username" required placeholder="Username" />
        </div>
        <div className="form-group">
          <label htmlFor="discord_tag">Discord Tag</label>
          <input type="text" id="discord_tag" name="discord_tag" required placeholder="Discord username" />
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 16 }}>Your 6 Roles</h2>
        <div className="form-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="form-group" key={i}>
              <label htmlFor={`role_${i}`}>Role {i + 1}</label>
              <select id={`role_${i}`} name={`role_${i}`} required>
                <option value="">— Select Role —</option>
                {available.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.category})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn" disabled={pending}>
        {pending ? 'Registering...' : 'Join Glacier'}
      </button>
    </form>
  );
}
