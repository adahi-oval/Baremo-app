import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4 text-center">
              <h3 className="mb-3">Acceso Restringido</h3>
              <div
                style={{
                  height: '2px',
                  width: '80%',
                  backgroundColor: '#e3e3e3',
                  margin: '2rem auto',
                }}
              />

              <p>Lo sentimos, tu usuario no tiene permisos para acceder a esta página.</p>

              <div className='d-flex justify-content-center mt-4'>
                <div style={{ width: '60%', display: 'flex', justifyContent: 'space-between' }}>
                  <Button className='botonUll' onClick={() => navigate('/')}>
                    <span>Volver a Inicio</span>
                  </Button>

                  <Button variant='cancel' onClick={() => { logout(); window.location.href = '/'; }}>
                    <span>Cerrar sesión</span>
                  </Button>
                </div>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized;