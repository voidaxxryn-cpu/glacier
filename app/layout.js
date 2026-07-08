import './globals.css';
import Link from 'next/link';
import SfxWrapper from '@/components/SfxWrapper';

export const metadata = {
  title: 'Glacier — Ghost Client',
};

function NavLink({ href, children }) {
  return (
    <Link href={href}>{children}</Link>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SfxWrapper />
        <nav>
          <div className="container">
            <Link href="/" className="logo">Glacier<span>.</span></Link>
            <ul className="nav-links">
              <li><NavLink href="/">Home</NavLink></li>
              <li><NavLink href="/register">Register</NavLink></li>
              <li><NavLink href="/team">Team</NavLink></li>
              <li><NavLink href="/modules">Modules</NavLink></li>
              <li><NavLink href="/roadmap">Roadmap</NavLink></li>
              <li><NavLink href="/about">About</NavLink></li>
            </ul>
          </div>
        </nav>
        <main className="container">{children}</main>
        <footer>
          <div className="container">Glacier &mdash; 1.8.9 Ghost Client</div>
        </footer>
      </body>
    </html>
  );
}
