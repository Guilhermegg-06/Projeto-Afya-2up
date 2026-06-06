package br.com.afya.eventos.service;

import br.com.afya.eventos.dto.UsuarioCadastroDTO;
import br.com.afya.eventos.dto.UsuarioRespostaDTO;
import br.com.afya.eventos.model.TipoUsuario;
import br.com.afya.eventos.model.Usuario;
import br.com.afya.eventos.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public UsuarioRespostaDTO cadastrar(UsuarioCadastroDTO dto) {
        validarCamposObrigatorios(dto);

        if (repository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }
        if (repository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }

        Usuario usuario = new Usuario(
            dto.getNome(),
            dto.getCpf(),
            dto.getEmail(),
            dto.getSenha(),   // ⚠️ ideal: usar BCrypt aqui no futuro
            dto.getIdade(),
            dto.getTipo(),
            dto.getMatricula()
        );

        repository.save(usuario);
        return new UsuarioRespostaDTO(usuario);
    }

    public List<UsuarioRespostaDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(UsuarioRespostaDTO::new)
                .collect(Collectors.toList());
    }

    public UsuarioRespostaDTO buscarPorId(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        return new UsuarioRespostaDTO(usuario);
    }

    // ── validações ──────────────────────────────────────────────────────────

    private void validarCamposObrigatorios(UsuarioCadastroDTO dto) {
        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        if (dto.getCpf() == null || !dto.getCpf().matches("\\d{11}")) {
            throw new IllegalArgumentException("CPF deve ter 11 dígitos numéricos.");
        }
        if (dto.getEmail() == null || !dto.getEmail().contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }
        if (dto.getSenha() == null || dto.getSenha().length() < 6) {
            throw new IllegalArgumentException("Senha deve ter no mínimo 6 caracteres.");
        }
        if (dto.getIdade() < 1) {
            throw new IllegalArgumentException("Idade inválida.");
        }
        if (dto.getTipo() == null) {
            throw new IllegalArgumentException("Tipo de usuário é obrigatório (ALUNO ou COORDENADOR).");
        }
        if (dto.getTipo() == TipoUsuario.ALUNO &&
            (dto.getMatricula() == null || dto.getMatricula().isBlank())) {
            throw new IllegalArgumentException("Matrícula é obrigatória para alunos.");
        }
    }
}
