import { useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, BookOpenCheck, GraduationCap, ShieldCheck } from "lucide-react";

const accessNotes = [
    "Inscricoes com controle de vagas",
    "Cursos favoritos para acompanhar depois",
    "Certificados vinculados a presenca",
];

export default function Login() {
    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();
        navigate("/aluno");
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
                            <input type="email" placeholder="seuemail@dominio.com" />
                        </label>

                        <label>
                            <span>Senha</span>
                            <input type="password" placeholder="Sua senha" />
                        </label>

                        <button className="login-submit" type="submit">
                            Entrar como aluno
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="login-actions">
                        <button type="button" onClick={() => navigate("/coordenador")}>
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
