import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getInstituteScore } from '../api/merits';

const Home = () => {
  const [instituteScore, setInstituteScore] = useState<string>();

  useEffect(() => {
    getInstituteScore()
      .then(setInstituteScore)
      .catch(console.error)
  }, []);

  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center mb-4">
        <Col md={8}>
          <h1 className="display-4 fw-bold">Bienvenido a la Plataforma del Baremo del I.U.E.M.</h1>
          <h3 className="fw-bold">Puntuación total del instituto: {instituteScore}</h3>
          <div
            style={{
              height: '2px',
              width: '100%',
              backgroundColor: '#d3d3d3',
              margin: '2rem auto',
            }}
          />
          <p className="lead text-muted mt-3">
            Explora, gestiona y visualiza los méritos académicos de los usuarios. 
            Esta plataforma te permite consultar publicaciones, puntuaciones y más.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;