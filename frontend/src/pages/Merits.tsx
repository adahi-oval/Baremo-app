import { Container, Row, Col } from "react-bootstrap";
import MeritTable from "../components/MeritTable/MeritTable";
import Divider from "../components/Divider";
import { useAuth } from "../components/AuthContext";
import { useEffect, useState } from "react";

const Merits = () => {
    const { user, loading } = useAuth();
    const [institutes, setInstitutes] = useState<String>('');

    useEffect(() => {
        if (user?.institutes) {
            if (user.institutes.length === 2) {
                setInstitutes(`${user.institutes[0]}, ${user.institutes[1]}`);
            } else {
                setInstitutes(user.institutes.join(', '));
            }
        }
    }, [user]);

    return (
        <Container fluid className="py-5">
            <Row className="justify-content-center text-center mb-4">
                <Col md={8}>
                    <h1 className="display-6 custom-title">Tabla de Méritos</h1>
                    <h3 className="display-8 custom-title">Instituto(s): {institutes}</h3>
                    <Divider />
                </Col>
            </Row>

            <Row>
                <Col>
                    <MeritTable mode="all" researcherId={user?.researcherId!}/>
                </Col>
            </Row>
        </Container>
    );
};

export default Merits;
