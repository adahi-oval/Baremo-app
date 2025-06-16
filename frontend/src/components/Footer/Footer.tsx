import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 text-dark">
      <Container>
        <Row className="text-center">
          <Col>
            <p className="mb-0">&copy; {new Date().getFullYear()} Baremo App. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;