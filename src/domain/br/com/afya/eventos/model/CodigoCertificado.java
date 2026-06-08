package br.com.afya.eventos.model;

public record CodigoCertificado(String valor) {

    public CodigoCertificado {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("codigo do certificado e obrigatorio");
        }
        if (valor.length() > 40) {
            throw new IllegalArgumentException("codigo do certificado deve ter ate 40 caracteres");
        }
    }
}