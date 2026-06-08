package br.com.afya.eventos.service;

import br.com.afya.eventos.dto.ApiDtos.AtividadeResponse;
import br.com.afya.eventos.model.AtividadeEntity;
import br.com.afya.eventos.repository.AtividadeRepository;
import br.com.afya.eventos.repository.EventoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class AtividadeService {

    private final AtividadeRepository atividadeRepository;
    private final EventoRepository eventoRepository;

    public AtividadeService(AtividadeRepository atividadeRepository, EventoRepository eventoRepository) {
        this.atividadeRepository = atividadeRepository;
        this.eventoRepository = eventoRepository;
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarAtividadesDoEvento(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "evento nao encontrado");
        }

        return atividadeRepository.findByEvento_Id(eventoId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<AtividadeResponse> buscarAtividade(Long id) {
        return atividadeRepository.findById(id).map(this::toResponse);
    }

    private AtividadeResponse toResponse(AtividadeEntity atividade) {
        return new AtividadeResponse(
                atividade.getId(),
                atividade.getEvento().getId(),
                atividade.getTitulo(),
                atividade.getDescricao(),
                atividade.getPalestrante(),
                atividade.getVagas(),
                atividade.getOcupadas(),
                atividade.getHorario(),
                atividade.getTipo()
        );
    }
}
