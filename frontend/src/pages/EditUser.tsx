import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser } from '../api/user';
import { useAuth } from '../components/AuthContext';
import Divider from '../components/Divider';
import LoadingSpinner from '../components/LoadingSpinner';

const EditUser = () => {
  const { researcherId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user || loading) return;

        if (user.researcherId !== Number(researcherId)) {
          navigate('/unauthorized');
          return;
        }

        const fetchedUser = await getUser(Number(researcherId));
        if (!fetchedUser) {
          setError('Usuario no encontrado');
          return;
        }

        setFullName(fetchedUser.fullName);
        setEmail(fetchedUser.email);
      } catch (err) {
        setError('No se pudo obtener la información del usuario');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUser();
  }, [user, loading, researcherId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const result = await updateUser(Number(researcherId), {
        fullName,
        email,
        ...(password ? { password } : {}),
      });

      if (typeof result === 'string' && result.startsWith('Error:')) {
        setError(result);
      } else {
        navigate(`/user/${researcherId}`);
      }
    } catch (err) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError('No se pudo actualizar el usuario.');
      }
    }
  };

  if (loading || initialLoading) return <LoadingSpinner />;

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Editar Perfil</h2>
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

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Nueva Contraseña (opcional)</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button type="submit" variant="ull">
                    <span>Guardar Cambios</span>
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

export default EditUser;
