// src/components/Navbar.tsx
import { Navbar, Nav, Container } from 'react-bootstrap';
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
            <Nav.Link href="/" className='custom-link'>Home</Nav.Link>
            <Nav.Link href="users" className='custom-link'>Users</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
