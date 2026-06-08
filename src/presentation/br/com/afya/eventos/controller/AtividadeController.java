package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.ApiDtos.AtividadeRequest;
import br.com.afya.eventos.dto.ApiDtos.AtividadeResponse;
import br.com.afya.eventos.dto.ApiDtos.InscricaoResponse;
import br.com.afya.eventos.dto.ApiDtos.PresencaResponse;
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

import java.util.List;

@RestController
@RequestMapping("/api/atividades")
public class AtividadeController {

    private final CatalogoAcademicoService service;

    public AtividadeController(CatalogoAcademicoService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AtividadeResponse> buscarAtividade(@PathVariable Long id) {
        AtividadeResponse atividade = service.buscarAtividade(id);
        return atividade == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atividade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AtividadeResponse> atualizarAtividade(
            @PathVariable Long id,
            @RequestBody AtividadeRequest request
    ) {
        AtividadeResponse atividade = service.buscarAtividade(id);
        if (atividade == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(service.atualizarAtividade(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAtividade(@PathVariable Long id) {
        AtividadeResponse atividade = service.buscarAtividade(id);
        if (atividade == null) {
            return ResponseEntity.notFound().build();
        }

        service.deletarAtividade(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{atividadeId}/inscricoes")
    public List<InscricaoResponse> listarInscricoes(@PathVariable Long atividadeId) {
        return service.listarInscricoesDaAtividade(atividadeId);
    }

    @GetMapping("/{atividadeId}/presencas")
    public List<PresencaResponse> listarPresencas(@PathVariable Long atividadeId) {
        return service.listarPresencasDaAtividade(atividadeId);
    }
}
