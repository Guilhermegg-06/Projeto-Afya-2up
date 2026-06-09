import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, BookOpen, Clock3, GraduationCap, Users } from "lucide-react";
import FavoriteToggle from "../components/FavoriteToggle";
import Loader from "../components/Loader";
import { criarInscricao, obterCurso } from "../services/api";
import { readFavorites, updateFavorite } from "../services/favorites";
import { alunoIdAtual } from "../services/session";

const COURSE_FAVORITES_KEY = "afya:favoritos:cursos";

function normalizeCourse(curso) {
    if (!curso) {
        return null;
    }

    const vagas = Number(curso.vagas ?? 0);
    const ocupadas = Number(curso.ocupadas ?? 0);

    return {
        id: curso.id,
        title: curso.titulo ?? "Curso sem nome",
        description: curso.descricao ?? "",
        instructor: curso.instrutor ?? "Instrutor nao informado",
        vacancies: vagas,
        filled: ocupadas,
        status: curso.status ?? "Inscricoes abertas",
        time: curso.horario ?? "Horario a definir",
        available: Math.max(vagas - ocupadas, 0),
    };
}

export default function EventDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [favoriteCourses, setFavoriteCourses] = useState(() => readFavorites(COURSE_FAVORITES_KEY));
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadCourse() {
        try {
            setLoading(true);
            setError("");
            const courseData = await obterCurso(id);
            setCourse(normalizeCourse(courseData));
        } catch {
            setError("Nao foi possivel carregar este curso.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const courseData = await obterCurso(id);
                if (active) {
                    setCourse(normalizeCourse(courseData));
                }
            } catch {
                if (active) {
                    setError("Nao foi possivel carregar este curso.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [id]);

    async function handleRegister() {
        if (!course || course.available <= 0) {
            setMessage("Nao ha vagas disponiveis para este curso.");
            return;
        }

        try {
            setMessage("");
            await criarInscricao({
                alunoId: Number(alunoIdAtual()),
                cursoId: course.id,
            });
            setMessage("Inscricao realizada com sucesso. Agora aguarde a validacao de presenca pelo coordenador.");
            await loadCourse();
        } catch (error) {
            if (error.status === 409) {
                setMessage("Voce ja esta inscrito neste curso ou as vagas acabaram.");
                return;
            }
            setMessage("Nao foi possivel concluir a inscricao.");
        }
    }

    function handleFavoriteCourse(checked) {
        setFavoriteCourses(updateFavorite(COURSE_FAVORITES_KEY, id, checked));
    }

    if (loading) {
        return (
            <main className="event-detail-page">
                <Loader />
            </main>
        );
    }

    if (error || !course) {
        return (
            <main className="event-detail-page">
                <Link className="event-back-link" to="/cursos">
                    <ArrowLeft size={16} />
                    Voltar para cursos
                </Link>
                <section className="card">
                    <p>{error || "Curso nao encontrado."}</p>
                </section>
            </main>
        );
    }

    return (
        <main className="event-detail-page">
            <Link className="event-back-link" to="/cursos">
                <ArrowLeft size={16} />
                Voltar para cursos
            </Link>

            <section className="event-detail-hero">
                <div>
                    <span className="events-kicker">
                        <GraduationCap size={16} />
                        Detalhes do curso
                    </span>

                    <span className="event-chip">ID do curso: {course.id}</span>
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>

                    <div className="event-detail-actions">
                        <button className="btn btn-primary" type="button" onClick={handleRegister}>
                            Inscrever-se no curso
                        </button>
                        <FavoriteToggle
                            checked={favoriteCourses.includes(String(id))}
                            onChange={handleFavoriteCourse}
                            label="Favoritar curso"
                        />
                    </div>

                    {message ? <p className="event-message">{message}</p> : null}
                </div>

                <aside className="event-detail-card">
                    <div className="panel-badge">
                        <BadgeCheck size={16} />
                        Fluxo do certificado
                    </div>
                    <p>
                        Depois da inscricao, o coordenador confirma a sua presenca. Com a
                        presenca confirmada, o certificado fica disponivel na area do aluno.
                    </p>
                    <p>ID usado no sistema: {course.id}</p>
                    <strong>{course.available} vagas restantes</strong>
                </aside>
            </section>

            <section className="stats-grid" aria-label="Informacoes do curso">
                <article className="stat-card">
                    <div className="stat-card__icon">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <span>Instrutor</span>
                        <strong>{course.instructor}</strong>
                        <p>responsavel pelo curso</p>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-card__icon">
                        <Clock3 size={18} />
                    </div>
                    <div>
                        <span>Horario</span>
                        <strong>{course.time}</strong>
                        <p>periodo informado pela coordenacao</p>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-card__icon">
                        <Users size={18} />
                    </div>
                    <div>
                        <span>Inscritos</span>
                        <strong>{course.filled}/{course.vacancies}</strong>
                        <p>{course.status}</p>
                    </div>
                </article>
            </section>
        </main>
    );
}
