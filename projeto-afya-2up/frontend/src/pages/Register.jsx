import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    function handleRegister(event) {
        event.preventDefault();

        // Temporário: depois será integrado com o backend Java
        navigate("/");
    }

    return (
        <main className="page">
            <section className="card" style={{ maxWidth: 480, margin: "60px auto" }}>
                <h1>Cadastro de Aluno</h1>
                <p>Crie sua conta para participar dos eventos acadêmicos.</p>

                <form className="form" onSubmit={handleRegister} style={{ marginTop: 24 }}>
                    <input className="input" type="text" placeholder="Nome completo" />
                    <input className="input" type="email" placeholder="E-mail" />
                    <input className="input" type="text" placeholder="Matrícula" />
                    <input className="input" type="password" placeholder="Senha" />

                    <button className="btn btn-primary" type="submit">
                        Cadastrar
                    </button>

                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Voltar para login
                    </button>
                </form>
            </section>
        </main>
    );
}