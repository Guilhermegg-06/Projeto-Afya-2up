package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.ApiDtos.EventoRequest;
import br.com.afya.eventos.dto.ApiDtos.EventoResponse;
import br.com.afya.eventos.dto.ApiDtos.AtividadeRequest;
import br.com.afya.eventos.dto.ApiDtos.AtividadeResponse;
import br.com.afya.eventos.service.AtividadeService;
import br.com.afya.eventos.service.CatalogoAcademicoService;
import br.com.afya.eventos.service.EventoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final CatalogoAcademicoService service;
    private final EventoService eventoService;
    private final AtividadeService atividadeService;

    public EventoController(
            CatalogoAcademicoService service,
            EventoService eventoService,
            AtividadeService atividadeService
    ) {
        this.service = service;
        this.eventoService = eventoService;
        this.atividadeService = atividadeService;
    }

    @GetMapping
    public List<EventoResponse> listarEventos() {
        return eventoService.listarEventos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponse> buscarEvento(@PathVariable Long id) {
        return eventoService.buscarEvento(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EventoResponse> criarEvento(@RequestBody EventoRequest request) {
        EventoResponse criado = service.criarEvento(request);
        return ResponseEntity.created(URI.create("/api/eventos/" + criado.id())).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoResponse> atualizarEvento(
            @PathVariable Long id,
            @RequestBody EventoRequest request
    ) {
        EventoResponse existente = service.buscarEvento(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(service.atualizarEvento(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEvento(@PathVariable Long id) {
        EventoResponse existente = service.buscarEvento(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        service.deletarEvento(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{eventoId}/atividades")
    public List<AtividadeResponse> listarAtividades(@PathVariable Long eventoId) {
        return atividadeService.listarAtividadesDoEvento(eventoId);
    }

    @PostMapping("/{eventoId}/atividades")
    public ResponseEntity<AtividadeResponse> criarAtividade(
            @PathVariable Long eventoId,
            @RequestBody AtividadeRequest request
    ) {
        return ResponseEntity.ok(service.criarAtividade(eventoId, request));
    }
}
