package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.InscricaoDTO;
import br.com.afya.eventos.dto.InscricaoRespostaDTO;
import br.com.afya.eventos.service.InscricaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InscricaoController {

    private final InscricaoService service;

    public InscricaoController(InscricaoService service) {
        this.service = service;
    }

    // POST /api/inscricoes  →  inscrever aluno em atividade
    @PostMapping("/inscricoes")
    public ResponseEntity<?> inscrever(@RequestBody InscricaoDTO dto) {
        try {
            InscricaoRespostaDTO resposta = service.inscrever(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // GET /api/alunos/{alunoId}/inscricoes  →  listar inscricoes de um aluno
    @GetMapping("/alunos/{alunoId}/inscricoes")
    public ResponseEntity<?> listarPorAluno(@PathVariable Long alunoId) {
        try {
            List<InscricaoRespostaDTO> lista = service.listarPorAluno(alunoId);
            return ResponseEntity.ok(lista);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        }
    }
}
