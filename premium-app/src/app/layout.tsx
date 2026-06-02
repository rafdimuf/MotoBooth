import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import './globals.css'; // Kami anggap ini di-import atau dibuat nanti

export const metadata = {
  title: 'MotoBooth Premium Studio',
  description: 'Single Cloud Source of Truth Premium Studio for MotoBooth',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body style={{ fontFamily: "'Outfit', sans-serif", margin: 0, backgroundColor: '#f8fafc' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
