import { useEffect, useMemo, useState } from "react";
import {
    atualizarAtividade,
    atualizarEvento,
    criarAtividade,
    criarEvento,
    deletarAtividade,
    deletarEvento,
    listarAtividadesPorEvento,
    listarEventos,
} from "../services/api";
import Loader from "../components/Loader";
import SearchInput from "../components/SearchInput";

const emptyEvent = {
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    local: "",
    capacidade: "",
    status: "Inscricoes abertas",
    etiquetas: "",
};

const emptyActivity = {
    titulo: "",
    descricao: "",
    palestrante: "",
    vagas: "",
    horario: "",
    tipo: "Minicurso",
};

function toEventForm(evento) {
    return {
        titulo: evento.titulo ?? "",
        descricao: evento.descricao ?? "",
        dataInicio: evento.dataInicio ?? "",
        dataFim: evento.dataFim ?? "",
        local: evento.local ?? "",
        capacidade: String(evento.capacidade ?? ""),
        status: evento.status ?? "Inscricoes abertas",
        etiquetas: (evento.etiquetas ?? []).join(", "),
    };
}

function toActivityForm(atividade) {
    return {
        titulo: atividade.titulo ?? "",
        descricao: atividade.descricao ?? "",
        palestrante: atividade.palestrante ?? "",
        vagas: String(atividade.vagas ?? ""),
        horario: atividade.horario ?? "",
        tipo: atividade.tipo ?? "Minicurso",
    };
}

function buildEventPayload(form) {
    return {
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        dataInicio: form.dataInicio,
        dataFim: form.dataFim || form.dataInicio,
        local: form.local.trim(),
        capacidade: Number(form.capacidade),
        status: form.status,
        etiquetas: form.etiquetas
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
    };
}

function buildActivityPayload(form) {
    return {
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        palestrante: form.palestrante.trim(),
        vagas: Number(form.vagas),
        horario: form.horario.trim(),
        tipo: form.tipo,
    };
}

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [editingEventId, setEditingEventId] = useState(null);
    const [editingActivityId, setEditingActivityId] = useState(null);
    const [eventForm, setEventForm] = useState(emptyEvent);
    const [activityForm, setActivityForm] = useState(emptyActivity);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadEvents(nextSelectedId = selectedEventId) {
        try {
            setLoading(true);
            setError("");

            const list = await listarEventos();
            setEvents(list ?? []);

            const fallbackId = list?.[0]?.id ? String(list[0].id) : "";
            const stillExists = list?.some((event) => String(event.id) === String(nextSelectedId));
            const nextId = stillExists ? String(nextSelectedId) : fallbackId;
            setSelectedEventId(nextId);

            if (nextId) {
                await loadActivities(nextId);
            } else {
                setActivities([]);
            }
        } catch {
            setError("Nao foi possivel carregar os eventos administrativos.");
        } finally {
            setLoading(false);
        }
    }

    async function loadActivities(eventoId) {
        if (!eventoId) {
            setActivities([]);
            return;
        }

        try {
            setActivitiesLoading(true);
            const list = await listarAtividadesPorEvento(eventoId);
            setActivities(list ?? []);
        } catch {
            setMessage("Nao foi possivel carregar as atividades deste evento.");
        } finally {
            setActivitiesLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const list = await listarEventos();
                if (cancelled) {
                    return;
                }

                setEvents(list ?? []);
                const firstId = list?.[0]?.id ? String(list[0].id) : "";
                setSelectedEventId(firstId);

                if (firstId) {
                    const activityList = await listarAtividadesPorEvento(firstId);
                    if (!cancelled) {
                        setActivities(activityList ?? []);
                    }
                }
            } catch {
                if (!cancelled) {
                    setError("Nao foi possivel carregar os eventos administrativos.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const selectedEvent = events.find((event) => String(event.id) === String(selectedEventId));

    const filteredEvents = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            return events;
        }

        return events.filter((event) =>
            [event.titulo, event.descricao, event.local, event.status, ...(event.etiquetas ?? [])]
                .join(" ")
                .toLowerCase()
                .includes(term),
        );
    }, [events, searchTerm]);

    function updateEventForm(field, value) {
        setEventForm((current) => ({ ...current, [field]: value }));
    }

    function updateActivityForm(field, value) {
        setActivityForm((current) => ({ ...current, [field]: value }));
    }

    function startEditEvent(event) {
        setEditingEventId(event.id);
        setEventForm(toEventForm(event));
        setMessage(`Editando evento #${event.id}`);
    }

    function cancelEditEvent() {
        setEditingEventId(null);
        setEventForm(emptyEvent);
        setMessage("");
    }

    function startEditActivity(activity) {
        setEditingActivityId(activity.id);
        setActivityForm(toActivityForm(activity));
        setMessage(`Editando atividade #${activity.id}`);
    }

    function cancelEditActivity() {
        setEditingActivityId(null);
        setActivityForm(emptyActivity);
        setMessage("");
    }

    async function handleEventSubmit(event) {
        event.preventDefault();

        if (!eventForm.titulo.trim() || !eventForm.dataInicio || !eventForm.local.trim()) {
            setMessage("Preencha titulo, data inicial e local do evento.");
            return;
        }

        try {
            setSaving(true);
            const payload = buildEventPayload(eventForm);
            const saved = editingEventId
                ? await atualizarEvento(editingEventId, payload)
                : await criarEvento(payload);

            setMessage(editingEventId ? "Evento atualizado." : "Evento criado.");
            setEditingEventId(null);
            setEventForm(emptyEvent);
            await loadEvents(String(saved.id));
        } catch {
            setMessage("Nao foi possivel salvar o evento.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteEvent(eventId) {
        const confirmed = window.confirm("Excluir este evento e suas atividades vinculadas?");
        if (!confirmed) {
            return;
        }

        try {
            setSaving(true);
            await deletarEvento(eventId);
            setMessage("Evento excluido.");
            await loadEvents("");
        } catch {
            setMessage("Nao foi possivel excluir o evento.");
        } finally {
            setSaving(false);
        }
    }

    async function handleActivitySubmit(event) {
        event.preventDefault();

        if (!selectedEventId) {
            setMessage("Selecione um evento antes de criar uma atividade.");
            return;
        }

        if (!activityForm.titulo.trim() || !activityForm.palestrante.trim() || !activityForm.vagas) {
            setMessage("Preencha titulo, palestrante e vagas da atividade.");
            return;
        }

        try {
            setSaving(true);
            const payload = buildActivityPayload(activityForm);

            if (editingActivityId) {
                await atualizarAtividade(editingActivityId, {
                    ...payload,
                    eventoId: Number(selectedEventId),
                });
                setMessage("Atividade atualizada.");
            } else {
                await criarAtividade(selectedEventId, payload);
                setMessage("Atividade criada.");
            }

            setEditingActivityId(null);
            setActivityForm(emptyActivity);
            await loadActivities(selectedEventId);
        } catch {
            setMessage("Nao foi possivel salvar a atividade.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteActivity(activityId) {
        const confirmed = window.confirm("Excluir esta atividade?");
        if (!confirmed) {
            return;
        }

        try {
            setSaving(true);
            await deletarAtividade(activityId);
            setMessage("Atividade excluida.");
            await loadActivities(selectedEventId);
        } catch {
            setMessage("Nao foi possivel excluir a atividade.");
        } finally {
            setSaving(false);
        }
    }

    async function handleSelectEvent(eventId) {
        setSelectedEventId(String(eventId));
        setEditingActivityId(null);
        setActivityForm(emptyActivity);
        await loadActivities(eventId);
    }

    const totalCapacity = events.reduce((sum, event) => sum + Number(event.capacidade || 0), 0);
    const activeEvents = events.filter((event) => event.status !== "Encerrado").length;

    return (
        <main className="page admin-page">
            <section className="admin-hero">
                <div>
                    <span className="section-heading__eyebrow">Admin AMRY cursos</span>
                    <h1>Gestao completa de eventos e atividades.</h1>
                    <p>
                        Crie eventos, edite a programacao em andamento, acompanhe capacidade
                        e mantenha a grade de cursos pronta para os alunos.
                    </p>
                </div>

                <div className="admin-metrics" aria-label="Resumo administrativo">
                    <div>
                        <strong>{events.length}</strong>
                        <span>eventos cadastrados</span>
                    </div>
                    <div>
                        <strong>{activeEvents}</strong>
                        <span>eventos ativos</span>
                    </div>
                    <div>
                        <strong>{totalCapacity}</strong>
                        <span>vagas totais</span>
                    </div>
                </div>
            </section>

            {message ? <section className="admin-message">{message}</section> : null}
            {error ? <section className="admin-message admin-message--error">{error}</section> : null}

            <section className="admin-layout">
                <form className="admin-form" onSubmit={handleEventSubmit}>
                    <div className="admin-form__header">
                        <span>{editingEventId ? `Editando evento #${editingEventId}` : "Novo evento"}</span>
                        <button type="button" onClick={cancelEditEvent} disabled={!editingEventId}>
                            Limpar
                        </button>
                    </div>

                    <label>
                        <span>Titulo</span>
                        <input
                            value={eventForm.titulo}
                            onChange={(event) => updateEventForm("titulo", event.target.value)}
                            placeholder="Semana de Tecnologia"
                        />
                    </label>

                    <label>
                        <span>Descricao</span>
                        <textarea
                            value={eventForm.descricao}
                            onChange={(event) => updateEventForm("descricao", event.target.value)}
                            placeholder="Descreva o objetivo do evento"
                        />
                    </label>

                    <div className="admin-form__row">
                        <label>
                            <span>Inicio</span>
                            <input
                                type="date"
                                value={eventForm.dataInicio}
                                onChange={(event) => updateEventForm("dataInicio", event.target.value)}
                            />
                        </label>
                        <label>
                            <span>Fim</span>
                            <input
                                type="date"
                                value={eventForm.dataFim}
                                onChange={(event) => updateEventForm("dataFim", event.target.value)}
                            />
                        </label>
                    </div>

                    <div className="admin-form__row">
                        <label>
                            <span>Local</span>
                            <input
                                value={eventForm.local}
                                onChange={(event) => updateEventForm("local", event.target.value)}
                                placeholder="Auditorio principal"
                            />
                        </label>
                        <label>
                            <span>Capacidade</span>
                            <input
                                type="number"
                                min="1"
                                value={eventForm.capacidade}
                                onChange={(event) => updateEventForm("capacidade", event.target.value)}
                                placeholder="120"
                            />
                        </label>
                    </div>

                    <div className="admin-form__row">
                        <label>
                            <span>Status</span>
                            <select
                                value={eventForm.status}
                                onChange={(event) => updateEventForm("status", event.target.value)}
                            >
                                <option>Inscricoes abertas</option>
                                <option>Em andamento</option>
                                <option>Encerrado</option>
                                <option>Rascunho</option>
                            </select>
                        </label>
                        <label>
                            <span>Etiquetas</span>
                            <input
                                value={eventForm.etiquetas}
                                onChange={(event) => updateEventForm("etiquetas", event.target.value)}
                                placeholder="Presencial, Certificado"
                            />
                        </label>
                    </div>

                    <button className="admin-submit" type="submit" disabled={saving}>
                        {editingEventId ? "Salvar alteracoes" : "Criar evento"}
                    </button>
                </form>

                <section className="admin-list">
                    <div className="admin-list__toolbar">
                        <div>
                            <span className="section-heading__eyebrow">Eventos</span>
                            <h2>Programacao cadastrada</h2>
                        </div>
                        <SearchInput
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Buscar evento"
                            name="adminEventSearch"
                            buttonType="button"
                            ariaLabel="Buscar evento"
                        />
                    </div>

                    {loading ? (
                        <Loader />
                    ) : filteredEvents.length === 0 ? (
                        <div className="admin-empty">Nenhum evento encontrado.</div>
                    ) : (
                        <div className="admin-table" role="table" aria-label="Eventos administrativos">
                            {filteredEvents.map((event) => (
                                <article
                                    className={
                                        String(selectedEventId) === String(event.id)
                                            ? "admin-row admin-row--selected"
                                            : "admin-row"
                                    }
                                    key={event.id}
                                >
                                    <button type="button" onClick={() => handleSelectEvent(event.id)}>
                                        <strong>{event.titulo}</strong>
                                        <span>{event.local}</span>
                                    </button>
                                    <span>{event.status}</span>
                                    <span>{event.capacidade} vagas</span>
                                    <div>
                                        <button type="button" onClick={() => startEditEvent(event)}>
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteEvent(event.id)}
                                            disabled={saving}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>

            <section className="admin-activities">
                <div className="admin-activities__heading">
                    <div>
                        <span className="section-heading__eyebrow">Grade de cursos</span>
                        <h2>{selectedEvent ? selectedEvent.titulo : "Selecione um evento"}</h2>
                    </div>
                    <p>Atividades fazem parte da programacao e respeitam limite de vagas.</p>
                </div>

                <div className="admin-layout admin-layout--activities">
                    <form className="admin-form" onSubmit={handleActivitySubmit}>
                        <div className="admin-form__header">
                            <span>
                                {editingActivityId
                                    ? `Editando atividade #${editingActivityId}`
                                    : "Nova atividade"}
                            </span>
                            <button type="button" onClick={cancelEditActivity} disabled={!editingActivityId}>
                                Limpar
                            </button>
                        </div>

                        <label>
                            <span>Titulo</span>
                            <input
                                value={activityForm.titulo}
                                onChange={(event) => updateActivityForm("titulo", event.target.value)}
                                placeholder="Minicurso de Spring Boot"
                            />
                        </label>

                        <label>
                            <span>Descricao</span>
                            <textarea
                                value={activityForm.descricao}
                                onChange={(event) => updateActivityForm("descricao", event.target.value)}
                                placeholder="Detalhes do conteudo"
                            />
                        </label>

                        <div className="admin-form__row">
                            <label>
                                <span>Palestrante</span>
                                <input
                                    value={activityForm.palestrante}
                                    onChange={(event) =>
                                        updateActivityForm("palestrante", event.target.value)
                                    }
                                    placeholder="Prof. Nome"
                                />
                            </label>
                            <label>
                                <span>Vagas</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={activityForm.vagas}
                                    onChange={(event) => updateActivityForm("vagas", event.target.value)}
                                    placeholder="30"
                                />
                            </label>
                        </div>

                        <div className="admin-form__row">
                            <label>
                                <span>Horario</span>
                                <input
                                    value={activityForm.horario}
                                    onChange={(event) => updateActivityForm("horario", event.target.value)}
                                    placeholder="14h as 18h"
                                />
                            </label>
                            <label>
                                <span>Tipo</span>
                                <select
                                    value={activityForm.tipo}
                                    onChange={(event) => updateActivityForm("tipo", event.target.value)}
                                >
                                    <option>Minicurso</option>
                                    <option>Palestra</option>
                                    <option>Oficina</option>
                                    <option>Mesa redonda</option>
                                </select>
                            </label>
                        </div>

                        <button className="admin-submit" type="submit" disabled={saving || !selectedEventId}>
                            {editingActivityId ? "Salvar atividade" : "Adicionar atividade"}
                        </button>
                    </form>

                    <section className="admin-list">
                        {activitiesLoading ? (
                            <Loader />
                        ) : activities.length === 0 ? (
                            <div className="admin-empty">Nenhuma atividade cadastrada para este evento.</div>
                        ) : (
                            <div className="admin-activity-list">
                                {activities.map((activity) => (
                                    <article className="admin-activity" key={activity.id}>
                                        <div>
                                            <strong>{activity.titulo}</strong>
                                            <span>
                                                {activity.tipo} | {activity.palestrante}
                                            </span>
                                        </div>
                                        <p>
                                            {activity.ocupadas}/{activity.vagas} vagas ocupadas
                                        </p>
                                        <div>
                                            <button type="button" onClick={() => startEditActivity(activity)}>
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteActivity(activity.id)}
                                                disabled={saving}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
}
