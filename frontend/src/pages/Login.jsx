import { useNavigate } from "react-router-dom";
import { BadgeCheck, GraduationCap, HeartHandshake, Sparkles } from "lucide-react";
import AnimatedHeart from "../components/AnimatedHeart";

const loginHighlights = [
    "Eventos e minicursos em um unico lugar",
    "Favoritos para organizar sua trilha",
    "Certificados liberados apos presenca",
];

export default function Login() {
    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();
        navigate("/aluno");
    }

    return (
        <main className="auth-page login-page">
            <section className="auth-layout login-layout">
                <aside className="login-visual">
                    <span className="auth-kicker">
                        <Sparkles size={16} />
                        Plataforma academica
                    </span>

                    <div className="login-heart-scene">
                        <AnimatedHeart />
                    </div>

                    <div className="login-visual__copy">
                        <h1>Eventos Academicos</h1>
                        <p>
                            Acesse inscricoes, acompanhe atividades favoritas e mantenha
                            seus certificados em um fluxo simples.
                        </p>
                    </div>
                </aside>

                <section className="auth-card login-card">
                    <div className="auth-card__header">
                        <span className="panel-badge">
                            <HeartHandshake size={16} />
                            Entrar na conta
                        </span>
                        <h2>Acesso do participante</h2>
                        <p>Use seus dados para continuar na plataforma.</p>
                    </div>

                    <form className="form auth-form" onSubmit={handleLogin}>
                        <label className="field">
                            <span>E-mail</span>
                            <input className="input" type="email" placeholder="seuemail@dominio.com" />
                        </label>

                        <label className="field">
                            <span>Senha</span>
                            <input className="input" type="password" placeholder="Sua senha" />
                        </label>

                        <button className="btn btn-primary auth-submit" type="submit">
                            Entrar como aluno
                        </button>

                        <button
                            className="btn btn-secondary auth-submit"
                            type="button"
                            onClick={() => navigate("/coordenador")}
                        >
                            Entrar como coordenador
                        </button>

                        <button
                            className="btn btn-secondary auth-submit"
                            type="button"
                            onClick={() => navigate("/cadastro")}
                        >
                            Criar conta
                        </button>
                    </form>

                    <div className="login-highlights">
                        {loginHighlights.map((item) => (
                            <div className="login-highlight" key={item}>
                                <BadgeCheck size={16} />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="auth-panel__footer">
                        <div>
                            <GraduationCap size={18} />
                            Gestao de eventos feita para alunos e coordenadores
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}
