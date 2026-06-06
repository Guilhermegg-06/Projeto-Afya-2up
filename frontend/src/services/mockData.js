export const mockEventos = [
    {
        id: 1,
        titulo: "Semana Academica de Computacao",
        dataInicio: "2026-06-20",
        dataFim: "2026-06-24",
        descricao:
            "Uma experiencia completa com palestras, minicursos e oficinas para conectar coordenacao, estudantes e convidados em um unico fluxo de inscricao.",
        local: "Auditorio Central e Laboratorios de Tecnologia",
        capacidade: 240,
        status: "Inscricoes abertas",
        ocupacao: 72,
        etiquetas: ["Presencial", "Certificado automatico", "Vagas limitadas"],
    },
    {
        id: 2,
        titulo: "Workshop de Java e Spring Boot",
        dataInicio: "2026-06-25",
        dataFim: "2026-06-25",
        descricao:
            "Atividade pratica focada em backend, boas praticas e organizacao de projetos reais.",
        local: "Laboratorio 03",
        capacidade: 20,
        status: "Inscricoes abertas",
        ocupacao: 90,
        etiquetas: ["Minicurso", "Backend", "Pratica"],
    },
    {
        id: 3,
        titulo: "Palestra: Carreira em Tecnologia",
        dataInicio: "2026-06-28",
        dataFim: "2026-06-28",
        descricao:
            "Encontro com convidados do mercado para discutir trajetorias, portfolio e empregabilidade.",
        local: "Sala Magna",
        capacidade: 80,
        status: "Inscricoes abertas",
        ocupacao: 68,
        etiquetas: ["Palestra", "Empregabilidade", "Networking"],
    },
];

export const mockAtividadesPorEvento = {
    1: [
        {
            id: 101,
            titulo: "Palestra: Carreira em Tecnologia",
            palestrante: "Prof. Joao Silva",
            vagas: 40,
            ocupadas: 25,
            horario: "19h as 21h",
            tipo: "Palestra",
        },
        {
            id: 102,
            titulo: "Minicurso: Introducao ao Spring Boot",
            palestrante: "Profa. Maria Souza",
            vagas: 20,
            ocupadas: 20,
            horario: "14h as 18h",
            tipo: "Minicurso",
        },
    ],
    2: [
        {
            id: 201,
            titulo: "Introducao ao Spring Boot",
            palestrante: "Equipe Java",
            vagas: 20,
            ocupadas: 18,
            horario: "14h as 18h",
            tipo: "Minicurso",
        },
    ],
    3: [
        {
            id: 301,
            titulo: "Mercado de trabalho e carreira",
            palestrante: "Convidado especial",
            vagas: 80,
            ocupadas: 54,
            horario: "19h as 21h",
            tipo: "Palestra",
        },
    ],
};

export let mockInscricoes = [
    {
        id: 1,
        alunoId: 1,
        atividadeId: 101,
        eventoId: 1,
        status: "Inscrito",
        presenca: "Pendente",
    },
];

export let mockPresencas = [
    {
        id: 1,
        atividadeId: 101,
        inscricaoId: 1,
        presente: true,
    },
];

export let mockCertificados = [
    {
        id: 1,
        alunoId: 1,
        eventoId: 1,
        atividadeTitulo: "Palestra: Carreira em Tecnologia",
        codigo: "CERT-2026-001",
        validado: true,
    },
];
