export default function EventDetails() {
    const activities = [
        {
            id: 1,
            title: "Palestra: Carreira em Tecnologia",
            speaker: "Prof. João Silva",
            vacancies: 40,
            filled: 25,
        },
        {
            id: 2,
            title: "Minicurso: Introdução ao Spring Boot",
            speaker: "Profa. Maria Souza",
            vacancies: 20,
            filled: 20,
        },
    ];

    function handleSubscribe(activity) {
        if (activity.filled >= activity.vacancies) {
            alert("Não há vagas disponíveis para esta atividade.");
            return;
        }

        alert("Inscrição realizada com sucesso!");
    }

    return (
        <main className="page">
            <h1>Detalhes do Evento</h1>
            <p>Veja as atividades disponíveis para inscrição.</p>

            <section style={{ display: "grid", gap: 16, marginTop: 24 }}>
                {activities.map((activity) => (
                    <article className="card" key={activity.id}>
                        <h2>{activity.title}</h2>
                        <p>Palestrante: {activity.speaker}</p>
                        <p>
                            Vagas: {activity.filled}/{activity.vacancies}
                        </p>

                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => handleSubscribe(activity)}
                        >
                            Inscrever-se
                        </button>
                    </article>
                ))}
            </section>
        </main>
    );
}