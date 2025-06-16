import type { ReactNode } from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <div>
    <Navbar />
    <main style={{ minHeight: '100vh', padding: '2rem' }}>
      {children}
    </main>
    <Footer />
  </div>
);
