package br.com.afya.eventos.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AtividadeEntityTest {

    @Test
    void ocupaVagaAteOLimiteDefinido() {
        AtividadeEntity atividade = novaAtividadeComUmaVaga();

        atividade.ocuparVaga();

        assertEquals(1, atividade.getOcupadas());
        assertThrows(IllegalStateException.class, atividade::ocuparVaga);
    }

    @Test
    void liberarVagaNaoDeixaOcupacaoNegativa() {
        AtividadeEntity atividade = novaAtividadeComUmaVaga();

        atividade.liberarVaga();

        assertEquals(0, atividade.getOcupadas());
    }

    private AtividadeEntity novaAtividadeComUmaVaga() {
        EventoEntity evento = new EventoEntity(
                "Evento teste",
                "Descricao",
                LocalDate.of(2026, 6, 20),
                LocalDate.of(2026, 6, 20),
                "Campus",
                10,
                "Inscricoes abertas",
                List.of("Teste")
        );

        return new AtividadeEntity(
                evento,
                "Minicurso teste",
                "Descricao",
                "Professor",
                1,
                "10h as 12h",
                "Minicurso",
                LocalDateTime.of(2026, 6, 20, 10, 0),
                LocalDateTime.of(2026, 6, 20, 12, 0)
        );
    }
}