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
    } catch (error) {
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

function atualizarMockEvento(evento) {
    const index = mockEventos.findIndex((item) => Number(item.id) === Number(evento.id));

    if (index >= 0) {
        mockEventos[index] = { ...mockEventos[index], ...evento };
        return;
    }

    mockEventos.push(evento);
}

function atualizarMockAtividade(atividade) {
    const eventoId = Number(atividade.eventoId);

    if (!mockAtividadesPorEvento[eventoId]) {
        mockAtividadesPorEvento[eventoId] = [];
    }

    const lista = mockAtividadesPorEvento[eventoId];
    const index = lista.findIndex((item) => Number(item.id) === Number(atividade.id));

    if (index >= 0) {
        lista[index] = { ...lista[index], ...atividade };
        return;
    }

    lista.push(atividade);
}

function removerMockAtividade(atividadeId) {
    Object.keys(mockAtividadesPorEvento).forEach((key) => {
        mockAtividadesPorEvento[key] = mockAtividadesPorEvento[key].filter(
            (item) => Number(item.id) !== Number(atividadeId),
        );
    });
}

function removerMockInscricao(inscricaoId) {
    const index = mockInscricoes.findIndex((item) => Number(item.id) === Number(inscricaoId));
    if (index >= 0) {
        mockInscricoes.splice(index, 1);
    }
}

function removerMockPresenca(inscricaoId) {
    const index = mockPresencas.findIndex((item) => Number(item.inscricaoId) === Number(inscricaoId));
    if (index >= 0) {
        mockPresencas.splice(index, 1);
    }
}

function atualizarOuAdicionarCertificado(certificado) {
    const index = mockCertificados.findIndex((item) => item.codigo === certificado.codigo);

    if (index >= 0) {
        mockCertificados[index] = { ...mockCertificados[index], ...certificado };
        return;
    }

    mockCertificados.push(certificado);
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
    const fallback = normalizarEvento({
        id: Date.now(),
        ocupacao: 0,
        etiquetas: [],
        status: "Inscricoes abertas",
        ...payload,
    });

    return withFallback(
        () =>
            request("/eventos", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        fallback,
    ).then((result) => {
        const normalized = normalizarEvento(result);
        if (normalized) {
            atualizarMockEvento(normalized);
        }

        return normalized;
    });
}

export async function atualizarEvento(id, payload) {
    const fallback = normalizarEvento({
        id: Number(id),
        ocupacao: 0,
        etiquetas: [],
        status: "Inscricoes abertas",
        ...payload,
    });

    return withFallback(
        () =>
            request(`/eventos/${id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            }),
        fallback,
    ).then((result) => {
        const normalized = normalizarEvento(result);
        if (normalized) {
            atualizarMockEvento(normalized);
        }

        return normalized;
    });
}

export async function deletarEvento(id) {
    return withFallback(
        () =>
            request(`/eventos/${id}`, {
                method: "DELETE",
            }),
        null,
    ).then(() => {
        const index = mockEventos.findIndex((evento) => Number(evento.id) === Number(id));
        if (index >= 0) {
            mockEventos.splice(index, 1);
        }
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
    const fallback = normalizarAtividade({
        id: Date.now(),
        eventoId: Number(eventoId),
        ocupadas: 0,
        ...payload,
    });

    return withFallback(
        () =>
            request(`/eventos/${eventoId}/atividades`, {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        fallback,
    ).then((result) => {
        const normalized = normalizarAtividade(result);
        if (normalized) {
            atualizarMockAtividade(normalized);
        }

        return normalized;
    });
}

export async function atualizarAtividade(id, payload) {
    const fallback = normalizarAtividade({
        id: Number(id),
        eventoId: payload.eventoId ?? null,
        ocupadas: 0,
        ...payload,
    });

    return withFallback(
        () =>
            request(`/atividades/${id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            }),
        fallback,
    ).then((result) => {
        const normalized = normalizarAtividade(result);
        if (normalized) {
            atualizarMockAtividade(normalized);
        }

        return normalized;
    });
}

export async function deletarAtividade(id) {
    return withFallback(
        () =>
            request(`/atividades/${id}`, {
                method: "DELETE",
            }),
        null,
    ).then(() => {
        removerMockAtividade(id);
    });
}

export async function criarInscricao(payload) {
    const fallback = {
        id: Date.now(),
        ...payload,
        status: "Inscrito",
        presenca: "Pendente",
    };

    return withFallback(
        () =>
            request("/inscricoes", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        fallback,
    ).then((result) => {
        const normalized = normalizarInscricao(result);
        if (normalized) {
            const index = mockInscricoes.findIndex((item) => Number(item.id) === Number(normalized.id));
            if (index >= 0) {
                mockInscricoes[index] = normalized;
            } else {
                mockInscricoes.push(normalized);
            }
        }

        return normalized;
    });
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
    return withFallback(
        () =>
            request(`/inscricoes/${id}`, {
                method: "DELETE",
            }),
        null,
    ).then(() => {
        removerMockInscricao(id);
        removerMockPresenca(id);
    });
}

export async function criarPresenca(payload) {
    const fallback = {
        id: Date.now(),
        ...payload,
        presente: true,
    };

    return withFallback(
        () =>
            request("/presencas", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        fallback,
    ).then((result) => {
        const normalized = normalizarPresenca(result);
        if (normalized) {
            const index = mockPresencas.findIndex((item) => Number(item.id) === Number(normalized.id));
            if (index >= 0) {
                mockPresencas[index] = normalized;
            } else {
                mockPresencas.push(normalized);
            }
        }

        return normalized;
    });
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
    const fallback = {
        id: Date.now(),
        alunoId: payload.alunoId,
        eventoId: payload.eventoId,
        atividadeId: payload.atividadeId,
        atividadeTitulo: payload.atividadeTitulo,
        codigo: `CERT-${Date.now()}`,
        validado: true,
    };

    return withFallback(
        () =>
            request("/certificados/gerar", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        fallback,
    ).then((result) => {
        const normalized = normalizarCertificado(result);
        if (normalized) {
            atualizarOuAdicionarCertificado(normalized);
        }

        return normalized;
    });
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
