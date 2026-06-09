import { useEffect, useMemo, useState } from "react";
import {
    atualizarCurso,
    criarCurso,
    deletarCurso,
    listarCursos,
} from "../services/api";
import Loader from "../components/Loader";
import SearchInput from "../components/SearchInput";

const emptyCourseForm = {
    titulo: "",
    descricao: "",
    instrutor: "",
    vagas: "",
    horario: "",
    status: "Inscricoes abertas",
};

function toCourseForm(curso) {
    return {
        titulo: curso.titulo ?? "",
        descricao: curso.descricao ?? "",
        instrutor: curso.instrutor ?? "",
        vagas: String(curso.vagas ?? ""),
        horario: curso.horario ?? "",
        status: curso.status ?? "Inscricoes abertas",
    };
}

export default function AdminEvents() {
    const [courses, setCourses] = useState([]);
    const [courseForm, setCourseForm] = useState(emptyCourseForm);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadCourses() {
        try {
            setLoading(true);
            setError("");
            const list = await listarCursos();
            setCourses(list ?? []);
        } catch {
            setError("Nao foi possivel carregar os cursos.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const list = await listarCursos();
                if (active) {
                    setCourses(list ?? []);
                }
            } catch {
                if (active) {
                    setError("Nao foi possivel carregar os cursos.");
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
    }, []);

    function updateCourseForm(field, value) {
        setCourseForm((current) => ({ ...current, [field]: value }));
    }

    function startEdit(course) {
        setEditingCourseId(course.id);
        setCourseForm(toCourseForm(course));
        setMessage(`Editando curso #${course.id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function resetForm() {
        setEditingCourseId(null);
        setCourseForm(emptyCourseForm);
    }

    async function handleCourseSubmit(event) {
        event.preventDefault();

        if (!courseForm.titulo.trim() || !courseForm.instrutor.trim() || !courseForm.vagas.trim()) {
            setMessage("Preencha titulo, instrutor e vagas do curso.");
            return;
        }

        const payload = {
            titulo: courseForm.titulo.trim(),
            descricao: courseForm.descricao.trim(),
            instrutor: courseForm.instrutor.trim(),
            vagas: Number(courseForm.vagas),
            horario: courseForm.horario.trim(),
            status: courseForm.status,
        };

        try {
            setSaving(true);
            setMessage("");
            if (editingCourseId) {
                await atualizarCurso(editingCourseId, payload);
                setMessage("Curso atualizado.");
            } else {
                await criarCurso(payload);
                setMessage("Curso criado.");
            }
            resetForm();
            await loadCourses();
        } catch {
            setMessage("Nao foi possivel salvar o curso.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(courseId) {
        const confirmed = window.confirm("Excluir este curso e suas inscricoes vinculadas?");
        if (!confirmed) {
            return;
        }

        try {
            setSaving(true);
            setMessage("");
            await deletarCurso(courseId);
            setMessage("Curso excluido.");
            await loadCourses();
        } catch {
            setMessage("Nao foi possivel excluir o curso.");
        } finally {
            setSaving(false);
        }
    }

    const filteredCourses = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            return courses;
        }

        return courses.filter((course) =>
            [course.titulo, course.descricao, course.instrutor, course.horario, course.status]
                .join(" ")
                .toLowerCase()
                .includes(term),
        );
    }, [courses, searchTerm]);

    const activeCourses = courses.filter((course) => course.status !== "Lotado").length;

    return (
        <main className="page admin-page">
            <section className="admin-hero">
                <div>
                    <span className="section-heading__eyebrow">Admin AMRY cursos</span>
                    <h1>Gestao de cursos.</h1>
                    <p>
                        Crie cursos, ajuste vagas e mantenha uma lista simples para o aluno se
                        inscrever e receber certificado depois da presenca.
                    </p>
                </div>

                <div className="admin-hero__stats">
                    <div>
                        <strong>{courses.length}</strong>
                        <span>cursos cadastrados</span>
                    </div>
                    <div>
                        <strong>{activeCourses}</strong>
                        <span>cursos abertos</span>
                    </div>
                </div>
            </section>

            {message ? <section className="card admin-message">{message}</section> : null}
            {error ? <section className="card admin-message">{error}</section> : null}

            <section className="admin-layout">
                <article className="card admin-form-card">
                    <div className="section-heading section-heading--compact">
                        <div>
                            <span className="section-heading__eyebrow">
                                {editingCourseId ? `Editando curso #${editingCourseId}` : "Novo curso"}
                            </span>
                            <h2>Dados do curso</h2>
                        </div>
                    </div>

                    <form className="form" onSubmit={handleCourseSubmit}>
                        <label className="field">
                            <span>Titulo</span>
                            <input
                                className="input"
                                value={courseForm.titulo}
                                onChange={(event) => updateCourseForm("titulo", event.target.value)}
                                placeholder="Java com Spring Boot"
                            />
                        </label>

                        <label className="field">
                            <span>Descricao</span>
                            <textarea
                                className="input"
                                rows="4"
                                value={courseForm.descricao}
                                onChange={(event) => updateCourseForm("descricao", event.target.value)}
                                placeholder="Explique o que o aluno vai aprender"
                            />
                        </label>

                        <label className="field">
                            <span>Instrutor</span>
                            <input
                                className="input"
                                value={courseForm.instrutor}
                                onChange={(event) => updateCourseForm("instrutor", event.target.value)}
                                placeholder="Nome do professor"
                            />
                        </label>

                        <div className="form-grid form-grid--two">
                            <label className="field">
                                <span>Vagas</span>
                                <input
                                    className="input"
                                    type="number"
                                    min="0"
                                    value={courseForm.vagas}
                                    onChange={(event) => updateCourseForm("vagas", event.target.value)}
                                    placeholder="30"
                                />
                            </label>

                            <label className="field">
                                <span>Horario</span>
                                <input
                                    className="input"
                                    value={courseForm.horario}
                                    onChange={(event) => updateCourseForm("horario", event.target.value)}
                                    placeholder="19h as 21h"
                                />
                            </label>
                        </div>

                        <button className="btn btn-primary" type="submit" disabled={saving}>
                            {editingCourseId ? "Salvar alteracoes" : "Criar curso"}
                        </button>

                        {editingCourseId ? (
                            <button className="btn btn-secondary" type="button" onClick={resetForm}>
                                Cancelar edicao
                            </button>
                        ) : null}
                    </form>
                </article>

                <article className="card admin-list-card">
                    <div className="section-heading section-heading--compact">
                        <div>
                            <span className="section-heading__eyebrow">Cursos</span>
                            <h2>Lista cadastrada</h2>
                        </div>
                        <SearchInput
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Buscar curso"
                            name="adminCourseSearch"
                            ariaLabel="Buscar curso"
                            buttonType="button"
                        />
                    </div>

                    {loading ? (
                        <Loader />
                    ) : filteredCourses.length === 0 ? (
                        <div className="admin-empty">Nenhum curso encontrado.</div>
                    ) : (
                        <div className="admin-table" role="table" aria-label="Cursos administrativos">
                            {filteredCourses.map((course) => (
                                <div className="admin-row" role="row" key={course.id}>
                                    <div>
                                        <strong>{course.titulo}</strong>
                                        <span>{course.instrutor}</span>
                                    </div>
                                    <div>
                                        <span>{course.ocupadas}/{course.vagas} vagas</span>
                                        <small>{course.horario}</small>
                                    </div>
                                    <div className="admin-row__actions">
                                        <button className="btn btn-secondary" type="button" onClick={() => startEdit(course)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-secondary" type="button" onClick={() => handleDelete(course.id)}>
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>
            </section>
        </main>
    );
}
