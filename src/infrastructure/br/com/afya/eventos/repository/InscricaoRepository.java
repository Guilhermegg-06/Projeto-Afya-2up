package br.com.afya.eventos.repository;

import br.com.afya.eventos.model.InscricaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InscricaoRepository extends JpaRepository<InscricaoEntity, Long> {
    List<InscricaoEntity> findByAlunoId(Long alunoId);
    List<InscricaoEntity> findByAtividade_Id(Long atividadeId);
    Optional<InscricaoEntity> findByAlunoIdAndAtividade_Id(Long alunoId, Long atividadeId);
    boolean existsByAlunoIdAndAtividade_Id(Long alunoId, Long atividadeId);
}
