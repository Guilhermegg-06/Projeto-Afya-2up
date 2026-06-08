package br.com.afya.eventos.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CodigoCertificadoTest {

    @Test
    void aceitaCodigoValido() {
        CodigoCertificado codigo = new CodigoCertificado("CERT-2026-001");

        assertEquals("CERT-2026-001", codigo.valor());
    }

    @Test
    void rejeitaCodigoEmBranco() {
        assertThrows(IllegalArgumentException.class, () -> new CodigoCertificado(" "));
    }
}