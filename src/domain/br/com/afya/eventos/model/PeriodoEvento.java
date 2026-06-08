package br.com.afya.eventos.model;

import java.time.LocalDate;

public record PeriodoEvento(LocalDate inicio, LocalDate fim) {

    public PeriodoEvento {
        if (inicio == null) {
            throw new IllegalArgumentException("dataInicio e obrigatoria");
        }
        if (fim == null) {
            throw new IllegalArgumentException("dataFim e obrigatoria");
        }
        if (fim.isBefore(inicio)) {
            throw new IllegalArgumentException("dataFim nao pode ser anterior a dataInicio");
        }
    }
}