import {
    mockAtividadesPorEvento,
    mockCertificados,
    mockEventos,
    mockInscricoes,
    mockPresencas,
} from "./mockData";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
const USE_MOCK_FALLBACK = import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true";

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
        ...options,
    });

    if (!response.ok) {
        const error = new Error(`Request failed with status ${response.status}`);
        error.status = response.status;
        throw error;
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

async function withFallback(loader, fallbackValue) {
    try {
        return await loader();
    } catch (error) {
        if (!USE_MOCK_FALLBACK) {
            throw error;
        }

        if (error && Object.prototype.hasOwnProperty.call(error, "status")) {
            throw error;
        }

        return fallbackValue;
    }
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function formatDateRange(dataInicio, dataFim) {
    if (!dataInicio) {
        return "Data a definir";
    }

    const options = { day: "2-digit", month: "long", year: "numeric" };
    const inicio = new Date(`${dataInicio}T00:00:00`).toLocaleDateString("pt-BR", options);
    const fim = dataFim
        ? new Date(`${dataFim}T00:00:00`).toLocaleDateString("pt-BR", options)
        : inicio;

    return inicio === fim ? inicio : `${inicio} ate ${fim}`;
}

function normalizarEvento(evento) {
    if (!evento) {
        return null;
    }

    const dataInicio = evento.dataInicio ?? evento.date ?? null;
    const dataFim = evento.dataFim ?? evento.date ?? null;

    return {
        id: evento.id,
        titulo: evento.titulo ?? evento.title ?? "",
        descricao: evento.descricao ?? evento.description ?? "",
        dataInicio,
        dataFim,
        periodo: formatDateRange(dataInicio, dataFim),
        local: evento.local ?? evento.location ?? "",
        capacidade: Number(evento.capacidade ?? evento.capacity ?? 0),
        status: evento.status ?? "Inscricoes abertas",
        ocupacao: Number(evento.ocupacao ?? evento.progress ?? 0),
        etiquetas: evento.etiquetas ?? evento.tags ?? [],
    };
}

function normalizarAtividade(atividade) {
    if (!atividade) {
        return null;
    }

    return {
        id: atividade.id,
        eventoId: atividade.eventoId ?? null,
        titulo: atividade.titulo ?? atividade.title ?? "",
        descricao: atividade.descricao ?? atividade.description ?? "",
        palestrante: atividade.palestrante ?? atividade.speaker ?? "",
        vagas: Number(atividade.vagas ?? atividade.vacancies ?? 0),
        ocupadas: Number(atividade.ocupadas ?? atividade.filled ?? 0),
        horario: atividade.horario ?? atividade.time ?? "",
        tipo: atividade.tipo ?? atividade.category ?? "Atividade",
    };
}

function normalizarInscricao(inscricao) {
    if (!inscricao) {
        return null;
    }

    return {
        id: inscricao.id,
        alunoId: inscricao.alunoId,
        alunoNome: inscricao.alunoNome ?? `Aluno ${inscricao.alunoId}`,
        eventoId: inscricao.eventoId,
        atividadeId: inscricao.atividadeId,
        status: inscricao.status ?? "Inscrito",
        presenca: inscricao.presenca ?? "Pendente",
    };
}

function normalizarPresenca(presenca) {
    if (!presenca) {
        return null;
    }

    return {
        id: presenca.id,
        atividadeId: presenca.atividadeId,
        inscricaoId: presenca.inscricaoId,
        presente: Boolean(presenca.presente),
    };
}

function normalizarCertificado(certificado) {
    if (!certificado) {
        return null;
    }

    return {
        id: certificado.id,
        alunoId: certificado.alunoId,
        eventoId: certificado.eventoId,
        atividadeId: certificado.atividadeId ?? null,
        atividadeTitulo: certificado.atividadeTitulo ?? certificado.atividade ?? "",
        codigo: certificado.codigo,
        validado: Boolean(certificado.validado),
    };
}

export async function listarEventos() {
    const fallback = clone(mockEventos).map(normalizarEvento);
    const response = await withFallback(() => request("/eventos"), fallback);
    return Array.isArray(response) ? response.map(normalizarEvento) : fallback;
}

export async function obterEvento(id) {
    const fallback = normalizarEvento(
        clone(mockEventos).find((evento) => Number(evento.id) === Number(id)),
    );
    const response = await withFallback(() => request(`/eventos/${id}`), fallback);
    return normalizarEvento(response);
}

export async function criarEvento(payload) {
    const result = await request("/eventos", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return normalizarEvento(result);
}

export async function atualizarEvento(id, payload) {
    const result = await request(`/eventos/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return normalizarEvento(result);
}

export async function deletarEvento(id) {
    await request(`/eventos/${id}`, {
        method: "DELETE",
    });
}

export async function listarAtividadesPorEvento(eventoId) {
    const fallback = clone(mockAtividadesPorEvento[Number(eventoId)] ?? []).map(normalizarAtividade);
    const response = await withFallback(
        () => request(`/eventos/${eventoId}/atividades`),
        fallback,
    );

    return Array.isArray(response) ? response.map(normalizarAtividade) : fallback;
}

export async function obterAtividade(id) {
    const fallback = normalizarAtividade(
        Object.values(mockAtividadesPorEvento)
            .flat()
            .find((atividade) => Number(atividade.id) === Number(id)),
    );
    const response = await withFallback(() => request(`/atividades/${id}`), fallback);
    return normalizarAtividade(response);
}

export async function criarAtividade(eventoId, payload) {
    const result = await request(`/eventos/${eventoId}/atividades`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return normalizarAtividade(result);
}

export async function atualizarAtividade(id, payload) {
    const result = await request(`/atividades/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return normalizarAtividade(result);
}

export async function deletarAtividade(id) {
    await request(`/atividades/${id}`, {
        method: "DELETE",
    });
}

export async function criarInscricao(payload) {
    const result = await request("/inscricoes", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return normalizarInscricao(result);
}

export async function listarInscricoesDoAluno(alunoId) {
    const fallback = clone(mockInscricoes).filter(
        (item) => Number(item.alunoId) === Number(alunoId),
    );
    const response = await withFallback(() => request(`/alunos/${alunoId}/inscricoes`), fallback);
    return Array.isArray(response) ? response.map(normalizarInscricao) : fallback;
}

export async function listarInscricoesDaAtividade(atividadeId) {
    const fallback = clone(mockInscricoes).filter(
        (item) => Number(item.atividadeId) === Number(atividadeId),
    );
    const response = await withFallback(
        () => request(`/atividades/${atividadeId}/inscricoes`),
        fallback,
    );
    return Array.isArray(response) ? response.map(normalizarInscricao) : fallback;
}

export async function removerInscricao(id) {
    await request(`/inscricoes/${id}`, {
        method: "DELETE",
    });
}

export async function criarPresenca(payload) {
    const result = await request("/presencas", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return normalizarPresenca(result);
}

export async function listarPresencasDaAtividade(atividadeId) {
    const fallback = clone(mockPresencas).filter(
        (item) => Number(item.atividadeId) === Number(atividadeId),
    );
    const response = await withFallback(
        () => request(`/atividades/${atividadeId}/presencas`),
        fallback,
    );
    return Array.isArray(response) ? response.map(normalizarPresenca) : fallback;
}

export async function gerarCertificado(payload) {
    const result = await request("/certificados/gerar", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return normalizarCertificado(result);
}

export async function listarCertificadosDoAluno(alunoId) {
    const fallback = clone(mockCertificados).filter(
        (item) => Number(item.alunoId) === Number(alunoId),
    );
    const response = await withFallback(
        () => request(`/alunos/${alunoId}/certificados`),
        fallback,
    );
    return Array.isArray(response) ? response.map(normalizarCertificado) : fallback;
}

export async function validarCertificado(codigo) {
    const fallback = clone(mockCertificados).find((item) => item.codigo === codigo) ?? null;
    const response = await withFallback(
        () => request(`/certificados/validar/${codigo}`),
        fallback,
    );
    return normalizarCertificado(response);
}

export async function loginUsuario(payload) {
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function cadastrarAluno(payload) {
    return request("/auth/cadastro", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function urlImagemCertificado(codigo) {
    return `${API_BASE_URL}/certificados/validar/${encodeURIComponent(codigo)}/imagem`;
}
