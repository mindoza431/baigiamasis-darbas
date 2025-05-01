import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar>
        <Link className="nav-link" to="/">Pagrindinis</Link>
        <Link className="nav-link" to="/products">Produktai</Link>
        
        {user ? (
          <>
            <Link className="nav-link" to="/cart">Krepšelis</Link>
            <Link className="nav-link" to="/profile">Profilis</Link>
            {user.role === 'admin' && (
              <Link className="nav-link" to="/admin">Admin</Link>
            )}
            <button className="btn btn-link nav-link" onClick={handleLogout}>
              Atsijungti
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Prisijungti</Link>
            <Link className="nav-link" to="/register">Registruotis</Link>
          </>
        )}
      </Navbar>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout; 