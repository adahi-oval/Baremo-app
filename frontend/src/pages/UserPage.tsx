import { Col, Container, Row } from "react-bootstrap";
import Divider from "../components/Divider";
import MeritTable from "../components/MeritTable/MeritTable";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser, type IUser } from "../api/user";

const UserPage = () => {
  const { researcherId } = useParams<{ researcherId: string }>();
  const [user, setUser] = useState<IUser>();
  const [error, setError] = useState('');

  useEffect(() => {
    getUser(Number(researcherId))
      .then(setUser)
      .catch(() => setError('No se pudo cargar el usuario.'))
  });

  return (
    <Container fluid className="py-5">
        <Row className="justify-content-center text-center mb-4">
            <Col md={8}>
                <h1 className="display-6 custom-title">{user?.fullName}</h1>
                <Divider />
            </Col>
        </Row>

        <Row>
            <Col>
                <MeritTable mode="user" researcherId={Number(researcherId)}/>
            </Col>
        </Row>
    </Container>
  );
};

export default UserPage;
