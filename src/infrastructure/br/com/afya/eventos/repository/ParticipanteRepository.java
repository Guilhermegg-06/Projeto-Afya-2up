package br.com.afya.eventos.repository;

import br.com.afya.eventos.model.ParticipanteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParticipanteRepository extends JpaRepository<ParticipanteEntity, Long> {
    boolean existsById(Long id);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    Optional<ParticipanteEntity> findByEmail(String email);
}
