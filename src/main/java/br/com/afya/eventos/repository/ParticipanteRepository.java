package br.com.afya.eventos.repository;

import br.com.afya.eventos.model.ParticipanteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipanteRepository extends JpaRepository<ParticipanteEntity, Long> {
    boolean existsById(Long id);
}