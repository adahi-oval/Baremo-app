import { Form, Button } from 'react-bootstrap';
import type { Merit, MeritFields } from '../api/merits';

interface MeritFormProps {
  merit: Merit;
  onChange: (field: MeritFields, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  renderExtraFields: () => React.ReactNode;
  submitLabel?: string;
}

const MeritForm = ({
  merit,
  onChange,
  onSubmit,
  onCancel,
  renderExtraFields,
  submitLabel = 'Guardar Cambios',
}: MeritFormProps) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          value={merit.title}
          onChange={(e) => onChange('title', e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>ID de Investigador del usuario</Form.Label>
        <Form.Control
          type="number"
          value={merit.researcherId}
          onChange={(e) => onChange('researcherId', e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formYear">
        <Form.Label>Año</Form.Label>
        <Form.Select
          value={merit.year}
          onChange={(e) => onChange('year', Number(e.target.value))}
        >
          <option value="">Selecciona un año</option>
          {Array.from({ length: new Date().getFullYear() - 1959 }, (_, i) => {
            const year = 1960 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </Form.Select>
      </Form.Group>

      {renderExtraFields()}

      <div className="d-flex justify-content-between mt-5">
        <Button variant="ullSave" type="submit">
          <span>{submitLabel}</span>
        </Button>

        <Button variant="cancel" onClick={onCancel}>
          <span>Cancelar</span>
        </Button>
      </div>
    </Form>
  );
};

export default MeritForm;
