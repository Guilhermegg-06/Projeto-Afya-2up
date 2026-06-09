package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.ApiDtos.CursoRequest;
import br.com.afya.eventos.dto.ApiDtos.CursoResponse;
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

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    private final CatalogoAcademicoService service;

    public CursoController(CatalogoAcademicoService service) {
        this.service = service;
    }

    @GetMapping
    public List<CursoResponse> listarCursos() {
        return service.listarCursos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoResponse> buscarCurso(@PathVariable Long id) {
        CursoResponse curso = service.buscarCurso(id);
        if (curso == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(curso);
    }

    @PostMapping
    public ResponseEntity<CursoResponse> criarCurso(@RequestBody CursoRequest request) {
        CursoResponse criado = service.criarCurso(request);
        return ResponseEntity.created(URI.create("/api/cursos/" + criado.id())).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoResponse> atualizarCurso(
            @PathVariable Long id,
            @RequestBody CursoRequest request
    ) {
        CursoResponse existente = service.buscarCurso(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.atualizarCurso(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCurso(@PathVariable Long id) {
        CursoResponse existente = service.buscarCurso(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        service.deletarCurso(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{cursoId}/inscricoes")
    public List<InscricaoResponse> listarInscricoes(@PathVariable Long cursoId) {
        return service.listarInscricoesDaAtividade(cursoId);
    }

    @GetMapping("/{cursoId}/presencas")
    public List<PresencaResponse> listarPresencas(@PathVariable Long cursoId) {
        return service.listarPresencasDaAtividade(cursoId);
    }
}
