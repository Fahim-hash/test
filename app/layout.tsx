import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillProof — Prove what you can do',
  description: 'Verify skills through practical challenges and help employers hire ability, not credentials.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
