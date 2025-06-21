import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-blanco-ull.svg';
import loginLogo from '../../assets/avatar.svg';
import './Navbar.css';
import { useAuth } from '../AuthContext';

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="custom-navbar" variant='dark'>
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo}
            height="80"
            className="d-inline-block align-top"
          />{' '}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="mainNavbar" style={{ color: 'white' }} />
        <Navbar.Collapse id="mainNavbar" className='custom-collapse'>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="custom-link">Home</Nav.Link>
            <Nav.Link as={Link} to="/merits" className="custom-link">Méritos</Nav.Link>
            <Nav.Link as={Link} to="/users" className="custom-link">Usuarios</Nav.Link>
          </Nav>
          
          {!user ? (
            <Nav.Link
              className='custom-link'
              onClick={() => {
                navigate('/login', { state: { from: window.location.pathname }, replace: true });
              }}
            >
              Iniciar sesión
            </Nav.Link>
          ) : (
            <NavDropdown
              title={
                <img src={loginLogo} height="30" alt="User" />
              }
              align="end"
              id="user-dropdown"
            >
              <NavDropdown.Item as={Link} to={`/user/${user.researcherId}`}>Mi perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
              >
                Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
          )}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
