import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { getAllMerits, getUserMerits, type Merit } from "../../api/merits";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Row, Stack } from "react-bootstrap";
import './MeritTable.css';
import { useNavigate, useSearchParams } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import Filters from "./Filters";
import FilterPopover from "./FilterPopover";

interface MeritTableProps {
  mode: "all" | "user";
  researcherId?: number;
}

const columns = [
  {
    accessorKey: "pubType",
    header: "Tipo de Mérito",
    cell: (props: any) => <p style={{ backgroundColor: "inherit" }}>{props.getValue()}</p>
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: (props: any) => <p style={{ backgroundColor: "inherit" }}>{props.getValue()}</p>
  },
  {
    accessorKey: "user",
    header: "Investigador",
    cell: (props: any) => {
      const user = props.getValue();
      return <p style={{ backgroundColor: "inherit" }}>{user?.fullName ?? "Unknown"}</p>
    }
  },
  {
    accessorKey: "year",
    header: "Año",
    cell: (props: any) => {
      const year: number = props.getValue();

      return <p style={{ backgroundColor: "inherit" }}>{year === -1 ? "n/a" : year}</p>
    }
  },
  {
    accessorKey: "score",
    header: "Puntuación",
    cell: (props: any) => <p style={{ backgroundColor: "inherit" }}>{props.getValue()}</p>
  },
  {
    accessorKey: "complete",
    header: "Estado",
    cell: (props: any) => {
      const complete: boolean = props.getValue();

      return complete ?
        <span className="completeBadge">Completo</span>
        :
        <span className="incompleteBadge">Incompleto</span>
    }
  },
]

const MeritTable = ({ mode, researcherId }: MeritTableProps) => {
  const [data, setData] = useState<Merit[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

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
    const getMerits = async () => {
      try {
        const merits = mode === "all" ? await getAllMerits() : await getUserMerits(researcherId!);
        setData(merits);
      } catch (err) {
        console.log('Failed to get all merits.')
      }
    };

    getMerits();
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
  })

  const navigate = useNavigate();

  console.log(table.getHeaderGroups());
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Container>
        <Stack direction="horizontal">
          <Filters
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
          <FilterPopover
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </Stack>

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
            <Row key={row.id} className="table-row" onClick={() => { navigate(`/merit/${row.original._id}`) }} style={{ cursor: "pointer" }}>
              {row.getVisibleCells().map(cell => (
                <Col key={cell.id} className="table-cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Col>
              ))}
            </Row>
          ))}

          <Stack direction="horizontal">
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
            <button className="botonAdd" onClick={() => { navigate('/merits/add') }}>
              <i className="bi bi-plus" style={{ background: "transparent", color: "white" }}></i>
            </button>
          </Stack>
        </Container>
      </Container>
    </ProtectedRoute>

  );

};

export default MeritTable;