package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.ApiDtos.CadastroRequest;
import br.com.afya.eventos.dto.ApiDtos.LoginRequest;
import br.com.afya.eventos.dto.ApiDtos.UsuarioResponse;
import br.com.afya.eventos.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<UsuarioResponse> cadastrar(@RequestBody CadastroRequest request) {
        UsuarioResponse usuario = authService.cadastrarAluno(request);
        return ResponseEntity.created(URI.create("/api/alunos/" + usuario.id())).body(usuario);
    }

    @PostMapping("/login")
    public UsuarioResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
