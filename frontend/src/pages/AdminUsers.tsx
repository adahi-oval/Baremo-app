import { useEffect, useState } from 'react';
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { Container, Row, Col, ButtonGroup, Button, Stack } from 'react-bootstrap';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAllUsersScored, type IUser } from '../api/user';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Divider from '../components/Divider';
import NameFilters from '../components/MeritTable/NameFilters';
import NameFilterPopover from '../components/MeritTable/NameFilterPopover';
import UserScorePieChart from '../components/Charts/UsersStatusPieChart';

const columnHelper = createColumnHelper<IUser>();

const columns = [
  columnHelper.accessor('fullName', {
    header: 'Nombre',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('researcherId', {
    header: 'ID de investigador',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('totalScore', {
    header: 'Puntuación Último Año',
    cell: info => info.getValue(),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as number;

      if (filterValue === 'true') return value >= 8;
      if (filterValue === 'avg') return value < 8 && (row.original.averageScore ?? 0) >= 8;
      if (filterValue === 'false') return value < 8 && (row.original.averageScore ?? 0) < 8;

      return true;
    }
  }),
  columnHelper.display({
    id: 'badge',
    header: 'Estado',
    cell: ({ row }) => {
      const score = row.original.totalScore === undefined ? 0 : row.original.totalScore;
      const average = row.original.averageScore === undefined ? 0 : row.original.averageScore;
      return score >= 8 ? (
        <span className='completeBadge'>Cumple</span>
      ) : (
        average >= 8 ? (
          <span className='halfCompleteBadge'>Cumple Media</span>
        ) : (
          <span className='incompleteBadge'>Incumple</span>
        )
      );
    },
  }),
];

const AdminUsersPage = () => {
  const [data, setData] = useState<IUser[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [columnFilters, setColumnFilters] = useState<any[]>(() => {
    const filtersFromParams: any[] = [];
    for (const [key, value] of searchParams.entries()) {
      filtersFromParams.push({ id: key, value });
    }

    for (const [key, value] of searchParams.entries()) {
      let parsedValue: any = value;
      if (value === "true") parsedValue = true;
      else if (value === "false") parsedValue = false;
      filtersFromParams.push({ id: key, value: parsedValue });
    }
    return filtersFromParams;
  });

  useEffect(() => {
    getAllUsersScored()
      .then(users =>
        setData(
          users.map(u => ({
            _id: u._id,
            fullName: u.fullName,
            researcherId: u.researcherId,
            totalScore: (u as any).totalScore ?? 0,
            averageScore: (u as any).averageScore ?? 0,
            email: u.email,
            institutes: u.institutes,
          }))
        )
      )
      .catch(console.error);
  }, []);

  useEffect(() => {
    const newParams: Record<string, string> = {};
    columnFilters.forEach(({ id, value }) => {
      if (value !== undefined) newParams[id] = String(value);
    });
    setSearchParams(newParams);
  }, [columnFilters, setSearchParams]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <Container fluid className='py-5'>
      <Row className="justify-content-center text-center mb-4">
        <Col md={8}>
          <h1 className="display-6 custom-title">Tabla de Usuarios</h1>
          <Divider />
        </Col>
      </Row>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={3}>
            <UserScorePieChart
              users={data}
              onSegmentClick={(status) => {
                setColumnFilters((prev) => {
                  const otherFilters = prev.filter(f => f.id !== 'badge');
                  if (status === 'Cumple') {
                    return [...otherFilters, { id: 'totalScore', value: 'true' }];
                  } else if (status === 'Cumple Media') {
                    return [...otherFilters, { id: 'totalScore', value: 'avg' }];
                  } else if (status === 'Incumple') {
                    return [...otherFilters, { id: 'totalScore', value: 'false' }];
                  }
                  return otherFilters;
                });
              }}
            />
          </Col>
        </Row>
        <Stack direction="horizontal">
          <NameFilters
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
          <NameFilterPopover
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
          <Button
            variant="outline-secondary"
            className="ms-2"
            onClick={() => {
              setColumnFilters([]);
              setSearchParams({});
            }}
          >
            Limpiar
          </Button>
        </Stack>
        <Row>
          <Col>
            <Container className="table">
              {table.getHeaderGroups().map(headerGroup => (
                <Row key={headerGroup.id} className="table-row-header">
                  {headerGroup.headers.map(header => (
                    <Col key={header.id} className="table-cell">
                      <div style={{ position: "relative", fontWeight: "bold" }}>
                        {typeof header.column.columnDef.header === "function"
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                      </div>
                    </Col>
                  ))}
                </Row>
              ))}
              {table.getRowModel().rows.map(row => (
                <Row key={row.id} className="table-row" onClick={() => { navigate(`/user/${row.original.researcherId}`) }} style={{ cursor: "pointer" }}>
                  {row.getVisibleCells().map(cell => (
                    <Col key={cell.id} className="table-cell">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Col>
                  ))}
                </Row>
              ))}
            </Container>
          </Col>
        </Row>
        <Stack direction='horizontal'>
          <Container className="mt-2">
            <p>Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</p>
            <ButtonGroup size="sm" is="attached">
              <Button
                onClick={() => table.getCanPreviousPage() ? table.previousPage() : ""}
                variant="light"
              >
                {"<"}
              </Button>
              <Button
                onClick={() => table.getCanNextPage() ? table.nextPage() : ""}
                variant="light"
              >
                {">"}
              </Button>
            </ButtonGroup>
          </Container>
          <button className="botonAdd" onClick={() => { navigate('/user/add') }}>
            <i className="bi bi-plus" style={{ background: "transparent", color: "white" }}></i>
          </button>
        </Stack>
      </Container>


    </Container>
  );
};

export default AdminUsersPage;
