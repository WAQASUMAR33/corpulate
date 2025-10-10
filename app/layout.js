import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Corpulate - Business Management Platform',
  description: 'Complete business management solution with user authentication and email integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
