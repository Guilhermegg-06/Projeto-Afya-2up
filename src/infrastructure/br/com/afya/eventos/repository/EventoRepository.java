package br.com.afya.eventos.repository;

import br.com.afya.eventos.model.EventoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<EventoEntity, Long> {
}