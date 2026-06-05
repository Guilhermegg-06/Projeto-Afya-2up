export default function MyCertificates() {
    return (
        <main className="page">
            <h1>Meus certificados</h1>

            <section className="card" style={{ marginTop: 24 }}>
                <h2>Semana Acadêmica de Computação</h2>
                <p>Atividade: Palestra Carreira em Tecnologia</p>
                <p>Código de validação: CERT-2026-001</p>

                <button className="btn btn-primary" type="button">
                    Visualizar certificado
                </button>
            </section>
        </main>
    );
}