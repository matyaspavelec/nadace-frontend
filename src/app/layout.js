import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Nadace Inge a Miloše Pavelcových',
  description: 'Komunitní systém pro návrhy a hlasování o veřejně prospěšných projektech ve Vyšším Brodě.',
};

export const viewport = {
  themeColor: '#1a5632',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Nadace Inge a Miloše Pavelcových, Vyšší Brod</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
