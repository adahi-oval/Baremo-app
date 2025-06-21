import { Container, InputGroup } from "react-bootstrap";

interface FiltersProps {
  columnFilters: any[];
  setColumnFilters: any;
}

const Filters = ({ columnFilters, setColumnFilters }: FiltersProps) => {
  const title = columnFilters.find(f => f.id === 'title')?.value || '';
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
          placeholder="Título..."
          aria-label="Search"
          value={title}
          onChange={(e) => onFilterChange('title', e.target.value)}
        />
      </InputGroup>
    </Container>
  );
}

export default Filters;