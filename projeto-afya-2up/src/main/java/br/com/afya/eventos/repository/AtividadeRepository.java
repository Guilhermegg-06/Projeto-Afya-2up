package br.com.afya.eventos.repository;

import br.com.afya.eventos.model.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
}
