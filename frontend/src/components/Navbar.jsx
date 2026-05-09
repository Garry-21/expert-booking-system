import { Link, useLocation } from 'react-router-dom';
import { FiCalendar, FiSearch, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">
            <FiCalendar />
          </span>
          <span className="brand-text">
            Expert<span className="brand-accent">Book</span>
          </span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            id="nav-experts"
          >
            <FiSearch size={16} />
            <span>Explore</span>
          </Link>
          <Link
            to="/my-bookings"
            className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
            id="nav-bookings"
          >
            <FiUser size={16} />
            <span>My Bookings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
