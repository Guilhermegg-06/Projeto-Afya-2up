import {
    mockAtividadesPorEvento,
    mockCertificados,
    mockEventos,
    mockInscricoes,
    mockPresencas,
} from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

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
    } catch {
        return fallbackValue;
    }
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizarEvento(evento) {
    if (!evento) {
        return null;
    }

    return {
        id: evento.id,
        titulo: evento.titulo ?? evento.title,
        descricao: evento.descricao ?? evento.description,
        dataInicio: evento.dataInicio ?? evento.date ?? null,
        dataFim: evento.dataFim ?? evento.date ?? null,
        local: evento.local ?? evento.location,
        capacidade: evento.capacidade ?? evento.capacity ?? 0,
        status: evento.status ?? "Inscricoes abertas",
        ocupacao: evento.ocupacao ?? evento.progress ?? 0,
        etiquetas: evento.etiquetas ?? evento.tags ?? [],
    };
}

function normalizarAtividade(atividade) {
    if (!atividade) {
        return null;
    }

    return {
        id: atividade.id,
        titulo: atividade.titulo ?? atividade.title,
        descricao: atividade.descricao ?? atividade.description ?? "",
        palestrante: atividade.palestrante ?? atividade.speaker ?? "",
        vagas: atividade.vagas ?? atividade.vacancies ?? 0,
        ocupadas: atividade.ocupadas ?? atividade.filled ?? 0,
        horario: atividade.horario ?? atividade.time ?? "",
        tipo: atividade.tipo ?? atividade.category ?? "Atividade",
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

export async function criarInscricao(payload) {
    return withFallback(
        () =>
            request("/inscricoes", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        {
            id: Date.now(),
            ...payload,
            status: "Inscrito",
        },
    ).then((result) => {
        if (result && !mockInscricoes.some((item) => item.id === result.id)) {
            mockInscricoes.push({
                id: result.id,
                alunoId: Number(payload.alunoId),
                atividadeId: Number(payload.atividadeId),
                eventoId: Number(payload.eventoId),
                status: result.status ?? "Inscrito",
                presenca: result.presenca ?? "Pendente",
            });
        }

        return result;
    });
}

export async function listarInscricoesDoAluno(alunoId) {
    const fallback = clone(mockInscricoes).filter(
        (item) => Number(item.alunoId) === Number(alunoId),
    );
    return withFallback(() => request(`/alunos/${alunoId}/inscricoes`), fallback);
}

export async function listarInscricoesDaAtividade(atividadeId) {
    const fallback = clone(mockInscricoes).filter(
        (item) => Number(item.atividadeId) === Number(atividadeId),
    );
    return withFallback(() => request(`/atividades/${atividadeId}/inscricoes`), fallback);
}

export async function criarPresenca(payload) {
    return withFallback(
        () =>
            request("/presencas", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        {
            id: Date.now(),
            ...payload,
            presente: true,
        },
    ).then((result) => {
        if (result && !mockPresencas.some((item) => item.id === result.id)) {
            mockPresencas.push({
                id: result.id,
                atividadeId: Number(payload.atividadeId),
                inscricaoId: Number(payload.inscricaoId),
                presente: Boolean(result.presente ?? true),
            });
        }

        return result;
    });
}

export async function listarPresencasDaAtividade(atividadeId) {
    const fallback = clone(mockPresencas).filter(
        (item) => Number(item.atividadeId) === Number(atividadeId),
    );
    return withFallback(() => request(`/atividades/${atividadeId}/presencas`), fallback);
}

export async function gerarCertificado(payload) {
    return withFallback(
        () =>
            request("/certificados/gerar", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        {
            id: Date.now(),
            alunoId: payload.alunoId,
            eventoId: payload.eventoId,
            atividadeTitulo: payload.atividadeTitulo,
            codigo: `CERT-${Date.now()}`,
            validado: true,
        },
    ).then((result) => {
        if (result && !mockCertificados.some((item) => item.codigo === result.codigo)) {
            mockCertificados.push({
                id: result.id,
                alunoId: Number(payload.alunoId),
                eventoId: Number(payload.eventoId),
                atividadeTitulo: payload.atividadeTitulo,
                codigo: result.codigo,
                validado: Boolean(result.validado ?? true),
            });
        }

        return result;
    });
}

export async function listarCertificadosDoAluno(alunoId) {
    const fallback = clone(mockCertificados).filter(
        (item) => Number(item.alunoId) === Number(alunoId),
    );
    return withFallback(() => request(`/alunos/${alunoId}/certificados`), fallback);
}

export async function validarCertificado(codigo) {
    const fallback = clone(mockCertificados).find((item) => item.codigo === codigo) ?? null;
    return withFallback(() => request(`/certificados/validar/${codigo}`), fallback);
}
