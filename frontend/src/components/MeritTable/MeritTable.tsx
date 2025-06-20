import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getAllMerits, type Merit } from "../../api/merits";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import './MeritTable.css';
import { useNavigate } from "react-router-dom";

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

const MeritTable = () => {
    const [data, setData] = useState<Merit[]>([]);
    
    useEffect(() => {
        const getMerits = async () => {
            try {
                const allMerits = await getAllMerits();
                setData(allMerits);
            } catch (err) {
                console.log('Failed to get all merits.')
            }
        };

        getMerits();
    }, []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    const navigate = useNavigate();

    console.log(table.getHeaderGroups());
    return (
        <Container>
            <Container className="table">
            {table.getHeaderGroups().map(headerGroup => (
                <Row key={headerGroup.id} className="table-row">
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
                <Row key={row.id} className="table-row" onClick={() => {navigate(`/merit/${row.original._id}`)}} style={{ cursor: "pointer"}}>
                {row.getVisibleCells().map(cell => (
                    <Col key={cell.id} className="table-cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Col>
                ))}
                </Row>
            ))}

            <Row className=" d-flex justify-content-end mt-4">
                <button className="botonAdd" onClick={() => {navigate('/merits/add')}}>
                    <i className="bi bi-plus" style={{ background: "transparent", color: "white" }}></i>
                </button>
            </Row>
            </Container>
        </Container>
    );

};

export default MeritTable;