import { Container, Row, Col } from "react-bootstrap";
import MeritTable from "../components/MeritTable/MeritTable";

export const Merits = () => (
    <Container fluid className="py-5">
        <Row className="justify-content-center text-center mb-4">
            <Col md={6}>
                <h1 className="display-6 custom-title">Tabla de Méritos</h1>
                <div
                    style={{
                    height: '2px',
                    width: '100%',
                    backgroundColor: '#d3d3d3', // light gray
                    margin: '2rem auto',
                    }}
                />
            </Col>
        </Row>

        <Row>
            <Col>
                <MeritTable />
            </Col>
        </Row>
    </Container>
);
