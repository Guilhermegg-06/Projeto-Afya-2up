import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardCheck, ClipboardList, UserRound } from "lucide-react";
import Loader from "../components/Loader";
import { criarPresenca, listarPresencasDaAtividade } from "../services/api";

export default function AttendanceValidation() {
    const [atividadeId, setAtividadeId] = useState("101");
    const [inscricaoId, setInscricaoId] = useState("1");
    const [presente, setPresente] = useState(true);
    const [presencas, setPresencas] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function loadPresencas(targetAtividadeId = atividadeId) {
        if (!targetAtividadeId.trim()) {
            setPresencas([]);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const list = await listarPresencasDaAtividade(targetAtividadeId);
            setPresencas(list ?? []);
        } catch {
            setError("Nao foi possivel carregar as presencas desta atividade.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const list = await listarPresencasDaAtividade("101");
                if (!cancelled) {
                    setPresencas(list ?? []);
                }
            } catch {
                if (!cancelled) {
                    setError("Nao foi possivel carregar as presencas desta atividade.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!atividadeId.trim() || !inscricaoId.trim()) {
            setMessage("Informe a atividade e a inscricao.");
            return;
        }

        try {
            setMessage("");
            await criarPresenca({
                atividadeId: Number(atividadeId),
                inscricaoId: Number(inscricaoId),
                presente,
            });
            setMessage("Presenca registrada com sucesso.");
            await loadPresencas(atividadeId);
        } catch {
            setMessage("Nao foi possivel registrar a presenca.");
        }
    }

    return (
        <main className="page">
            <section className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
                <span className="panel-badge">
                    <ClipboardCheck size={16} />
                    Validacao de presenca
                </span>

                <h1>Registrar presenca</h1>
                <p>
                    O formulario envia dados para `/api/presencas` e permite consultar
                    `/api/atividades/{atividadeId}/presencas`.
                </p>

                <form className="form" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
                    <label className="field">
                        <span>Atividade ID</span>
                        <input
                            className="input"
                            type="number"
                            min="1"
                            value={atividadeId}
                            onChange={(event) => setAtividadeId(event.target.value)}
                            placeholder="101"
                        />
                    </label>

                    <label className="field">
                        <span>Inscricao ID</span>
                        <input
                            className="input"
                            type="number"
                            min="1"
                            value={inscricaoId}
                            onChange={(event) => setInscricaoId(event.target.value)}
                            placeholder="1"
                        />
                    </label>

                    <label className="field" style={{ display: "flex", alignItems: "center" }}>
                        <span>Presente</span>
                        <input
                            type="checkbox"
                            checked={presente}
                            onChange={(event) => setPresente(event.target.checked)}
                            style={{ width: 18, height: 18 }}
                        />
                    </label>

                    <button className="btn btn-primary" type="submit">
                        <ClipboardList size={16} />
                        Registrar presenca
                    </button>
                </form>

                {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
                {error ? <p style={{ marginTop: 16 }}>{error}</p> : null}
            </section>

            <section style={{ marginTop: 24 }}>
                <div className="section-heading">
                    <div>
                        <span className="section-heading__eyebrow">
                            <UserRound size={16} />
                            Presencas consultadas
                        </span>
                        <h2>Lista da atividade atual</h2>
                    </div>
                    <p>
                        A listagem vem do backend e ajuda a conferir o que ja foi marcado.
                    </p>
                </div>

                {loading ? (
                    <div className="card">
                        <Loader />
                    </div>
                ) : presencas.length === 0 ? (
                    <div className="card">Nenhuma presenca registrada para esta atividade.</div>
                ) : (
                    <div className="events-list">
                        {presencas.map((presenca) => (
                            <article className="event-card" key={presenca.id}>
                                <div className="event-card__header">
                                    <span className="event-chip">
                                        <CheckCircle2 size={14} />
                                        {presenca.presente ? "Presente" : "Ausente"}
                                    </span>
                                    <span className="event-date">Presenca #{presenca.id}</span>
                                </div>

                                <h3>Inscricao {presenca.inscricaoId}</h3>
                                <p>Atividade {presenca.atividadeId}</p>
                            </article>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: 18 }}>
                    <Link className="btn btn-secondary" to="/coordenador">
                        Voltar ao painel
                    </Link>
                </div>
            </section>
        </main>
    );
}
