import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, BookOpenCheck, GraduationCap, ShieldCheck } from "lucide-react";
import { loginUsuario } from "../services/api";
import { salvarUsuario } from "../services/session";

const accessNotes = [
    "Inscricoes com controle de vagas",
    "Cursos favoritos para acompanhar depois",
    "Certificados vinculados a presenca",
];

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [perfilDesejado, setPerfilDesejado] = useState("ALUNO");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function autenticar(perfil) {
        setPerfilDesejado(perfil);

        if (!email.trim() || !senha.trim()) {
            setMessage("Informe e-mail e senha.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            const usuario = await loginUsuario({ email, senha });

            if (usuario.perfil !== perfil) {
                setMessage(
                    perfil === "COORDENADOR"
                        ? "Este usuario nao e coordenador."
                        : "Este acesso pertence ao coordenador. Use a entrada de coordenador.",
                );
                return;
            }

            salvarUsuario(usuario);
            navigate(usuario.perfil === "COORDENADOR" ? "/coordenador" : "/aluno");
        } catch (error) {
            if (error.status === 401) {
                setMessage("E-mail ou senha invalidos.");
                return;
            }

            setMessage("Nao foi possivel entrar agora.");
        } finally {
            setLoading(false);
        }
    }

    function handleLogin(event) {
        event.preventDefault();
        autenticar("ALUNO");
    }

    return (
        <main className="login-screen">
            <div className="login-motion" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>

            <section className="login-shell">
                <div className="login-brand">
                    <div className="login-brand__mark">AM</div>
                    <div>
                        <strong>AMRY</strong>
                        <span>cursos</span>
                    </div>
                </div>

                <aside className="login-intro">
                    <span className="login-kicker">
                        <GraduationCap size={18} />
                        Plataforma academica
                    </span>

                    <h1>Entre para organizar seus cursos sem perder tempo.</h1>

                    <p>
                        Acompanhe eventos, atividades abertas, favoritos e certificados em
                        uma area feita para uso diario, limpa e objetiva.
                    </p>

                    <div className="login-statline" aria-label="Resumo do sistema">
                        <div>
                            <strong>24h</strong>
                            <span>acesso aos cursos</span>
                        </div>
                        <div>
                            <strong>100%</strong>
                            <span>validacao digital</span>
                        </div>
                        <div>
                            <strong>1</strong>
                            <span>painel central</span>
                        </div>
                    </div>
                </aside>

                <section className="login-panel">
                    <div className="login-panel__header">
                        <span>
                            <BookOpenCheck size={18} />
                            Acesso
                        </span>
                        <h2>Entrar na AMRY cursos</h2>
                        <p>Use seu e-mail academico para continuar.</p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <label>
                            <span>E-mail</span>
                            <input
                                type="email"
                                placeholder="seuemail@dominio.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </label>

                        <label>
                            <span>Senha</span>
                            <input
                                type="password"
                                placeholder="Sua senha"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                            />
                        </label>

                        {message ? <p>{message}</p> : null}

                        <button
                            className="login-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading && perfilDesejado === "ALUNO" ? "Entrando..." : "Entrar como aluno"}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="login-actions">
                        <button
                            type="button"
                            onClick={() => autenticar("COORDENADOR")}
                        >
                            Entrar como coordenador
                        </button>
                        <button type="button" onClick={() => navigate("/cadastro")}>
                            Criar conta
                        </button>
                    </div>

                    <div className="login-notes">
                        {accessNotes.map((note) => (
                            <div className="login-note" key={note}>
                                <BadgeCheck size={16} />
                                <span>{note}</span>
                            </div>
                        ))}
                    </div>

                    <div className="login-security">
                        <ShieldCheck size={18} />
                        <span>Ambiente preparado para autenticacao JWT.</span>
                    </div>
                </section>
            </section>
        </main>
    );
}
