import { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { getInstituteScore } from '../api/merits';
import Divider from '../components/Divider';

const Home = () => {
  const [instituteScore, setInstituteScore] = useState<string>();
  const [selectedInstitute, setSelectedInstitute] = useState('');
  
  const allowedInstitutes: { value: string; label: string }[] = [
  { value: 'IUBO', label: 'Instituto Universitario de Bio-Orgánica Antonio González' },
  { value: 'IUDR', label: 'Instituto Universitario de Desarrollo Regional' },
  { value: 'IUDE', label: 'Instituto Universitario de la Empresa' },
  { value: 'IUETSP', label: 'Instituto Universitario de Enfermedades Tropicales y Salud Pública de Canarias' },
  { value: 'IUDEA', label: 'Instituto Universitario de Estudios Avanzados en Física Atómica Molecular y Fotónica' },
  { value: 'IUEM', label: 'Instituto Universitario de Estudios de las Mujeres' },
  { value: 'IUEMR', label: 'Instituto de Estudios Medievales y Renacentistas' },
  { value: 'IUIST', label: 'Instituto Universitario de Investigación Social y Turismo' },
  { value: 'IULAB', label: 'Instituto Universitario de Lingüística Andrés Bello' },
  { value: 'IUNEURO', label: 'Instituto Universitario de Neurociencia' },
  { value: 'IUMA', label: 'Instituto Universitario de Matemáticas y Aplicaciones' },
  { value: 'IUMN', label: 'Instituto de Materiales y Nanotecnología' },
  { value: 'IUTB', label: 'Instituto de Tecnologías Biomédicas' },
];

  useEffect(() => {
    if (!selectedInstitute) return;

    getInstituteScore(selectedInstitute)
      .then(setInstituteScore)
      .catch(console.error);
  }, [selectedInstitute]);

  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center mb-4">
        <Col md={8}>
          <h1 className="display-4 fw-bold">Bienvenido a la Plataforma del Baremo de Institutos Universitarios</h1>
          <Divider />
          <p className="lead text-muted mt-3">
            Explora, gestiona y visualiza los méritos académicos del P.D.I.
          </p>
          <Form.Group className="my-4">
            <Form.Label className="fw-semibold">Seleccione un instituto para mostrar su puntuación:</Form.Label>
            <Form.Select
              value={selectedInstitute}
              onChange={(e) => setSelectedInstitute(e.target.value)}
            >
              <option value="">-- Elige un instituto --</option>
              {allowedInstitutes.map((inst) => (
                <option key={inst.value} value={inst.value}>
                  {inst.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedInstitute && (
            <h3 className="lead fw-bold">
              Puntuación total del instituto: {instituteScore ?? 'Cargando...'}
            </h3>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;