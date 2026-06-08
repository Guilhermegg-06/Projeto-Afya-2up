package br.com.afya.eventos.controller;

import br.com.afya.eventos.model.Atividade;
import br.com.afya.eventos.repository.AtividadeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atividades")
public class AtividadeController {

    private final AtividadeRepository repository;

    public AtividadeController(AtividadeRepository repository) {
        this.repository = repository;
    }

    // POST /api/atividades  →  cadastrar atividade
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Atividade atividade) {
        if (atividade.getNomeAtv() == null || atividade.getNomeAtv().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nome da atividade e obrigatorio."));
        }
        if (atividade.getVagasAtv() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Numero de vagas deve ser maior que zero."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(atividade));
    }

    // GET /api/atividades  →  listar todas
    @GetMapping
    public ResponseEntity<List<Atividade>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    // GET /api/atividades/{id}  →  buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("erro", "Atividade nao encontrada.")));
    }
}
