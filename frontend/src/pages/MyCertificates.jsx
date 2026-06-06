import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ScanSearch, ShieldCheck, Ticket } from "lucide-react";
import Loader from "../components/Loader";
import SearchInput from "../components/SearchInput";
import { listarCertificadosDoAluno, validarCertificado } from "../services/api";

export default function MyCertificates() {
    const [alunoId, setAlunoId] = useState("1");
    const [certificates, setCertificates] = useState([]);
    const [codigo, setCodigo] = useState("");
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadCertificates(targetAlunoId = alunoId) {
        try {
            setLoading(true);
            setError("");

            const list = await listarCertificadosDoAluno(targetAlunoId);
            setCertificates(list ?? []);
        } catch {
            setError("Nao foi possivel carregar os certificados no momento.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const list = await listarCertificadosDoAluno("1");
                if (!cancelled) {
                    setCertificates(list ?? []);
                }
            } catch {
                if (!cancelled) {
                    setError("Nao foi possivel carregar os certificados no momento.");
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
        await loadCertificates(alunoId.trim() || "1");
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
            setMessage(
                result?.validado
                    ? "Certificado validado com sucesso."
                    : "Certificado localizado, mas ainda nao validado.",
            );
        } catch {
            setValidationResult(null);
            setMessage("Nao foi possivel validar o certificado informado.");
        }
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
                    A listagem abaixo vem de `/api/alunos/{alunoId}/certificados` e a
                    validacao usa `/api/certificados/validar/{codigo}`.
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
                        Atualizar certificados
                    </button>
                </form>
            </section>

            {message ? (
                <section className="card" style={{ marginTop: 16 }}>
                    {message}
                </section>
            ) : null}

            {validationResult ? (
                <section className="card" style={{ marginTop: 16 }}>
                    <h2>Resultado da validacao</h2>
                    <p>Codigo: {validationResult.codigo}</p>
                    <p>Atividade: {validationResult.atividadeTitulo ?? validationResult.atividadeId}</p>
                    <p>Status: {validationResult.validado ? "Valido" : "Pendente"}</p>
                </section>
            ) : null}

            <section style={{ marginTop: 24 }}>
                <div className="section-heading">
                    <div>
                        <span className="section-heading__eyebrow">
                            <Ticket size={16} />
                            Historico de emissao
                        </span>
                        <h2>Certificados vinculados</h2>
                    </div>
                    <p>
                        O backend devolve o codigo de validacao para cada certificado emitido.
                    </p>
                </div>

                {loading ? (
                    <div className="card">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="card">{error}</div>
                ) : certificates.length === 0 ? (
                    <div className="card">Nenhum certificado encontrado para este aluno.</div>
                ) : (
                    <div className="events-list">
                        {certificates.map((certificate) => (
                            <article className="event-card" key={certificate.codigo}>
                                <div className="event-card__header">
                                    <span className="event-chip">
                                        <ShieldCheck size={14} />
                                        {certificate.validado ? "Valido" : "Pendente"}
                                    </span>
                                    <span className="event-date">Codigo {certificate.codigo}</span>
                                </div>

                                <h3>Evento #{certificate.eventoId}</h3>
                                <p>{certificate.atividadeTitulo}</p>
                                <p>Aluno: {certificate.alunoId}</p>

                                <div className="event-card__footer">
                                    <strong>ID {certificate.id}</strong>
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={() => setCodigo(certificate.codigo)}
                                    >
                                        <ScanSearch size={16} />
                                        Validar codigo
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

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
                        Validar certificado
                    </button>
                </form>

                <div style={{ marginTop: 18 }}>
                    <Link className="btn btn-secondary" to="/eventos">
                        Voltar para eventos
                    </Link>
                </div>
            </section>
        </main>
    );
}
