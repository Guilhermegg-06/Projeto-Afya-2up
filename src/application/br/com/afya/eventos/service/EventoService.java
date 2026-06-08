package br.com.afya.eventos.service;

import br.com.afya.eventos.dto.ApiDtos.EventoResponse;
import br.com.afya.eventos.model.AtividadeEntity;
import br.com.afya.eventos.model.EventoEntity;
import br.com.afya.eventos.repository.AtividadeRepository;
import br.com.afya.eventos.repository.EventoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final AtividadeRepository atividadeRepository;

    public EventoService(EventoRepository eventoRepository, AtividadeRepository atividadeRepository) {
        this.eventoRepository = eventoRepository;
        this.atividadeRepository = atividadeRepository;
    }

    @Transactional(readOnly = true)
    public List<EventoResponse> listarEventos() {
        return eventoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<EventoResponse> buscarEvento(Long id) {
        return eventoRepository.findById(id).map(this::toResponse);
    }

    private EventoResponse toResponse(EventoEntity evento) {
        int totalInscricoes = atividadeRepository.findByEvento_Id(evento.getId()).stream()
                .mapToInt(AtividadeEntity::getOcupadas)
                .sum();
        int capacidade = evento.getCapacidade() == null ? 0 : evento.getCapacidade();
        int ocupacao = capacidade <= 0 ? 0 : (int) Math.round((totalInscricoes * 100.0) / capacidade);

        return new EventoResponse(
                evento.getId(),
                evento.getTitulo(),
                evento.getDescricao(),
                evento.getDataInicio().toString(),
                evento.getDataFim().toString(),
                evento.getLocal(),
                capacidade,
                evento.getStatus(),
                ocupacao,
                List.copyOf(evento.getEtiquetas())
        );
    }
}
