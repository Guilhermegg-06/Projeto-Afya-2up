import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    CalendarDays,
    Clock3,
    LayoutGrid,
    MapPin,
    Sparkles,
    Ticket,
    Users,
} from "lucide-react";
import FavoriteToggle from "../components/FavoriteToggle";
import Loader from "../components/Loader";
import SearchInput from "../components/SearchInput";
import { readFavorites, updateFavorite } from "../services/favorites";
import { listarEventos, obterEvento } from "../services/api";

const EVENT_FAVORITES_KEY = "afya:favoritos:eventos";

const statsBase = [
    {
        label: "Eventos ativos",
        detail: "programacao aberta para inscricao",
        icon: CalendarDays,
    },
    {
        label: "Vagas disponiveis",
        detail: "controle por limite e lotacao",
        icon: Ticket,
    },
    {
        label: "Certificados",
        value: "100%",
        detail: "emissao apos validacao de presenca",
        icon: BadgeCheck,
    },
];

function formatDateRange(evento) {
    if (!evento?.dataInicio) {
        return "Data a definir";
    }

    const options = { day: "2-digit", month: "long", year: "numeric" };
    const inicio = new Date(`${evento.dataInicio}T00:00:00`).toLocaleDateString("pt-BR", options);
    const fim = evento.dataFim
        ? new Date(`${evento.dataFim}T00:00:00`).toLocaleDateString("pt-BR", options)
        : inicio;

    return inicio === fim ? inicio : `${inicio} ate ${fim}`;
}

function normalizeEvent(evento) {
    if (!evento) {
        return null;
    }

    return {
        id: evento.id,
        title: evento.titulo ?? evento.title ?? "Evento sem nome",
        description: evento.descricao ?? evento.description ?? "",
        date: formatDateRange(evento),
        location: evento.local ?? evento.location ?? "Local nao informado",
        capacity: evento.capacidade ?? evento.capacity ?? 0,
        status: evento.status ?? "Inscricoes abertas",
        progress: evento.ocupacao ?? evento.progress ?? 0,
        tags: evento.etiquetas ?? evento.tags ?? [],
    };
}

function normalizeEventList(items) {
    return items.map(normalizeEvent).filter(Boolean);
}

export default function Events() {
    const [events, setEvents] = useState([]);
    const [featuredEvent, setFeaturedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [favoriteEvents, setFavoriteEvents] = useState(() => readFavorites(EVENT_FAVORITES_KEY));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadEvents() {
            try {
                setLoading(true);
                setError("");

                const [list, featured] = await Promise.all([listarEventos(), obterEvento(1)]);

                if (!active) {
                    return;
                }

                const normalizedList = normalizeEventList(list);
                setEvents(normalizedList);
                setFeaturedEvent(normalizeEvent(featured) ?? normalizedList[0] ?? null);
            } catch {
                if (active) {
                    setError("Nao foi possivel carregar a programacao no momento.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadEvents();

        return () => {
            active = false;
        };
    }, []);

    const stats = useMemo(() => {
        const totalEvents = events.length;
        const totalCapacity = events.reduce((sum, event) => sum + Number(event.capacity || 0), 0);
        const avgProgress = totalEvents
            ? Math.round(
                  events.reduce((sum, event) => sum + Number(event.progress || 0), 0) / totalEvents,
              )
            : 0;

        return statsBase.map((item) => {
            if (item.label === "Eventos ativos") {
                return { ...item, value: String(totalEvents || 0) };
            }

            if (item.label === "Vagas disponiveis") {
                return { ...item, value: String(totalCapacity || 0) };
            }

            return { ...item, value: `${avgProgress || 0}%` };
        });
    }, [events]);

    const filteredEvents = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            return events;
        }

        return events.filter((event) => {
            const searchableText = [
                event.title,
                event.description,
                event.location,
                event.status,
                ...(event.tags ?? []),
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(term);
        });
    }, [events, searchTerm]);

    const hero = featuredEvent ?? events[0];

    function handleFavoriteEvent(eventId, checked) {
        setFavoriteEvents(updateFavorite(EVENT_FAVORITES_KEY, eventId, checked));
    }

    return (
        <main className="events-page">
            <section className="events-hero">
                <div className="events-hero__content">
                    <span className="events-kicker">
                        <Sparkles size={16} />
                        Gestao academica de eventos
                    </span>

                    <h1>Eventos disponiveis</h1>

                    <p className="events-lead">
                        Organize inscricoes, acompanhe vagas em tempo real e entregue
                        certificados com uma experiencia visual mais clara, elegante e
                        profissional.
                    </p>

                    <div className="events-hero__actions">
                        <Link className="btn btn-primary" to="/coordenador">
                            Acessar painel do coordenador
                        </Link>

                        <Link className="btn btn-secondary" to={hero ? `/eventos/${hero.id}` : "/eventos"}>
                            Ver destaque do evento
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <aside className="events-hero__panel">
                    <div className="panel-badge">
                        <LayoutGrid size={16} />
                        Visao geral da programacao
                    </div>

                    {hero ? (
                        <>
                            <h2>{hero.title}</h2>
                            <p>{hero.description}</p>

                            <div className="events-meta">
                                <div>
                                    <span className="meta-label">Periodo</span>
                                    <strong>{hero.date}</strong>
                                </div>
                                <div>
                                    <span className="meta-label">Local</span>
                                    <strong>{hero.location}</strong>
                                </div>
                                <div>
                                    <span className="meta-label">Capacidade</span>
                                    <strong>{hero.capacity}</strong>
                                </div>
                            </div>

                            <div className="events-progress">
                                <div className="events-progress__header">
                                    <span>{hero.status}</span>
                                    <strong>{hero.progress}%</strong>
                                </div>

                                <div className="events-progress__bar" aria-hidden="true">
                                    <span style={{ width: `${hero.progress}%` }} />
                                </div>
                            </div>

                            <div className="events-tags">
                                {hero.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <Loader />
                    )}
                </aside>
            </section>

            <section className="stats-grid" aria-label="Resumo da plataforma">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <article className="stat-card" key={stat.label}>
                            <div className="stat-card__icon">
                                <Icon size={18} />
                            </div>

                            <div>
                                <span>{stat.label}</span>
                                <strong>{stat.value}</strong>
                                <p>{stat.detail}</p>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="events-section">
                <div className="section-heading">
                    <div>
                        <span className="section-heading__eyebrow">
                            <BookOpen size={16} />
                            Programacao aberta
                        </span>
                        <h2>Lista de eventos</h2>
                    </div>

                    <p>
                        Selecione um evento para visualizar atividades, vagas e inscricoes
                        vinculadas.
                    </p>
                </div>

                <form
                    className="events-search"
                    onSubmit={(event) => event.preventDefault()}
                    role="search"
                    aria-label="Pesquisar eventos"
                >
                    <SearchInput
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Pesquisar eventos"
                        name="eventSearch"
                        buttonType="button"
                        ariaLabel="Pesquisar eventos"
                    />
                </form>

                {loading ? (
                    <div className="card">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="card">{error}</div>
                ) : filteredEvents.length === 0 ? (
                    <div className="card">Nenhum evento encontrado para esta pesquisa.</div>
                ) : (
                    <div className="events-list">
                        {filteredEvents.map((event) => (
                            <article className="event-card" key={event.id}>
                                <div className="event-card__header">
                                    <span className="event-chip">Evento academico</span>
                                    <span className="event-date">
                                        <CalendarDays size={14} />
                                        {event.date}
                                    </span>
                                </div>

                                <h3>{event.title}</h3>
                                <p>{event.description}</p>

                                <div className="event-card__details">
                                    <span>
                                        <MapPin size={14} />
                                        {event.location}
                                    </span>
                                    <span>
                                        <Clock3 size={14} />
                                        {event.status}
                                    </span>
                                    <span>
                                        <Users size={14} />
                                        {event.progress}% ocupado
                                    </span>
                                </div>

                                <div className="event-card__footer">
                                    <strong>{event.capacity} vagas</strong>

                                    <div className="event-card__actions">
                                        <FavoriteToggle
                                            checked={favoriteEvents.includes(String(event.id))}
                                            onChange={(checked) => handleFavoriteEvent(event.id, checked)}
                                            label="Favoritar"
                                        />

                                        <Link className="event-card__link" to={`/eventos/${event.id}`}>
                                            Ver detalhes
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
