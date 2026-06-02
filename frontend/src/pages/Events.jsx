import { Link } from "react-router-dom";

const mockEvents = [
    {
        id: 1,
        title: "Semana Acadêmica de Computação",
        date: "2026-06-20",
        description: "Evento com palestras, minicursos e oficinas.",
    },
    {
        id: 2,
        title: "Workshop de Java e Spring Boot",
        date: "2026-06-25",
        description: "Atividade prática sobre backend com Java.",
    },
];

export default function Events() {
    return (
        <main className="page">
            <h1>Eventos disponíveis</h1>
            <p>Escolha um evento para ver as atividades.</p>

            <section style={{ display: "grid", gap: 16, marginTop: 24 }}>
                {mockEvents.map((event) => (
                    <Link className="card" to={`/eventos/${event.id}`} key={event.id}>
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        <small>Data: {event.date}</small>
                    </Link>
                ))}
            </section>
        </main>
    );
}