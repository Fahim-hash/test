import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fahim — Creative Designer & Visual Storyteller',
  description: 'Portfolio of Syed Fahim Muddasir — visual identity, graphic design, motion, photography and creative digital experiences.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
