import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    CalendarDays,
    Clock3,
    GraduationCap,
    Sparkles,
    Ticket,
    Users,
} from "lucide-react";
import FavoriteToggle from "../components/FavoriteToggle";
import Loader from "../components/Loader";
import SearchInput from "../components/SearchInput";
import { readFavorites, updateFavorite } from "../services/favorites";
import { listarCursos } from "../services/api";

const COURSE_FAVORITES_KEY = "afya:favoritos:cursos";

const statsBase = [
    {
        label: "Cursos abertos",
        detail: "opcoes disponiveis para inscricao",
        icon: GraduationCap,
    },
    {
        label: "Vagas totais",
        detail: "controle por limite real",
        icon: Ticket,
    },
    {
        label: "Certificados",
        value: "100%",
        detail: "emissao apos presenca confirmada",
        icon: BadgeCheck,
    },
];

function normalizeCourse(curso) {
    if (!curso) {
        return null;
    }

    const vagas = Number(curso.vagas ?? 0);
    const ocupadas = Number(curso.ocupadas ?? 0);
    const progress = vagas <= 0 ? 0 : Math.round((ocupadas * 100) / vagas);

    return {
        id: curso.id,
        title: curso.titulo ?? "Curso sem nome",
        description: curso.descricao ?? "",
        instructor: curso.instrutor ?? "Instrutor nao informado",
        vacancies: vagas,
        filled: ocupadas,
        status: curso.status ?? "Inscricoes abertas",
        time: curso.horario ?? "Horario a definir",
        progress,
    };
}

function normalizeCourseList(items) {
    return items.map(normalizeCourse).filter(Boolean);
}

export default function Events() {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [favoriteCourses, setFavoriteCourses] = useState(() => readFavorites(COURSE_FAVORITES_KEY));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadCourses() {
            try {
                setLoading(true);
                setError("");

                const list = await listarCursos();

                if (!active) {
                    return;
                }

                setCourses(normalizeCourseList(list));
            } catch {
                if (active) {
                    setError("Nao foi possivel carregar os cursos no momento.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadCourses();

        return () => {
            active = false;
        };
    }, []);

    const stats = useMemo(() => {
        const totalCourses = courses.length;
        const totalVacancies = courses.reduce((sum, course) => sum + Number(course.vacancies || 0), 0);
        const avgProgress = totalCourses
            ? Math.round(courses.reduce((sum, course) => sum + Number(course.progress || 0), 0) / totalCourses)
            : 0;

        return statsBase.map((item) => {
            if (item.label === "Cursos abertos") {
                return { ...item, value: String(totalCourses || 0) };
            }

            if (item.label === "Vagas totais") {
                return { ...item, value: String(totalVacancies || 0) };
            }

            return { ...item, value: `${avgProgress || 0}%` };
        });
    }, [courses]);

    const filteredCourses = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            return courses;
        }

        return courses.filter((course) =>
            [course.title, course.description, course.instructor, course.status, course.time]
                .join(" ")
                .toLowerCase()
                .includes(term),
        );
    }, [courses, searchTerm]);

    const hero = courses[0];

    function handleFavoriteCourse(courseId, checked) {
        setFavoriteCourses(updateFavorite(COURSE_FAVORITES_KEY, courseId, checked));
    }

    return (
        <main className="events-page">
            <section className="events-hero">
                <div className="events-hero__content">
                    <span className="events-kicker">
                        <Sparkles size={16} />
                        Plataforma de cursos
                    </span>

                    <h1>Cursos disponiveis</h1>

                    <p className="events-lead">
                        Escolha um curso, confirme sua inscricao e acompanhe a presenca para
                        liberar o certificado ao final.
                    </p>

                    <div className="events-hero__actions">
                        <Link className="btn btn-primary" to={hero ? `/cursos/${hero.id}` : "/cursos"}>
                            Ver curso em destaque
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <aside className="events-hero__panel">
                    <div className="panel-badge">
                        <BookOpen size={16} />
                        Curso em destaque
                    </div>

                    {hero ? (
                        <>
                            <span className="event-chip">ID do curso: {hero.id}</span>
                            <h2>{hero.title}</h2>
                            <p>{hero.description}</p>

                            <div className="events-meta">
                                <div>
                                    <span className="meta-label">Instrutor</span>
                                    <strong>{hero.instructor}</strong>
                                </div>
                                <div>
                                    <span className="meta-label">Horario</span>
                                    <strong>{hero.time}</strong>
                                </div>
                                <div>
                                    <span className="meta-label">Vagas</span>
                                    <strong>{hero.vacancies}</strong>
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
                            Cursos abertos
                        </span>
                        <h2>Lista de cursos</h2>
                    </div>

                    <p>Escolha um curso para visualizar detalhes e realizar sua inscricao.</p>
                </div>

                <form
                    className="events-search"
                    onSubmit={(event) => event.preventDefault()}
                    role="search"
                    aria-label="Pesquisar cursos"
                >
                    <SearchInput
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Pesquisar cursos"
                        name="courseSearch"
                        buttonType="button"
                        ariaLabel="Pesquisar cursos"
                    />
                </form>

                {loading ? (
                    <div className="card">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="card">{error}</div>
                ) : filteredCourses.length === 0 ? (
                    <div className="card">Nenhum curso encontrado para esta pesquisa.</div>
                ) : (
                    <div className="events-list">
                        {filteredCourses.map((course) => (
                            <article className="event-card" key={course.id}>
                                <div className="event-card__header">
                                    <span className="event-chip">ID do curso: {course.id}</span>
                                    <span className="event-date">
                                        <CalendarDays size={14} />
                                        {course.time}
                                    </span>
                                </div>

                                <h3>{course.title}</h3>
                                <p>{course.description}</p>

                                <div className="event-card__details">
                                    <span>
                                        <BookOpen size={14} />
                                        {course.instructor}
                                    </span>
                                    <span>
                                        <Clock3 size={14} />
                                        {course.status}
                                    </span>
                                    <span>
                                        <Users size={14} />
                                        {course.filled}/{course.vacancies} inscritos
                                    </span>
                                </div>

                                <div className="event-card__footer">
                                    <strong>{course.vacancies} vagas</strong>

                                    <div className="event-card__actions">
                                        <FavoriteToggle
                                            checked={favoriteCourses.includes(String(course.id))}
                                            onChange={(checked) => handleFavoriteCourse(course.id, checked)}
                                            label="Favoritar"
                                        />

                                        <Link className="event-card__link" to={`/cursos/${course.id}`}>
                                            Ver curso
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
