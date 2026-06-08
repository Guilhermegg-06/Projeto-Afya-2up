package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.UsuarioCadastroDTO;
import br.com.afya.eventos.dto.UsuarioRespostaDTO;
import br.com.afya.eventos.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    // POST /api/usuarios  →  cadastrar novo usuário
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody UsuarioCadastroDTO dto) {
        try {
            UsuarioRespostaDTO resposta = service.cadastrar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // GET /api/usuarios  →  listar todos
    @GetMapping
    public ResponseEntity<List<UsuarioRespostaDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // GET /api/usuarios/{id}  →  buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        }
    }
}
