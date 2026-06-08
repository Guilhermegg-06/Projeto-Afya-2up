package br.com.afya.eventos.service;

import br.com.afya.eventos.dto.InscricaoDTO;
import br.com.afya.eventos.dto.InscricaoRespostaDTO;
import br.com.afya.eventos.model.*;
import br.com.afya.eventos.repository.AtividadeRepository;
import br.com.afya.eventos.repository.InscricaoRepository;
import br.com.afya.eventos.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InscricaoService {

    private final InscricaoRepository inscricaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AtividadeRepository atividadeRepository;

    public InscricaoService(InscricaoRepository inscricaoRepository,
                            UsuarioRepository usuarioRepository,
                            AtividadeRepository atividadeRepository) {
        this.inscricaoRepository = inscricaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.atividadeRepository = atividadeRepository;
    }

    @Transactional
    public InscricaoRespostaDTO inscrever(InscricaoDTO dto) {

        // 1. Busca o usuario
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));

        // 2. Verifica se e ALUNO
        if (usuario.getTipo() != TipoUsuario.ALUNO) {
            throw new IllegalArgumentException("Somente alunos podem se inscrever em atividades.");
        }

        // 3. Busca a atividade
        Atividade atividade = atividadeRepository.findById(dto.getAtividadeId())
                .orElseThrow(() -> new IllegalArgumentException("Atividade nao encontrada."));

        // 4. Bloqueia inscricao duplicada
        boolean jaInscrito = inscricaoRepository.existsByUsuarioIdAndAtividadeIdAndStatus(
                usuario.getId(), atividade.getId(), StatusInscricao.INSCRITO);
        if (jaInscrito) {
            throw new IllegalArgumentException("Aluno ja esta inscrito nessa atividade.");
        }

        // 5. Bloqueia se atividade lotada
        if (!atividade.temVagasDisponiveis()) {
            throw new IllegalArgumentException("Atividade sem vagas disponiveis.");
        }

        // 6. Realiza a inscricao e atualiza vagas
        Inscricao inscricao = new Inscricao(usuario, atividade);
        atividade.setVagasOcupadas(atividade.getVagasOcupadas() + 1);

        atividadeRepository.save(atividade);
        inscricaoRepository.save(inscricao);

        return new InscricaoRespostaDTO(inscricao);
    }

    public List<InscricaoRespostaDTO> listarPorAluno(Long usuarioId) {
        usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));

        return inscricaoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(InscricaoRespostaDTO::new)
                .collect(Collectors.toList());
    }
}
