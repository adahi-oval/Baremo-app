import { useState, useEffect } from 'react';
import { Form, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getMeritById, updateMerit } from '../api/meritDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Merit, MeritFields } from '../api/merits';
import Divider from '../components/Divider';
import MeritForm from '../components/MeritForm';

const EditMerit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const meritFromState = (location.state as { merit?: Merit })?.merit;

  const [merit, setMerit] = useState<Merit | null>(meritFromState || null);
  const [updates, setUpdates] = useState<any>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!meritFromState);

  useEffect(() => {
    if (!meritFromState && id) {
      getMeritById(id)
        .then(setMerit)
        .catch(() => setError('No se pudo cargar el mérito.'))
        .finally(() => setLoading(false));
    }
  }, [id, meritFromState]);

  const handleChange = (field: MeritFields, value: any) => {
    if (merit) {
      setMerit({ ...merit, [field]: value });
      setUpdates({ ...updates, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merit) return;

    try {
      await updateMerit(merit._id!, updates);
      navigate(`/merit/${merit._id}`);
    } catch {
      setError('Hubo un error al actualizar el mérito.');
    }
  };

  const renderExtraFields = () => {
    if (!merit) return null;

    switch (merit.pubType) {
      case 'Article':
        return (
          <>
            <Form.Group className="mb-3" controlId="index">
              <Form.Label>Índice</Form.Label>
              <Form.Select
                value={merit.index}
                onChange={(e) =>
                  handleChange('index', e.target.value as typeof merit.index)
                }
              >
                <option value="jcr">JCR</option>
                <option value="sjr">SJR</option>
                <option value="no indexado">No indexado</option>
                <option value="n/a">N/A</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="position">
              <Form.Label>Posición</Form.Label>
              <Form.Select
                value={merit.position}
                onChange={(e) =>
                  handleChange('position', e.target.value as typeof merit.position)
                }
              >
                <option value="hcp">HCP</option>
                <option value="d1">D1</option>
                <option value="q1">Q1</option>
                <option value="q2">Q2</option>
                <option value="q3">Q3</option>
                <option value="q4">Q4</option>
                <option value="no indexado">No indexado</option>
                <option value="n/a">N/A</option>
              </Form.Select>
            </Form.Group>
          </>
        );

      case 'Book':
        return (
          <>
            <Form.Group className="mb-3" controlId="bookType">
              <Form.Label>Tipo de libro</Form.Label>
              <Form.Select
                value={merit.bookType}
                onChange={(e) =>
                  handleChange('bookType', e.target.value as typeof merit.bookType)
                }
              >
                <option value="Libro">Libro</option>
                <option value="Capítulo de libro">Capítulo de libro</option>
                <option value="n/a">N/A</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="publisher">
              <Form.Label>Editorial</Form.Label>
              <Form.Control
                type="text"
                value={merit.publisher}
                onChange={(e) =>
                  handleChange('publisher', e.target.value as typeof merit.publisher)
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="publisherPosition">
              <Form.Label>Posición editorial</Form.Label>
              <Form.Select
                value={merit.publisherPosition}
                onChange={(e) =>
                  handleChange('publisherPosition', e.target.value as typeof merit.publisherPosition)
                }
              >
                <option value="D1">D1</option>
                <option value="T1">T1</option>
                <option value="T2">T2</option>
                <option value="T3">T3</option>
                <option value="No Indexado">No Indexado</option>
                <option value="n/a">N/A</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="isbn">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                value={merit.isbn || ''}
                onChange={(e) => handleChange('isbn', e.target.value as typeof merit.isbn)}
              />
            </Form.Group>
          </>
        );

      case 'Award':
        return (
          <Form.Group className="mb-3" controlId="awardType">
            <Form.Label>Tipo de premio</Form.Label>
            <Form.Select
              value={merit.awardType}
              onChange={(e) => handleChange('awardType', e.target.value as typeof merit.awardType)}
            >
              <option value="national">Nacional</option>
              <option value="international">Internacional</option>
              <option value="autonomic">Autonómico</option>
              <option value="other">Otro</option>
              <option value="n/a">N/A</option>
            </Form.Select>
          </Form.Group>
        );

      case 'Captacion':
        return (
          <Form.Group className="mb-3" controlId="captacionType">
            <Form.Label>Tipo de captación</Form.Label>
            <Form.Select
              value={merit.captacionType}
              onChange={(e) => handleChange('captacionType', e.target.value as typeof merit.captacionType)}
            >
              <option value="excelencia caixa">Excelencia Caixa</option>
              <option value="viera y clavijo senior">Viera y Clavijo Senior</option>
              <option value="excelencia fundaciones">Excelencia Fundaciones</option>
              <option value="viera y clavijo junior">Viera y Clavijo Junior</option>
              <option value="agustin de betancourt">Agustín de Betancourt</option>
              <option value="n/a">N/A</option>
            </Form.Select>
          </Form.Group>
        );

      case 'Catedra':
        return (
          <Form.Group className="mb-3" controlId="catedraType">
            <Form.Label>Tipo de cátedra</Form.Label>
            <Form.Select
              value={merit.catedraType}
              onChange={(e) => handleChange('catedraType', e.target.value as typeof merit.catedraType)}
            >
              <option value="direccion">Dirección</option>
              <option value="subdireccion">Subdirección</option>
              <option value="n/a">N/A</option>
            </Form.Select>
          </Form.Group>
        );

      case 'Conference':
        return (
          <>
            <Form.Group className="mb-3" controlId="conferenceType">
              <Form.Label>Tipo de congreso</Form.Label>
              <Form.Select
                value={merit.conferenceType}
                onChange={(e) => handleChange('conferenceType', e.target.value as typeof merit.conferenceType)}
              >
                <option value="international">Internacional</option>
                <option value="national">Nacional</option>
                <option value="n/a">N/A</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="contributionType">
              <Form.Label>Tipo de contribución</Form.Label>
              <Form.Select
                value={merit.contributionType}
                onChange={(e) => handleChange('contributionType', e.target.value as typeof merit.contributionType)}
              >
                <option value="oral">Oral</option>
                <option value="poster">Póster</option>
                <option value="plenaria">Plenaria</option>
                <option value="invitada">Invitada</option>
                <option value="n/a">N/A</option>
              </Form.Select>
            </Form.Group>
          </>
        );

      case 'Contract':
        return (
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              value={merit.role}
              onChange={(e) => handleChange('role', e.target.value as typeof merit.role)}
            >
              <option value="coordinator">Coordinador/a</option>
              <option value="member">Miembro</option>
              <option value="n/a">N/A</option>
            </Form.Select>
          </Form.Group>
        );

      case 'Magazine':
        return null;

      case 'Organization':
        return (
          <Form.Group className="mb-3" controlId="organizationType">
            <Form.Label>Tipo de organización</Form.Label>
            <Form.Select
              value={merit.organizationType}
              onChange={(e) => handleChange('organizationType', e.target.value as typeof merit.organizationType)}
            >
              <option value="congresos internacionales">Congresos Internacionales</option>
              <option value="congresos nacionales">Congresos Nacionales</option>
              <option value="seminarios internacionales">Seminarios Internacionales</option>
              <option value="otros">Otros</option>
              <option value="n/a">N/A</option>
            </Form.Select>
          </Form.Group>
        );

      case 'Project':
        return (
          <>
            <Form.Group className="mb-3" controlId="projectType">
              <Form.Label>Tipo de proyecto</Form.Label>
              <Form.Select
                value={merit.projectType}
                onChange={(e) => handleChange('projectType', e.target.value as typeof merit.projectType)}
              >
                <option value="regional">Regional</option>
                <option value="national">Nacional</option>
                <option value="erasmus, interregional o similar">Erasmus / Interregional</option>
                <option value="H2020 o HEurope">H2020 / HEurope</option>
                <option value="n/a">N/A</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={merit.role}
                onChange={(e) => handleChange('role', e.target.value as typeof merit.role)}
              >
                <option value="(co)ip">(Co)IP</option>
                <option value="member">Miembro</option>
                <option value="n/a">N/A</option>
              </Form.Select>
            </Form.Group>
          </>
        );

      case 'Sexenio':
        return (
          <Form.Group className="mb-3" controlId="active">
            <Form.Check
              type="checkbox"
              label="¿Activo?"
              checked={merit.active}
              onChange={(e) => handleChange('active', e.target.checked)}
            />
          </Form.Group>
        );

      case 'Thesis':
        return (
          <Form.Group className="mb-3" controlId="thesisType">
            <Form.Label>Tipo de tesis</Form.Label>
            <Form.Select
              value={merit.thesisType}
              onChange={(e) => handleChange('thesisType', e.target.value as typeof merit.thesisType)}
            >
              <option value="industrial codirection">Codirección industrial</option>
              <option value="international mention">Mención internacional</option>
              <option value="fpu/fpi o similar">FPU/FPI o similar</option>
              <option value="other">Otro</option>
              <option value="n/a">N/A</option>
            </Form.Select>
          </Form.Group>
        );

      case 'Transference':
        return (
          <Form.Group className="mb-3" controlId="transferenceType">
            <Form.Label>Tipo de transferencia</Form.Label>
            <Form.Select
              value={merit.transferenceType}
              onChange={(e) => handleChange('transferenceType', e.target.value as typeof merit.transferenceType)}
            >
              <option value="patente en explotacion de la ull">Patente en explotación (ULL)</option>
              <option value="patente en explotacion con otra entidad vinculada">Patente con entidad vinculada</option>
              <option value="patentes no explotadas por la ull">Patente no explotada</option>
              <option value="empresa spin-off ull">Spin-off ULL</option>
              <option value="elaboracion de informes">Informes</option>
              <option value="propiedad intelectual">Propiedad intelectual</option>
              <option value="convenios de colaboracion">Convenios de colaboración</option>
              <option value="n/a">N/A</option>
            </Form.Select>
          </Form.Group>
        );


      default:
        return null;
    }
  };


  if (loading || !merit) return <LoadingSpinner />;

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Editar Mérito</h2>
              <Divider />
              {error && <Alert variant="danger">{error}</Alert>}
              <MeritForm
                merit={merit}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={() => navigate(-1)}
                renderExtraFields={renderExtraFields}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditMerit;
