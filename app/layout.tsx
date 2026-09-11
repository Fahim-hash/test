import type { Metadata } from 'next';
import './globals.css';
import './kinetix.css';
import './kx.css';

export const metadata: Metadata = { title: 'KINETIX — Online Edition', description: 'KINETIX strategic chain-building card game.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
