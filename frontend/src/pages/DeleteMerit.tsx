import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { deleteMerit } from '../api/merits'; // Make sure this exists
import { useState } from 'react';

const DeleteMerit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      await deleteMerit(id);
      navigate('/merits');
    } catch (err) {
      console.error('Error deleting merit:', err);
      setDeleting(false);
    }
  };

  const handleCancel = () => navigate(`/merit/${id}`);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4 text-center">
              <h3 className="mb-3">¿Eliminar mérito?</h3>
              <div
                style={{
                  height: '2px',
                  width: '80%',
                  backgroundColor: '#e3e3e3',
                  margin: '2rem auto',
                }}
              />
              <p>¿Estás seguro de que quieres eliminar este mérito? Esta acción no se puede deshacer.</p>

              <div className='d-flex justify-content-center mt-4'>
                <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between' }}>
                  <Button className='botonUllDanger' onClick={handleDelete} disabled={deleting}>
                    <span>Eliminar</span>
                  </Button>

                  <Button className='botonUll' onClick={handleCancel}>
                    <span>Cancelar</span>
                  </Button>
                </div>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DeleteMerit;
