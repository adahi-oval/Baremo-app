import { useState } from 'react';
import { Container, Row, Col, Card, Alert, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/user';
import Divider from '../components/Divider';
import type { Role } from '../api/user';

const AddUser = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [researcherId, setResearcherId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('user');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const result = await createUser({
        fullName,
        email,
        researcherId: Number(researcherId),
        password,
        role,
      });

      if (typeof result === 'string' && result.startsWith('Error:')) {
        setError(result);
      } else {
        navigate('/users');
      }
    } catch (err) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError('No se pudo crear el usuario.');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Agregar Usuario</h2>
              <Divider />
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="researcherId">
                  <Form.Label>ID de Investigador</Form.Label>
                  <Form.Control
                    type="number"
                    value={researcherId}
                    onChange={(e) => setResearcherId(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="role">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    required
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button type="submit" variant="ull">
                    <span>Crear Usuario</span>
                  </Button>
                  <Button variant="cancel" onClick={() => navigate(-1)}>
                    <span>Cancelar</span>
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddUser;
