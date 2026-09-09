import type { Metadata } from 'next';
import './globals.css';
import './kinetix.css';

export const metadata: Metadata = {
  title: 'KINETIX — Web Edition',
  description: 'A fast strategic chain-building card game. Control the current.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
