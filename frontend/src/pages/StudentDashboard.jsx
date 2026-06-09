import { Link } from "react-router-dom";
import { BadgeCheck, BookOpen, GraduationCap } from "lucide-react";

const actions = [
    {
        title: "Cursos disponiveis",
        description: "Veja os cursos abertos e escolha onde quer se inscrever.",
        to: "/cursos",
        icon: BookOpen,
    },
    {
        title: "Minhas inscricoes",
        description: "Acompanhe status, presenca e cursos ja escolhidos.",
        to: "/minhas-inscricoes",
        icon: GraduationCap,
    },
    {
        title: "Meus certificados",
        description: "Consulte certificados emitidos e codigos de validacao.",
        to: "/meus-certificados",
        icon: BadgeCheck,
    },
];

export default function StudentDashboard() {
    return (
        <main className="page dashboard-page">
            <section className="dashboard-hero">
                <span className="section-heading__eyebrow">Area do aluno</span>
                <h1>Escolha cursos, acompanhe inscricoes e guarde certificados.</h1>
                <p>Um painel direto para continuar de onde voce parou.</p>
            </section>

            <section className="dashboard-grid" aria-label="Acoes do aluno">
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
