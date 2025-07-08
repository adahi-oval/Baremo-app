import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser, type Role } from '../api/user';
import { useAuth } from '../components/AuthContext';
import Divider from '../components/Divider';
import LoadingSpinner from '../components/LoadingSpinner';

const EditUser = () => {
  const { researcherId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'user' | 'admin' | undefined>(undefined);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [institutes, setInstitutes] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

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
    const fetchUser = async () => {
      try {
        if (!user || loading) return;

        const fetchedUser = await getUser(Number(researcherId));
        if (!fetchedUser) {
          setError('Usuario no encontrado');
          return;
        }

        setFullName(fetchedUser.fullName);
        setEmail(fetchedUser.email);
        setInstitutes(fetchedUser.institutes);
        setRole(fetchedUser.role!)
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
        institutes,
        role,
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

                <Form.Group className="mb-4" controlId="institutes">
                  <Form.Label>Institutos (máximo 2)</Form.Label>
                  <div>
                    {allowedInstitutes.map(({ value, label }) => (
                      <Form.Check
                        key={value}
                        type="checkbox"
                        id={`institute-${value}`}
                        label={label}
                        value={value}
                        checked={institutes.includes(value)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                            if (institutes.length < 2) {
                              setInstitutes([...institutes, value]);
                            }
                          } else {
                            setInstitutes(institutes.filter((inst) => inst !== value));
                          }
                        }}
                        disabled={!institutes.includes(value) && institutes.length >= 2}
                      />
                    ))}
                  </div>
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
