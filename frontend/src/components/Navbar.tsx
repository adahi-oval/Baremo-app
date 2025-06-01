import { Link } from 'react-router-dom';
import '../Navbar.css';
import logo from '../assets/logo-blanco-ull.svg';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-4">
      <Link to="/" className="navbar-brand d-flex align-items-center">
        <img src={logo} alt="Logo" height="70" className="me-2" />
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link custom-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/users" className="nav-link custom-link">Users</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
