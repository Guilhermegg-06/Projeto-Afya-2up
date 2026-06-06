import { Link } from "react-router-dom";
import { CalendarCheck, ClipboardCheck } from "lucide-react";

const actions = [
    {
        title: "Gerenciar eventos",
        description: "Abra a lista de eventos, acompanhe ocupacao e detalhes das atividades.",
        to: "/coordenador/eventos",
        icon: CalendarCheck,
    },
    {
        title: "Validar presenca",
        description: "Registre presencas por inscricao e confira a lista por atividade.",
        to: "/validar-presenca",
        icon: ClipboardCheck,
    },
];

export default function CoordinatorDashboard() {
    return (
        <main className="page dashboard-page">
            <section className="dashboard-hero">
                <span className="section-heading__eyebrow">Area do coordenador</span>
                <h1>Controle eventos, presencas e certificados com menos atrito.</h1>
                <p>Painel de trabalho para operacao diaria da AMRY cursos.</p>
            </section>

            <section className="dashboard-grid dashboard-grid--compact" aria-label="Acoes do coordenador">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Link className="dashboard-tile" to={action.to} key={action.title}>
                            <Icon size={24} />
                            <strong>{action.title}</strong>
                            <span>{action.description}</span>
                        </Link>
                    );
                })}
            </section>
        </main>
    );
}
