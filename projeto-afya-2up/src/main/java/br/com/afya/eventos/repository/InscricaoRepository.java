package br.com.afya.eventos.repository;

import br.com.afya.eventos.model.Inscricao;
import br.com.afya.eventos.model.StatusInscricao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {

    // Todas as inscricoes de um aluno
    List<Inscricao> findByUsuarioId(Long usuarioId);

    // Verifica se aluno ja esta inscrito nessa atividade
    boolean existsByUsuarioIdAndAtividadeIdAndStatus(Long usuarioId, Long atividadeId, StatusInscricao status);

    // Conta quantos inscritos ativos tem em uma atividade
    long countByAtividadeIdAndStatus(Long atividadeId, StatusInscricao status);
}
