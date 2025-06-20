import type { ReactNode } from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1, padding: '2rem' }}>
      {children}
    </main>
    <Footer />
  </div>
);
