import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CircleX, Ticket, Users } from "lucide-react";
import { listarInscricoesDoAluno, removerInscricao } from "../services/api";

function formatStatus(value) {
    return value ?? "Inscrito";
}

export default function MyRegistrations() {
    const [alunoId, setAlunoId] = useState("1");
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadRegistrations(targetAlunoId = alunoId) {
        try {
            setLoading(true);
            setError("");

            const list = await listarInscricoesDoAluno(targetAlunoId);
            setRegistrations(list ?? []);
        } catch {
            setError("Nao foi possivel carregar suas inscricoes no momento.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const list = await listarInscricoesDoAluno("1");
                if (!cancelled) {
                    setRegistrations(list ?? []);
                }
            } catch {
                if (!cancelled) {
                    setError("Nao foi possivel carregar suas inscricoes no momento.");
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
        await loadRegistrations(alunoId.trim() || "1");
    }

    async function handleDelete(id) {
        try {
            setSaving(true);
            setMessage("");
            await removerInscricao(id);
            setMessage("Inscricao removida com sucesso.");
            await loadRegistrations();
        } catch {
            setMessage("Nao foi possivel remover a inscricao.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="page">
            <section className="card">
                <span className="panel-badge">
                    <Ticket size={16} />
                    Inscricoes do aluno
                </span>

                <h1>Minhas inscricoes</h1>
                <p>
                    Consulte as inscricoes armazenadas no backend usando o contrato
                    `/api/alunos/{alunoId}/inscricoes`.
                </p>

                <form className="form" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
                    <label className="field">
                        <span>Aluno ID</span>
                        <input
                            className="input"
                            type="number"
                            min="1"
                            value={alunoId}
                            onChange={(event) => setAlunoId(event.target.value)}
                            placeholder="1"
                        />
                    </label>

                    <button className="btn btn-primary" type="submit">
                        Atualizar inscricoes
                    </button>
                </form>
            </section>

            {message ? (
                <section className="card" style={{ marginTop: 16 }}>
                    {message}
                </section>
            ) : null}

            <section style={{ marginTop: 24 }}>
                <div className="section-heading">
                    <div>
                        <span className="section-heading__eyebrow">
                            <Users size={16} />
                            Historico sincronizado
                        </span>
                        <h2>Inscricoes carregadas</h2>
                    </div>
                    <p>
                        Cada item reflete o resultado do backend, com status e presenca
                        associados.
                    </p>
                </div>

                {loading ? (
                    <div className="card">Carregando inscricoes...</div>
                ) : error ? (
                    <div className="card">{error}</div>
                ) : registrations.length === 0 ? (
                    <div className="card">Nenhuma inscricao encontrada para este aluno.</div>
                ) : (
                    <div className="events-list">
                        {registrations.map((registration) => (
                            <article className="event-card" key={registration.id}>
                                <div className="event-card__header">
                                    <span className="event-chip">Inscricao #{registration.id}</span>
                                    <span className="event-date">
                                        <CalendarDays size={14} />
                                        Evento {registration.eventoId}
                                    </span>
                                </div>

                                <h3>Atividade {registration.atividadeId}</h3>
                                <p>Status: {formatStatus(registration.status)}</p>
                                <p>Presenca: {registration.presenca ?? "Pendente"}</p>

                                <div className="event-card__footer">
                                    <strong>Aluno {registration.alunoId}</strong>
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={() => handleDelete(registration.id)}
                                        disabled={saving}
                                    >
                                        <CircleX size={16} />
                                        Remover
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: 18 }}>
                    <Link className="btn btn-secondary" to="/eventos">
                        Voltar para eventos
                    </Link>
                </div>
            </section>
        </main>
    );
}
