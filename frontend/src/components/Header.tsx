import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Header = () => {
  const { user, logout } = useUser();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">E-Shop</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/products">Produktai</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Krepšelis</Link>
              </li>
            )}
            {user?.email === 'admin@example.com' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Administravimas</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Sveiki, {user.name}!</span>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={logout}>
                    Atsijungti
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Prisijungti</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registruotis</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header; 