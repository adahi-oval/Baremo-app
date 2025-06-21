import { Container, InputGroup } from "react-bootstrap";

interface FiltersProps {
  columnFilters: any[];
  setColumnFilters: any;
}

const NameFilters = ({ columnFilters, setColumnFilters }: FiltersProps) => {
  const fullName = columnFilters.find(f => f.id === 'fullName')?.value || '';
  const onFilterChange = (id: string, value: string) => {
    const updatedFilters = columnFilters
      .filter(f => f.id !== id)
      .concat({ id, value });

    setColumnFilters(updatedFilters);
  };


  return (
    <Container>
      <InputGroup style={{ maxWidth: "20rem" }}>
        <InputGroup.Text>
          <i className="bi bi-search" aria-label="search"></i>
        </InputGroup.Text>
        <input
          type="text"
          className="form-control"
          placeholder="Nombre Completo..."
          aria-label="Search"
          value={fullName}
          onChange={(e) => onFilterChange('fullName', e.target.value)}
        />
      </InputGroup>
    </Container>
  );
}

export default NameFilters;