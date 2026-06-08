package br.com.afya.eventos.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PeriodoEventoTest {

    @Test
    void aceitaPeriodoComFimNoMesmoDiaOuDepoisDoInicio() {
        assertDoesNotThrow(() -> new PeriodoEvento(
                LocalDate.of(2026, 6, 20),
                LocalDate.of(2026, 6, 24)
        ));
    }

    @Test
    void rejeitaPeriodoComFimAntesDoInicio() {
        assertThrows(IllegalArgumentException.class, () -> new PeriodoEvento(
                LocalDate.of(2026, 6, 24),
                LocalDate.of(2026, 6, 20)
        ));
    }
}