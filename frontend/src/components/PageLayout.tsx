import React from 'react';
import styles from '../styles/PageLayout.module.css';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout; 