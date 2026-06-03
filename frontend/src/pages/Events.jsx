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

const stats = [
    {
        label: "Eventos ativos",
        value: "12",
        detail: "programacao aberta para inscricao",
        icon: CalendarDays,
    },
    {
        label: "Vagas disponiveis",
        value: "184",
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

const featuredEvent = {
    id: 1,
    title: "Semana Academica de Computacao",
    date: "20 a 24 de junho de 2026",
    description:
        "Uma experiencia completa com palestras, minicursos e oficinas para conectar coordenacao, estudantes e convidados em um unico fluxo de inscricao.",
    location: "Auditorio Central e Laboratorios de Tecnologia",
    capacity: "240 participantes",
    status: "Inscricoes abertas",
    progress: 72,
    tags: ["Presencial", "Certificado automatico", "Vagas limitadas"],
};

const events = [
    {
        id: 2,
        title: "Workshop de Java e Spring Boot",
        date: "25 de junho de 2026",
        time: "14h as 18h",
        description:
            "Atividade pratica focada em backend, boas praticas e organizacao de projetos reais.",
        location: "Laboratorio 03",
        vacancies: "20 vagas",
        enrolled: "18 inscritos",
        category: "Minicurso",
    },
    {
        id: 3,
        title: "Palestra: Carreira em Tecnologia",
        date: "28 de junho de 2026",
        time: "19h as 21h",
        description:
            "Encontro com convidados do mercado para discutir trajetorias, portfolio e empregabilidade.",
        location: "Sala Magna",
        vacancies: "80 vagas",
        enrolled: "54 inscritos",
        category: "Palestra",
    },
    {
        id: 4,
        title: "Oficina de UX e prototipacao",
        date: "02 de julho de 2026",
        time: "09h as 12h",
        description:
            "Sessao aplicada para desenhar fluxos, prototipos e entregas mais claras para projetos academicos.",
        location: "Laboratorio de Design",
        vacancies: "30 vagas",
        enrolled: "26 inscritos",
        category: "Oficina",
    },
];

export default function Events() {
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

                        <Link className="btn btn-secondary" to={`/eventos/${featuredEvent.id}`}>
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

                    <h2>{featuredEvent.title}</h2>
                    <p>{featuredEvent.description}</p>

                    <div className="events-meta">
                        <div>
                            <span className="meta-label">Periodo</span>
                            <strong>{featuredEvent.date}</strong>
                        </div>
                        <div>
                            <span className="meta-label">Local</span>
                            <strong>{featuredEvent.location}</strong>
                        </div>
                        <div>
                            <span className="meta-label">Capacidade</span>
                            <strong>{featuredEvent.capacity}</strong>
                        </div>
                    </div>

                    <div className="events-progress">
                        <div className="events-progress__header">
                            <span>Ocupacao geral</span>
                            <strong>{featuredEvent.progress}%</strong>
                        </div>

                        <div className="events-progress__bar" aria-hidden="true">
                            <span style={{ width: `${featuredEvent.progress}%` }} />
                        </div>
                    </div>

                    <div className="events-tags">
                        {featuredEvent.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                        ))}
                    </div>
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

                <div className="events-list">
                    {events.map((event) => (
                        <article className="event-card" key={event.id}>
                            <div className="event-card__header">
                                <span className="event-chip">{event.category}</span>
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
                                    {event.time}
                                </span>
                                <span>
                                    <Users size={14} />
                                    {event.enrolled}
                                </span>
                            </div>

                            <div className="event-card__footer">
                                <strong>{event.vacancies}</strong>

                                <Link className="event-card__link" to={`/eventos/${event.id}`}>
                                    Ver detalhes
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
