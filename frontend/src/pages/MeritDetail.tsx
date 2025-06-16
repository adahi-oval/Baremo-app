import { useEffect, useState } from "react"
import type { Merit } from "../api/merits"
import { getMeritById } from "../api/meritDetail";
import { useParams, Link } from "react-router-dom";
import { Spinner, Container, Card, Row, Col, Badge, Button } from "react-bootstrap";
import '../components/MeritTable/MeritTable.css';


const MeritDetail = () => {
    const { id } = useParams<{id: string}>();
    const [merit, setMerit] = useState<Merit>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <Container><Spinner animation="border" /> Cargando...</Container>;
    if (error) return <Container><p className="text-danger">{error}</p></Container>;
    if (!merit) return <Container><p>Merit not found.</p></Container>;

    return (
        <Container className="my-5">
            <Card className="shadow-lg">

                <Link to={`/merits/${merit._id}/edit`}>
                    <button className="botonUll"><span>Editar</span></button>
                </Link>

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
                        <Col md={6}>
                            <p><strong>User:</strong> {merit.user.fullName}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Score:</strong> {merit.score}</p>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <p>
                                <strong>Status:</strong>{' '}
                                {merit.complete ? (
                                    <Badge className="completeBadge">Completo</Badge>
                                ) : (
                                    <Badge className="incompleteBadge">Incompleto</Badge>
                                )}
                            </p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Type:</strong> {merit.pubType}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
  );
}

export default MeritDetail;