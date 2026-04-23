import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MeetSpace',
  description: 'Meeting room booking app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <div className="bg-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
