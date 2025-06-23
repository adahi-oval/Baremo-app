import { useEffect, useState } from "react"
import type { Merit } from "../api/merits"
import { getMeritById } from "../api/meritDetail";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Badge, Button } from "react-bootstrap";
import '../components/MeritTable/MeritTable.css';
import LoadingSpinner from "../components/LoadingSpinner";

const renderAdditionalFields = (merit: Merit) => {
  switch (merit.pubType) {
    case 'Article':
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Índice:</strong> {merit.index}</p>
            </Col>
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Posición:</strong> {merit.position}</p>
            </Col>
          </Row>
        </>
      );

    case 'Book':
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de Libro: </strong>{merit.bookType}</p>
            </Col>

            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Editorial:</strong> {merit.publisher}</p>
            </Col>
          </Row>

          <Row className="mb-3">

            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Posición editiorial:</strong> {merit.publisherPosition}</p>
            </Col>

            {merit.isbn && (
              <Col md={6} className="d-flex justify-content-center">
                <p><strong>ISBN:</strong> {merit.isbn}</p>
              </Col>
            )}
          </Row>

        </>
      );

    case 'Conference':
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de conferencia:</strong> {merit.conferenceType}</p>
            </Col>
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de contribución:</strong> {merit.contributionType}</p>
            </Col>
          </Row>
        </>
      );

    case "Award":
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de premio:</strong> {merit.awardType}</p>
            </Col>
          </Row>
        </>
      );

    case "Captacion":
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de captacion:</strong> {merit.captacionType}</p>
            </Col>
          </Row>
        </>
      );

    case "Catedra":
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de cátedra:</strong> {merit.catedraType}</p>
            </Col>
          </Row>
        </>
      );

    case "Contract":
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Rol en el contrato:</strong> {merit.role}</p>
            </Col>
          </Row>
        </>
      );

    case "Organization":
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de organización:</strong> {merit.organizationType}</p>
            </Col>
          </Row>
        </>
      );

    case "Project":
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de proyecto:</strong> {merit.projectType}</p>
            </Col>
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Rol en el proyecto:</strong> {merit.role}</p>
            </Col>
          </Row>
        </>
      );

    case "Sexenio":
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Estado del sexenio:</strong> {merit.active ? "Activo ✓" : "Inactivo 𐄂"}</p>
            </Col>
          </Row>
        </>
      );

    case "Thesis":
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de tesis:</strong> {merit.thesisType}</p>
            </Col>
          </Row>
        </>
      );

    case "Transference":
      return (
        <>
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo de transferencia de conocimiento:</strong> {merit.transferenceType}</p>
            </Col>
          </Row>
        </>
      );

    default:
      return null;
  }
};


const MeritDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [merit, setMerit] = useState<Merit>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getMerit = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("No id provided in params");

        const merit = await getMeritById(id);
        setMerit(merit);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    getMerit();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <Container><p className="text-danger">{error}</p></Container>;
  if (!merit) return <Container><p>Merit not found.</p></Container>;

  return (
    <Container className="my-5">
      <Card className="shadow-lg">
        <Card.Body>
          <Card.Title as="h2" className="mb-4 text-center customTitle">
            {merit.title}
          </Card.Title>

          <div
            style={{
              height: '2px',
              width: '80%',
              backgroundColor: '#e3e3e3',
              margin: '2rem auto',
            }}
          />

          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <div className="text-start" onClick={() => navigate(`/user/${merit.user!.researcherId}`)}>
                <p>
                  <strong>Usuario:</strong>{" "}
                  <span className="user-link">{merit.user!.fullName}</span>
                </p>
              </div>
            </Col>

            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Tipo:</strong> {merit.pubType}</p>
            </Col>
          </Row>

          {renderAdditionalFields(merit)}

          <div
            style={{
              height: '2px',
              width: '80%',
              backgroundColor: '#e3e3e3',
              margin: '2rem auto',
            }}
          />

          <Row className="mb-3" >
            <Col md={6} className="d-flex justify-content-center">
              <p>
                <strong>Estado:</strong>{' '}
                {merit.complete ? (
                  <Badge className="completeBadge">Completo</Badge>
                ) : (
                  <Badge className="incompleteBadge">Incompleto</Badge>
                )}
              </p>
            </Col>

            <Col md={6} className="d-flex justify-content-center">
              <p><strong>Puntuación:</strong> {merit.score}</p>
            </Col>


          </Row>
        </Card.Body>
        
        <Row className="mt-4">
          <Col className="d-flex justify-content-start" style={{ marginLeft: "15px" }}>
            <Link to={`/merit/${merit._id}/delete`} style={{ marginRight: "10px" }}>
              <Button className="botonUllDanger"><span>Eliminar</span></Button>
            </Link>
            
            <Link to={`/merit/${merit._id}/edit`} style={{ marginRight: "15px" }} state={{ merit }}>
              <Button className="botonUllEdit"><span>Editar</span></Button>
            </Link>
          </Col>

          <Col className="d-flex justify-content-end gap-2">
            <Link to={`/merits`}>
              <Button className="botonUll" style={{ marginRight: "15px" }}><span>Volver</span></Button>
            </Link>
          </Col>
        </Row>

      </Card>
    </Container>
  );
}

export default MeritDetail;