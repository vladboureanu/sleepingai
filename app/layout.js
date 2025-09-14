
import './globals.css';
import Image from 'next/image';

export const metadata = {
  title: 'SleepingAI',
  description: 'Bedtime stories, reimagined.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-screen antialiased">
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'dark') document.documentElement.classList.add('dark');
              } catch(_) {}
            `,
          }}
        />

        
        <Image
          src="/images/sleepingai-bg.png"
          alt="SleepingAI dreamy background"
          fill
          priority
          sizes="100vw"
          className="fixed inset-0 -z-30 object-cover"
        />

        
        <div className="only-bg-overlay" />

        
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}


