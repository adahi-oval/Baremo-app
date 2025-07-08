import { Button, Col, Container, Row } from "react-bootstrap";
import Divider from "../components/Divider";
import MeritTable from "../components/MeritTable/MeritTable";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser, type IUser } from "../api/user";

const UserPage = () => {
  const { researcherId } = useParams<{ researcherId: string }>();
  const [user, setUser] = useState<IUser>();
  const [institutes, setInstitutes] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    getUser(Number(researcherId))
      .then(setUser)
      .catch(() => setError('No se pudo cargar el usuario.'));
  }, [researcherId]);

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
          <h1 className="display-4 custom-title">{user?.fullName}</h1>
          <h3 className="display-8 custom-title">Instituto(s): {institutes}</h3>
          <Divider />
        </Col>
      </Row>

      <Row>
        <Col>
          <MeritTable mode="user" researcherId={Number(researcherId)} />
        </Col>
      </Row>

      <Button variant="ull" onClick={() => window.location.href = `/user/edit/${researcherId}`}>Editar Usuario</Button>
    </Container>
  );
};

export default UserPage;
