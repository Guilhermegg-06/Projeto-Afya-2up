import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();

        // Temporário: depois vai ser integrado com o backend Java
        navigate("/aluno");
    }

    return (
        <main className="page">
            <section className="card" style={{ maxWidth: 420, margin: "80px auto" }}>
                <h1>Eventos Acadêmicos</h1>
                <p>Entre para acessar inscrições, eventos e certificados.</p>

                <form className="form" onSubmit={handleLogin} style={{ marginTop: 24 }}>
                    <input className="input" type="email" placeholder="E-mail" />
                    <input className="input" type="password" placeholder="Senha" />

                    <button className="btn btn-primary" type="submit">
                        Entrar como aluno
                    </button>

                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => navigate("/coordenador")}
                    >
                        Entrar como coordenador
                    </button>

                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => navigate("/cadastro")}
                    >
                        Criar conta
                    </button>
                </form>
            </section>
        </main>
    );
}
