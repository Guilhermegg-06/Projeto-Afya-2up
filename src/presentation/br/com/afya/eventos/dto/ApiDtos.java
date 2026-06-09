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

    public record CursoRequest(
            String titulo,
            String descricao,
            String instrutor,
            Integer vagas,
            String horario,
            String status
    ) {
    }

    public record CursoResponse(
            Long id,
            String titulo,
            String descricao,
            String instrutor,
            Integer vagas,
            Integer ocupadas,
            String horario,
            String status
    ) {
    }

    public record InscricaoRequest(
            Long alunoId,
            Long eventoId,
            Long atividadeId,
            Long cursoId
    ) {
    }

    public record InscricaoResponse(
            Long id,
            Long alunoId,
            String alunoNome,
            Long eventoId,
            Long atividadeId,
            Long cursoId,
            String cursoTitulo,
            String status,
            String presenca
    ) {
    }

    public record PresencaRequest(
            Long atividadeId,
            Long cursoId,
            Long inscricaoId,
            Boolean presente
    ) {
    }

    public record PresencaResponse(
            Long id,
            Long atividadeId,
            Long cursoId,
            Long inscricaoId,
            Boolean presente
    ) {
    }

    public record CertificadoGerarRequest(
            Long alunoId,
            Long eventoId,
            Long atividadeId,
            Long cursoId
    ) {
    }

    public record CertificadoResponse(
            Long id,
            Long alunoId,
            Long eventoId,
            Long atividadeId,
            Long cursoId,
            String atividadeTitulo,
            String cursoTitulo,
            String codigo,
            Boolean validado
    ) {
    }

    public record LoginRequest(
            String email,
            String senha
    ) {
    }

    public record CadastroRequest(
            String nome,
            String email,
            String cpf,
            String senha
    ) {
    }

    public record UsuarioResponse(
            Long id,
            String nome,
            String email,
            String perfil
    ) {
    }
}
