import { Manrope } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { Metadata } from 'next';
import AuthGuard from '@/components/AuthGuard';
import { ClientProvider } from './ClientProvider';

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Baskit",
  description: "This is Baskit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <ClientProvider>
          <AuthGuard>
            <SidebarProvider>{children}</SidebarProvider>
          </AuthGuard>
        </ClientProvider>
      </body>
    </html>
  );
}