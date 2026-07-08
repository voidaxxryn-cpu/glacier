import { getTeamCount, getAvailableRoles } from '@/lib/store';
import RegisterForm from './RegisterForm';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const [count, available] = await Promise.all([getTeamCount(), getAvailableRoles()]);
  const spots = 6 - count;

  return (
    <>
      <div className="page-header">
        <h1>Register</h1>
        {spots > 0 ? (
          <p>{spots} spot{spots !== 1 ? 's' : ''} open. Pick your 6 roles.</p>
        ) : (
          <p>The team is full.</p>
        )}
      </div>

      {spots <= 0 ? (
        <div className="lock-screen">
          <h2>Team is Full</h2>
          <p>Glacier's roster is locked. All 6 members have been assigned their roles.</p>
          <p style={{ marginTop: 16 }}><a href="/team" className="btn">View the Team</a></p>
        </div>
      ) : (
        <RegisterForm available={available} />
      )}
    </>
  );
}
