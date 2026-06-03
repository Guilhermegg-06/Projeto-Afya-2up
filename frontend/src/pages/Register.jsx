import { useNavigate } from "react-router-dom";
import { BadgeCheck, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

const benefits = [
    "Acesso aos eventos e minicursos",
    "Controle de inscricoes em tempo real",
    "Certificados emitidos apos validacao",
];

export default function Register() {
    const navigate = useNavigate();

    function handleRegister(event) {
        event.preventDefault();

        // Temporario: depois sera integrado com o backend Java
        navigate("/");
    }

    return (
        <main className="auth-page">
            <section className="auth-layout">
                <aside className="auth-panel">
                    <span className="auth-kicker">
                        <Sparkles size={16} />
                        Cadastro academico
                    </span>

                    <h1>Crie sua conta para participar dos eventos.</h1>

                    <p className="auth-description">
                        Uma interface limpa, elegante e objetiva para liberar o acesso aos
                        eventos, inscricoes e certificados da plataforma.
                    </p>

                    <div className="auth-benefits">
                        {benefits.map((benefit) => (
                            <div className="auth-benefit" key={benefit}>
                                <BadgeCheck size={18} />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="auth-panel__footer">
                        <div>
                            <GraduationCap size={18} />
                            Plataforma pensada para coordenacao e alunos
                        </div>
                        <div>
                            <ShieldCheck size={18} />
                            Fluxo preparado para validacao e certificados
                        </div>
                    </div>
                </aside>

                <section className="auth-card">
                    <div className="auth-card__header">
                        <span className="panel-badge">Formulario de cadastro</span>
                        <h2>Entradas do participante</h2>
                        <p>
                            Preencha os dados abaixo para criar seu acesso inicial na
                            plataforma.
                        </p>
                    </div>

                    <form className="form auth-form" onSubmit={handleRegister}>
                        <label className="field">
                            <span>Nome completo</span>
                            <input className="input" type="text" placeholder="Seu nome completo" />
                        </label>

                        <label className="field">
                            <span>E-mail</span>
                            <input className="input" type="email" placeholder="seuemail@dominio.com" />
                        </label>

                        <label className="field">
                            <span>Matricula</span>
                            <input className="input" type="text" placeholder="00000000" />
                        </label>

                        <label className="field">
                            <span>Senha</span>
                            <input className="input" type="password" placeholder="Crie uma senha" />
                        </label>

                        <button className="btn btn-primary auth-submit" type="submit">
                            Cadastrar conta
                        </button>

                        <button
                            className="btn btn-secondary auth-submit"
                            type="button"
                            onClick={() => navigate("/")}
                        >
                            Voltar para login
                        </button>
                    </form>
                </section>
            </section>
        </main>
    );
}
