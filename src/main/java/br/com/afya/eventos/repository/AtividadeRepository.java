package br.com.afya.eventos.repository;

import br.com.afya.eventos.model.AtividadeEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AtividadeRepository extends JpaRepository<AtividadeEntity, Long> {
    List<AtividadeEntity> findByEvento_Id(Long eventoId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from AtividadeEntity a where a.id = :id")
    Optional<AtividadeEntity> findByIdForUpdate(@Param("id") Long id);
}
