import { Link } from "react-router-dom";

export default function StudentDashboard() {
    return (
        <main className="page">
            <h1>Dashboard do Aluno</h1>
            <p>Bem-vindo à plataforma de eventos acadêmicos.</p>

            <section style={{ display: "grid", gap: 16, marginTop: 24 }}>
                <Link className="card" to="/eventos">
                    Ver eventos disponíveis
                </Link>

                <Link className="card" to="/minhas-inscricoes">
                    Minhas inscrições
                </Link>

                <Link className="card" to="/meus-certificados">
                    Meus certificados
                </Link>
            </section>
        </main>
    );
}