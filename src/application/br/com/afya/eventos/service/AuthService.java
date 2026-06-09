package br.com.afya.eventos.service;

import br.com.afya.eventos.dto.ApiDtos.CadastroRequest;
import br.com.afya.eventos.dto.ApiDtos.LoginRequest;
import br.com.afya.eventos.dto.ApiDtos.UsuarioResponse;
import br.com.afya.eventos.model.CoordenadorEntity;
import br.com.afya.eventos.model.ParticipanteEntity;
import br.com.afya.eventos.repository.CoordenadorRepository;
import br.com.afya.eventos.repository.ParticipanteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {

    private final ParticipanteRepository participanteRepository;
    private final CoordenadorRepository coordenadorRepository;
    private final SenhaService senhaService;

    public AuthService(
            ParticipanteRepository participanteRepository,
            CoordenadorRepository coordenadorRepository,
            SenhaService senhaService
    ) {
        this.participanteRepository = participanteRepository;
        this.coordenadorRepository = coordenadorRepository;
        this.senhaService = senhaService;
    }

    @Transactional
    public UsuarioResponse cadastrarAluno(CadastroRequest request) {
        String nome = textoObrigatorio(request.nome(), "nome e obrigatorio");
        String email = emailNormalizado(request.email());
        String cpf = somenteDigitos(request.cpf());
        String senha = senhaValida(request.senha());

        if (cpf.length() != 11) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cpf deve ter 11 digitos");
        }
        if (participanteRepository.existsByEmail(email) || coordenadorRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "email ja cadastrado");
        }
        if (participanteRepository.existsByCpf(cpf)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "cpf ja cadastrado");
        }

        ParticipanteEntity participante = participanteRepository.save(new ParticipanteEntity(
                nome,
                email,
                cpf,
                senhaService.gerarHash(senha)
        ));

        return new UsuarioResponse(participante.getId(), participante.getNome(), participante.getEmail(), "ALUNO");
    }

    @Transactional(readOnly = true)
    public UsuarioResponse login(LoginRequest request) {
        String email = emailNormalizado(request.email());
        String senha = senhaValida(request.senha());

        return coordenadorRepository.findByEmail(email)
                .filter(coordenador -> senhaService.confere(senha, coordenador.getSenhaHash()))
                .map(coordenador -> new UsuarioResponse(
                        coordenador.getId(),
                        coordenador.getNome(),
                        coordenador.getEmail(),
                        "COORDENADOR"
                ))
                .or(() -> participanteRepository.findByEmail(email)
                        .filter(participante -> senhaService.confere(senha, participante.getSenhaHash()))
                        .map(participante -> new UsuarioResponse(
                                participante.getId(),
                                participante.getNome(),
                                participante.getEmail(),
                                "ALUNO"
                        )))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "email ou senha invalidos"));
    }

    private String emailNormalizado(String value) {
        String email = textoObrigatorio(value, "email e obrigatorio").toLowerCase(Locale.ROOT);
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email invalido");
        }
        return email;
    }

    private String senhaValida(String value) {
        String senha = textoObrigatorio(value, "senha e obrigatoria");
        if (senha.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "senha deve ter pelo menos 6 caracteres");
        }
        return senha;
    }

    private String textoObrigatorio(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String somenteDigitos(String value) {
        return textoObrigatorio(value, "cpf e obrigatorio").replaceAll("\\D", "");
    }
}
