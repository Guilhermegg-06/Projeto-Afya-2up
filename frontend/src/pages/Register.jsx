import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { cadastrarAluno } from "../services/api";

const benefits = [
    "Acesso aos cursos disponiveis",
    "Controle de inscricoes em tempo real",
    "Certificados emitidos apos validacao",
];

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nome: "",
        email: "",
        cpf: "",
        senha: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleRegister(event) {
        event.preventDefault();

        if (!form.nome.trim() || !form.email.trim() || !form.cpf.trim() || !form.senha.trim()) {
            setMessage("Preencha todos os campos.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            await cadastrarAluno(form);
            setMessage("Cadastro criado. Agora faca login com seu e-mail e senha.");
            setTimeout(() => navigate("/"), 900);
        } catch (error) {
            if (error.status === 409) {
                setMessage("E-mail ou CPF ja cadastrado.");
                return;
            }
            if (error.status === 400) {
                setMessage("Confira os dados: CPF com 11 digitos e senha com no minimo 6 caracteres.");
                return;
            }

            setMessage("Nao foi possivel cadastrar agora.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-layout">
                <aside className="auth-panel">
                    <span className="auth-kicker">
                        <Sparkles size={16} />
                        Cadastro academico
                    </span>

                    <h1>Crie sua conta para participar dos cursos.</h1>

                    <p className="auth-description">
                        Uma interface limpa, elegante e objetiva para liberar o acesso aos
                        cursos, inscricoes e certificados da plataforma.
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
                            <input
                                className="input"
                                type="text"
                                placeholder="Seu nome completo"
                                value={form.nome}
                                onChange={(event) => updateField("nome", event.target.value)}
                            />
                        </label>

                        <label className="field">
                            <span>E-mail</span>
                            <input
                                className="input"
                                type="email"
                                placeholder="seuemail@dominio.com"
                                value={form.email}
                                onChange={(event) => updateField("email", event.target.value)}
                            />
                        </label>

                        <label className="field">
                            <span>CPF</span>
                            <input
                                className="input"
                                type="text"
                                placeholder="00000000000"
                                value={form.cpf}
                                onChange={(event) => updateField("cpf", event.target.value)}
                            />
                        </label>

                        <label className="field">
                            <span>Senha</span>
                            <input
                                className="input"
                                type="password"
                                placeholder="Crie uma senha"
                                value={form.senha}
                                onChange={(event) => updateField("senha", event.target.value)}
                            />
                        </label>

                        {message ? <p>{message}</p> : null}

                        <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
                            {loading ? "Cadastrando..." : "Cadastrar conta"}
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
