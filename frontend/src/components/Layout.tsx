import type { ReactNode } from 'react';
import Navbar from './Navbar';
import { Footer } from './Footer';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <div>
    <Navbar />
    <main style={{ minHeight: '80vh', padding: '2rem' }}>
      {children}
    </main>
    <Footer />
  </div>
);
