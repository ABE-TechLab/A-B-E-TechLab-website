import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Start a Project',
  description: 'Talk to ABE TechLab about product research, strategy, marketing, design, development, education technology or an existing product.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
