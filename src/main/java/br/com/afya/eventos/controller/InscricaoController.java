package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.ApiDtos.InscricaoRequest;
import br.com.afya.eventos.dto.ApiDtos.InscricaoResponse;
import br.com.afya.eventos.service.CatalogoAcademicoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class InscricaoController {

    private final CatalogoAcademicoService service;

    public InscricaoController(CatalogoAcademicoService service) {
        this.service = service;
    }

    @PostMapping("/inscricoes")
    public ResponseEntity<InscricaoResponse> criarInscricao(@RequestBody InscricaoRequest request) {
        InscricaoResponse criada = service.criarInscricao(request);
        return ResponseEntity.created(URI.create("/api/inscricoes/" + criada.id())).body(criada);
    }

    @GetMapping("/alunos/{alunoId}/inscricoes")
    public List<InscricaoResponse> listarInscricoesDoAluno(@PathVariable Long alunoId) {
        return service.listarInscricoesDoAluno(alunoId);
    }

    @DeleteMapping("/inscricoes/{id}")
    public ResponseEntity<Void> deletarInscricao(@PathVariable Long id) {
        service.deletarInscricao(id);
        return ResponseEntity.noContent().build();
    }
}
