import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/Navbar.module.css';

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const { user, logout } = useUser();
  const { items } = useCart();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.logo}>
          Elektronikos Shop
        </Link>

        <div className={styles.navLinks}>
          {children || (
            <>
              <Link to="/" className={styles.navLink}>
                Pagrindinis
              </Link>
              <Link to="/products" className={styles.navLink}>
                Prekės
              </Link>
              {!user && (
                <>
                  <Link to="/login" className={styles.navLink}>
                    Prisijungti
                  </Link>
                  <Link to="/register" className={styles.navLink}>
                    Registruotis
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link to="/cart" className={styles.navLink}>
                    Krepšelis ({items.length})
                  </Link>
                  <Link to="/profile" className={styles.navLink}>
                    Profilis
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className={styles.navLink}>
                      Admin
                    </Link>
                  )}
                  <button onClick={logout} className={styles.logoutButton}>
                    Atsijungti
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 