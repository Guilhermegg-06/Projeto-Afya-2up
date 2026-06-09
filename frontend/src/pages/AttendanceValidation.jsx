import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardCheck, ClipboardList, UserRound } from "lucide-react";
import Loader from "../components/Loader";
import {
    criarPresenca,
    listarCursos,
    listarInscricoesDoCurso,
    listarPresencasDoCurso,
} from "../services/api";

export default function AttendanceValidation() {
    const [courses, setCourses] = useState([]);
    const [cursoId, setCursoId] = useState("");
    const [presencas, setPresencas] = useState([]);
    const [inscricoes, setInscricoes] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function loadCoursesAndSelect() {
        const list = await listarCursos();
        setCourses(list ?? []);
        const firstId = list?.[0]?.id ? String(list[0].id) : "";
        setCursoId((current) => current || firstId);
        return firstId;
    }

    async function loadPresencas(targetCursoId = cursoId) {
        if (!targetCursoId) {
            setPresencas([]);
            setInscricoes([]);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [presenceList, registrationList] = await Promise.all([
                listarPresencasDoCurso(targetCursoId),
                listarInscricoesDoCurso(targetCursoId),
            ]);
            setPresencas(presenceList ?? []);
            setInscricoes(registrationList ?? []);
        } catch {
            setError("Nao foi possivel carregar as presencas deste curso.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const firstId = await loadCoursesAndSelect();
                if (!cancelled && firstId) {
                    const [presenceList, registrationList] = await Promise.all([
                        listarPresencasDoCurso(firstId),
                        listarInscricoesDoCurso(firstId),
                    ]);
                    setPresencas(presenceList ?? []);
                    setInscricoes(registrationList ?? []);
                }
            } catch {
                if (!cancelled) {
                    setError("Nao foi possivel carregar os cursos para presenca.");
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

    async function handleCourseChange(event) {
        const selected = event.target.value;
        setCursoId(selected);
        await loadPresencas(selected);
    }

    async function marcarPresenca(inscricao, presenteValor) {
        try {
            setMessage("");
            await criarPresenca({
                cursoId: Number(cursoId),
                inscricaoId: inscricao.id,
                presente: presenteValor,
            });
            setMessage(`Presenca atualizada para ${inscricao.alunoNome ?? `Aluno ${inscricao.alunoId}`}.`);
            await loadPresencas(cursoId);
        } catch {
            setMessage("Nao foi possivel atualizar a presenca desta inscricao.");
        }
    }

    const selectedCourse = useMemo(
        () => courses.find((course) => String(course.id) === String(cursoId)),
        [courses, cursoId],
    );

    return (
        <main className="page">
            <section className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
                <span className="panel-badge">
                    <ClipboardCheck size={16} />
                    Validacao de presenca
                </span>

                <h1>Registrar presenca no curso</h1>
                <p>
                    Escolha o curso, confira os alunos inscritos e marque quem participou.
                    Essa validacao libera a emissao do certificado para o aluno.
                </p>

                <form className="form" onSubmit={(event) => event.preventDefault()} style={{ marginTop: 24 }}>
                    <label className="field">
                        <span>Curso</span>
                        <select className="input" value={cursoId} onChange={handleCourseChange}>
                            <option value="">Selecione um curso</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.titulo}
                                </option>
                            ))}
                        </select>
                    </label>
                </form>

                {selectedCourse ? <p style={{ marginTop: 16 }}>Curso atual: {selectedCourse.titulo}</p> : null}
                {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
                {error ? <p style={{ marginTop: 16 }}>{error}</p> : null}
            </section>

            <section style={{ marginTop: 24 }}>
                <div className="section-heading">
                    <div>
                        <span className="section-heading__eyebrow">
                            <ClipboardList size={16} />
                            Inscricoes do curso
                        </span>
                        <h2>Marcar presenca por aluno</h2>
                    </div>
                    <p>O coordenador confere as inscricoes reais e marca presente ou ausente.</p>
                </div>

                {loading ? (
                    <div className="card">
                        <Loader />
                    </div>
                ) : inscricoes.length === 0 ? (
                    <div className="card">Nenhuma inscricao encontrada para este curso.</div>
                ) : (
                    <div className="events-list">
                        {inscricoes.map((inscricao) => (
                            <article className="event-card" key={inscricao.id}>
                                <div className="event-card__header">
                                    <span className="event-chip">Inscricao #{inscricao.id}</span>
                                    <span className="event-date">{inscricao.presenca}</span>
                                </div>
                                <h3>{inscricao.alunoNome ?? `Aluno ${inscricao.alunoId}`}</h3>
                                <p>{inscricao.cursoTitulo || `Curso ${inscricao.cursoId}`}</p>
                                <div className="event-card__footer">
                                    <strong>{inscricao.status}</strong>
                                    <div className="event-card__actions">
                                        <button className="btn btn-primary" type="button" onClick={() => marcarPresenca(inscricao, true)}>
                                            Presente
                                        </button>
                                        <button className="btn btn-secondary" type="button" onClick={() => marcarPresenca(inscricao, false)}>
                                            Ausente
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section style={{ marginTop: 24 }}>
                <div className="section-heading">
                    <div>
                        <span className="section-heading__eyebrow">
                            <UserRound size={16} />
                            Presencas consultadas
                        </span>
                        <h2>Lista do curso atual</h2>
                    </div>
                    <p>A listagem ajuda a conferir o que ja foi marcado neste curso.</p>
                </div>

                {loading ? null : presencas.length === 0 ? (
                    <div className="card">Nenhuma presenca registrada para este curso.</div>
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
                                <p>Curso {presenca.cursoId}</p>
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
