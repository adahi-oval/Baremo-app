import { useEffect, useState } from "react"
import type { Merit } from "../api/merits"
import { getMeritById } from "../api/meritDetail";
import { useParams } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";


const MeritDetail = () => {
    const { id } = useParams<{id: string}>();
    const [merit, setMerit] = useState<Merit>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getMerit = async () => {
            setLoading(true);
            try {
                if (!id) throw new Error("No id provided in params");

                const merit = await getMeritById(id);
                setMerit(merit);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        getMerit();
    }, []);

    if (loading) return <Container><Spinner animation="border" /> Loading...</Container>;
    if (error) return <Container><p className="text-danger">{error}</p></Container>;
    if (!merit) return <Container><p>Merit not found.</p></Container>;

    return (
        <Container className="my-5">
            <h1>{merit.title}</h1>
            <p><strong>User:</strong> {merit.user.fullName}</p>
            <p><strong>Score:</strong> {merit.score}</p>
            <p><strong>Status:</strong> {merit.complete ? 'Completed' : 'Incomplete'}</p>
            <p><strong>Type:</strong> {merit.pubType}</p>
        </Container>
  );
}

export default MeritDetail;