package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.ApiDtos.EventoRequest;
import br.com.afya.eventos.dto.ApiDtos.EventoResponse;
import br.com.afya.eventos.dto.ApiDtos.AtividadeRequest;
import br.com.afya.eventos.dto.ApiDtos.AtividadeResponse;
import br.com.afya.eventos.service.CatalogoAcademicoService;
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

    public EventoController(CatalogoAcademicoService service) {
        this.service = service;
    }

    @GetMapping
    public List<EventoResponse> listarEventos() {
        return service.listarEventos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponse> buscarEvento(@PathVariable Long id) {
        EventoResponse evento = service.buscarEvento(id);
        return evento == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(evento);
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
        return service.listarAtividadesDoEvento(eventoId);
    }

    @PostMapping("/{eventoId}/atividades")
    public ResponseEntity<AtividadeResponse> criarAtividade(
            @PathVariable Long eventoId,
            @RequestBody AtividadeRequest request
    ) {
        return ResponseEntity.ok(service.criarAtividade(eventoId, request));
    }
}
