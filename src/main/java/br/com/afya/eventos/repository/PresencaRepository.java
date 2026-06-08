package br.com.afya.eventos.repository;

import br.com.afya.eventos.model.PresencaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PresencaRepository extends JpaRepository<PresencaEntity, Long> {
    Optional<PresencaEntity> findByInscricao_Id(Long inscricaoId);
    List<PresencaEntity> findByInscricao_Atividade_Id(Long atividadeId);
    boolean existsByInscricao_IdAndPresenteTrue(Long inscricaoId);
}
