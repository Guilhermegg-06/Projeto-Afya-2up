import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    Sparkles,
    UserRound,
    Users,
} from "lucide-react";
import Loader from "../components/Loader";
import {
    criarInscricao,
    listarAtividadesPorEvento,
    obterEvento,
} from "../services/api";

function normalizeActivity(activity) {
    return {
        id: activity.id,
        title: activity.titulo ?? activity.title ?? "Atividade",
        speaker: activity.palestrante ?? activity.speaker ?? "Palestrante nao informado",
        vacancies: Number(activity.vagas ?? activity.vacancies ?? 0),
        filled: Number(activity.ocupadas ?? activity.filled ?? 0),
        schedule: activity.horario ?? activity.time ?? "Horario nao informado",
        type: activity.tipo ?? activity.category ?? "Atividade",
    };
}

function formatDate(value) {
    if (!value) {
        return "Data nao informada";
    }

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function formatActivityStatus(activity) {
    const remaining = activity.vacancies - activity.filled;

    if (remaining <= 0) {
        return "Lotada";
    }

    return `${remaining} vagas disponiveis`;
}

async function carregarDetalhesEvento(eventoId) {
    return Promise.all([obterEvento(eventoId), listarAtividadesPorEvento(eventoId)]);
}

export default function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadDetails() {
            try {
                setError("");

                const [eventData, activitiesData] = await carregarDetalhesEvento(id);

                if (!active) {
                    return;
                }

                setEvent(eventData);
                setActivities((activitiesData ?? []).map(normalizeActivity));
            } catch {
                if (active) {
                    setError("Nao foi possivel carregar os detalhes deste evento.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadDetails();

        return () => {
            active = false;
        };
    }, [id]);

    async function reloadDetails() {
        try {
            setLoading(true);
            setError("");

            const [eventData, activitiesData] = await carregarDetalhesEvento(id);
            setEvent(eventData);
            setActivities((activitiesData ?? []).map(normalizeActivity));
        } catch {
            setError("Nao foi possivel atualizar os detalhes deste evento.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubscribe(activity) {
        if (activity.filled >= activity.vacancies) {
            setMessage("Nao ha vagas disponiveis para esta atividade.");
            return;
        }

        try {
            await criarInscricao({
                alunoId: 1,
                eventoId: Number(id),
                atividadeId: activity.id,
            });

            await reloadDetails();
            setMessage("Inscricao realizada com sucesso.");
        } catch {
            setMessage("Nao foi possivel concluir a inscricao.");
        }
    }

    const totalVacancies = activities.reduce((sum, activity) => sum + activity.vacancies, 0);
    const totalFilled = activities.reduce((sum, activity) => sum + activity.filled, 0);
    const occupancy = totalVacancies ? Math.round((totalFilled / totalVacancies) * 100) : 0;

    return (
        <main className="page">
            <Link className="event-back-link" to="/eventos">
                <ArrowLeft size={16} />
                Voltar para eventos
            </Link>

            <section className="event-detail-hero card" style={{ marginTop: 20 }}>
                <div className="events-kicker">
                    <Sparkles size={16} />
                    Detalhes do evento
                </div>

                {loading ? (
                    <Loader />
                ) : error ? (
                    <p>{error}</p>
                ) : event ? (
                    <>
                        <h1>{event.titulo ?? event.title}</h1>
                        <p>{event.descricao ?? event.description}</p>

                        <div className="event-detail-meta">
                            <span>
                                <CalendarDays size={14} />
                                {formatDate(event.dataInicio)}
                            </span>
                            <span>
                                <MapPin size={14} />
                                {event.local ?? "Local nao informado"}
                            </span>
                            <span>
                                <Users size={14} />
                                {occupancy}% de ocupacao
                            </span>
                        </div>

                        <div className="events-progress">
                            <div className="events-progress__header">
                                <span>Ocupacao geral</span>
                                <strong>{occupancy}%</strong>
                            </div>
                            <div className="events-progress__bar" aria-hidden="true">
                                <span style={{ width: `${occupancy}%` }} />
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Evento nao encontrado.</p>
                )}
            </section>

            {message ? <section className="card" style={{ marginTop: 16 }}>{message}</section> : null}

            <section style={{ marginTop: 24 }}>
                <div className="section-heading">
                    <div>
                        <span className="section-heading__eyebrow">
                            <UserRound size={16} />
                            Atividades disponiveis
                        </span>
                        <h2>Inscricoes por atividade</h2>
                    </div>
                    <p>
                        Controle de vagas e inscricoes individualizadas por palestra, minicurso
                        ou oficina.
                    </p>
                </div>

                {loading ? (
                    <div className="card">
                        <Loader />
                    </div>
                ) : (
                    <div className="events-list">
                        {activities.map((activity) => (
                            <article className="event-card" key={activity.id}>
                                <div className="event-card__header">
                                    <span className="event-chip">{activity.type}</span>
                                    <span className="event-date">
                                        <Clock3 size={14} />
                                        {activity.schedule}
                                    </span>
                                </div>

                                <h3>{activity.title}</h3>
                                <p>{activity.speaker}</p>

                                <div className="event-card__details">
                                    <span>
                                        <Users size={14} />
                                        {formatActivityStatus(activity)}
                                    </span>
                                    <span>
                                        <CheckCircle2 size={14} />
                                        {activity.filled}/{activity.vacancies} vagas
                                    </span>
                                </div>

                                <div className="event-card__footer">
                                    <strong>Vagas limitadas</strong>

                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() => handleSubscribe(activity)}
                                        disabled={activity.filled >= activity.vacancies}
                                    >
                                        {activity.filled >= activity.vacancies
                                            ? "Lotada"
                                            : "Inscrever-se"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
