import { Container, Row, Col } from "react-bootstrap";
import MeritTable from "../components/MeritTable/MeritTable";
import Divider from "../components/Divider";

export const Merits = () => (
    <Container fluid className="py-5">
        <Row className="justify-content-center text-center mb-4">
            <Col md={8}>
                <h1 className="display-6 custom-title">Tabla de Méritos</h1>
                <Divider />
            </Col>
        </Row>

        <Row>
            <Col>
                <MeritTable mode="all"/>
            </Col>
        </Row>
    </Container>
);
