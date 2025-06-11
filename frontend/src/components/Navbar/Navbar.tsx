// src/components/Navbar.tsx
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-blanco-ull.svg';
import './Navbar.css';

const CustomNavbar = () => {
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
        <Navbar.Toggle aria-controls="mainNavbar" style={{color: 'white'}} />
        <Navbar.Collapse id="mainNavbar" style={{color: 'white'}}>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="custom-link">Home</Nav.Link>
            <Nav.Link as={Link} to="/merits" className="custom-link">Méritos</Nav.Link>
            <Nav.Link as={Link} to="/users" className="custom-link">Usuarios</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
