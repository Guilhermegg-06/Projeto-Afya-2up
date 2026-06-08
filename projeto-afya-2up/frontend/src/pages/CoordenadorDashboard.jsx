import { Link } from "react-router-dom";

export default function CoordinatorDashboard() {
    return (
        <main className="page">
            <h1>Dashboard do Coordenador</h1>
            <p>Gerencie eventos, atividades, presenças e certificados.</p>

            <section style={{ display: "grid", gap: 16, marginTop: 24 }}>
                <Link className="card" to="/eventos">
                    Gerenciar eventos
                </Link>

                <Link className="card" to="/validar-presenca">
                    Validar presença
                </Link>
            </section>
        </main>
    );
}