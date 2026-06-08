package br.com.afya.eventos.dto;

import java.util.List;

public final class ApiDtos {

    private ApiDtos() {
    }

    public record EventoRequest(
            String titulo,
            String descricao,
            String dataInicio,
            String dataFim,
            String local,
            Integer capacidade,
            String status,
            List<String> etiquetas
    ) {
    }

    public record EventoResponse(
            Long id,
            String titulo,
            String descricao,
            String dataInicio,
            String dataFim,
            String local,
            Integer capacidade,
            String status,
            Integer ocupacao,
            List<String> etiquetas
    ) {
    }

    public record AtividadeRequest(
            String titulo,
            String descricao,
            String palestrante,
            Integer vagas,
            String horario,
            String tipo
    ) {
    }

    public record AtividadeResponse(
            Long id,
            Long eventoId,
            String titulo,
            String descricao,
            String palestrante,
            Integer vagas,
            Integer ocupadas,
            String horario,
            String tipo
    ) {
    }

    public record InscricaoRequest(
            Long alunoId,
            Long eventoId,
            Long atividadeId
    ) {
    }

    public record InscricaoResponse(
            Long id,
            Long alunoId,
            Long eventoId,
            Long atividadeId,
            String status,
            String presenca
    ) {
    }

    public record PresencaRequest(
            Long atividadeId,
            Long inscricaoId,
            Boolean presente
    ) {
    }

    public record PresencaResponse(
            Long id,
            Long atividadeId,
            Long inscricaoId,
            Boolean presente
    ) {
    }

    public record CertificadoGerarRequest(
            Long alunoId,
            Long eventoId,
            Long atividadeId
    ) {
    }

    public record CertificadoResponse(
            Long id,
            Long alunoId,
            Long eventoId,
            Long atividadeId,
            String atividadeTitulo,
            String codigo,
            Boolean validado
    ) {
    }
}
