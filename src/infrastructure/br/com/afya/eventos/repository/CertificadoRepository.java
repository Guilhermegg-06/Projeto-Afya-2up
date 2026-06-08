package br.com.afya.eventos.repository;

import br.com.afya.eventos.model.CertificadoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificadoRepository extends JpaRepository<CertificadoEntity, Long> {
    List<CertificadoEntity> findByAlunoId(Long alunoId);
    Optional<CertificadoEntity> findByCodigo(String codigo);
    Optional<CertificadoEntity> findByAlunoIdAndAtividade_Id(Long alunoId, Long atividadeId);
}
