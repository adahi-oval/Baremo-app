import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import Divider from './Divider';

const LoadingSpinner = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="text-center shadow">
            <Card.Body className="p-5">
              <Card.Title>Cargando...</Card.Title>
              <Divider />
              <Spinner animation="border" role="status" style={{ color: "darkviolet"}} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingSpinner;
