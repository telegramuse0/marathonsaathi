import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MarathonSaathi | Har Race Ka Saathi',
  description: 'Discover marathons across India, find your running community, and make every finish line feel closer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className="scroll-smooth">
      <body className="font-sans antialiased bg-[#F8FAFC] text-[#0F172A]">
        {children}
      </body>
    </html>
  );
}
