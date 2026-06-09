import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ScanSearch, ShieldCheck, Ticket } from "lucide-react";
import Loader from "../components/Loader";
import SearchInput from "../components/SearchInput";
import {
    gerarCertificado,
    listarCertificadosDoAluno,
    listarInscricoesDoAluno,
    urlImagemCertificado,
    validarCertificado,
} from "../services/api";
import { alunoIdAtual } from "../services/session";

export default function MyCertificates() {
    const [alunoId, setAlunoId] = useState(() => alunoIdAtual());
    const [certificates, setCertificates] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [codigo, setCodigo] = useState("");
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadData(targetAlunoId = alunoId) {
        try {
            setLoading(true);
            setError("");

            const [certificateList, registrationList] = await Promise.all([
                listarCertificadosDoAluno(targetAlunoId),
                listarInscricoesDoAluno(targetAlunoId),
            ]);
            setCertificates(certificateList ?? []);
            setRegistrations(registrationList ?? []);
        } catch {
            setError("Nao foi possivel carregar seus certificados no momento.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const currentAlunoId = alunoIdAtual();
                const [certificateList, registrationList] = await Promise.all([
                    listarCertificadosDoAluno(currentAlunoId),
                    listarInscricoesDoAluno(currentAlunoId),
                ]);
                if (!cancelled) {
                    setCertificates(certificateList ?? []);
                    setRegistrations(registrationList ?? []);
                }
            } catch {
                if (!cancelled) {
                    setError("Nao foi possivel carregar seus certificados no momento.");
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
        await loadData(alunoId.trim() || alunoIdAtual());
    }

    async function handleValidate(event) {
        event.preventDefault();

        if (!codigo.trim()) {
            setMessage("Informe um codigo de validacao.");
            return;
        }

        try {
            setMessage("");
            const result = await validarCertificado(codigo.trim());
            setValidationResult(result);
            setMessage(result?.validado ? "Certificado validado com sucesso." : "Certificado localizado, mas pendente.");
        } catch {
            setValidationResult(null);
            setMessage("Nao foi possivel validar o certificado informado.");
        }
    }

    async function handleGenerate(registration) {
        if (registration.presenca !== "Confirmada") {
            setMessage("O coordenador ainda precisa confirmar sua presenca neste curso.");
            return;
        }

        try {
            setMessage("");
            const certificado = await gerarCertificado({
                alunoId: Number(alunoId.trim() || alunoIdAtual()),
                cursoId: Number(registration.cursoId),
            });
            setCodigo(certificado.codigo);
            setMessage("Certificado emitido. O codigo ja esta pronto para validacao.");
            await loadData(alunoId.trim() || alunoIdAtual());
        } catch (error) {
            if (error.status === 409) {
                setMessage("A presenca ainda nao foi confirmada para este curso.");
                return;
            }
            setMessage("Nao foi possivel emitir o certificado deste curso.");
        }
    }

    function certificateForCourse(courseId) {
        return certificates.find((certificate) => Number(certificate.cursoId) === Number(courseId));
    }

    return (
        <main className="page">
            <section className="card">
                <span className="panel-badge">
                    <BadgeCheck size={16} />
                    Certificados academicos
                </span>

                <h1>Meus certificados</h1>
                <p>
                    Depois que o coordenador confirma sua presenca no curso, voce pode
                    emitir o certificado e abrir a imagem oficial.
                </p>

                <form className="form" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
                    <label className="field">
                        <span>Aluno ID</span>
                        <SearchInput
                            name="alunoId"
                            type="number"
                            inputMode="numeric"
                            min="1"
                            value={alunoId}
                            onChange={(event) => setAlunoId(event.target.value)}
                            placeholder="Pesquisar aluno"
                            ariaLabel="Pesquisar certificados do aluno"
                        />
                    </label>

                    <button className="btn btn-primary" type="submit">
                        Atualizar dados
                    </button>
                </form>
            </section>

            {message ? <section className="card" style={{ marginTop: 16 }}>{message}</section> : null}

            {validationResult ? (
                <section className="card" style={{ marginTop: 16 }}>
                    <h2>Resultado da validacao</h2>
                    <p>Codigo: {validationResult.codigo}</p>
                    <p>Curso: {validationResult.cursoTitulo ?? `Curso ${validationResult.cursoId}`}</p>
                    <p>Status: {validationResult.validado ? "Valido" : "Pendente"}</p>
                    <a className="btn btn-primary" href={urlImagemCertificado(validationResult.codigo)} target="_blank" rel="noreferrer">
                        Abrir certificado em imagem
                    </a>
                </section>
            ) : null}

            <section style={{ marginTop: 24 }}>
                <div className="section-heading">
                    <div>
                        <span className="section-heading__eyebrow">
                            <Ticket size={16} />
                            Cursos inscritos
                        </span>
                        <h2>Emitir certificado</h2>
                    </div>
                    <p>O botao de emissao fica disponivel quando sua presenca estiver confirmada.</p>
                </div>

                {loading ? (
                    <div className="card">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="card">{error}</div>
                ) : registrations.length === 0 ? (
                    <div className="card">Nenhuma inscricao encontrada para este aluno.</div>
                ) : (
                    <div className="events-list">
                        {registrations.map((registration) => {
                            const certificate = certificateForCourse(registration.cursoId);
                            return (
                                <article className="event-card" key={registration.id}>
                                    <div className="event-card__header">
                                        <span className="event-chip">{registration.presenca}</span>
                                        <span className="event-date">Inscricao #{registration.id}</span>
                                    </div>

                                    <h3>{registration.cursoTitulo || `Curso ${registration.cursoId}`}</h3>
                                    <p>Status: {registration.status}</p>

                                    <div className="event-card__footer">
                                        {certificate ? <strong>Codigo {certificate.codigo}</strong> : <strong>Aguardando emissao</strong>}
                                        {certificate ? (
                                            <a className="btn btn-primary" href={urlImagemCertificado(certificate.codigo)} target="_blank" rel="noreferrer">
                                                Ver certificado
                                            </a>
                                        ) : (
                                            <button
                                                className="btn btn-primary"
                                                type="button"
                                                disabled={registration.presenca !== "Confirmada"}
                                                onClick={() => handleGenerate(registration)}
                                            >
                                                Emitir certificado
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <section style={{ marginTop: 24 }}>
                <div className="section-heading">
                    <div>
                        <span className="section-heading__eyebrow">
                            <ShieldCheck size={16} />
                            Validacao publica
                        </span>
                        <h2>Validar codigo</h2>
                    </div>
                    <p>Use o codigo do certificado para conferir se ele e valido.</p>
                </div>

                <form className="form" onSubmit={handleValidate} style={{ marginTop: 24 }}>
                    <label className="field">
                        <span>Codigo de validacao</span>
                        <SearchInput
                            name="codigo"
                            value={codigo}
                            onChange={(event) => setCodigo(event.target.value)}
                            placeholder="CERT-2026-001"
                            ariaLabel="Pesquisar certificado pelo codigo"
                        />
                    </label>

                    <button className="btn btn-primary" type="submit">
                        <ScanSearch size={16} />
                        Validar certificado
                    </button>
                </form>

                <div style={{ marginTop: 18 }}>
                    <Link className="btn btn-secondary" to="/cursos">
                        Voltar para cursos
                    </Link>
                </div>
            </section>
        </main>
    );
}
