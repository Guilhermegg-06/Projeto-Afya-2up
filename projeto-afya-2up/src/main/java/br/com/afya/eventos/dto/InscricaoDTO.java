package br.com.afya.eventos.dto;

public class InscricaoDTO {

    private Long usuarioId;
    private Long atividadeId;

    public InscricaoDTO() {}

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Long getAtividadeId() { return atividadeId; }
    public void setAtividadeId(Long atividadeId) { this.atividadeId = atividadeId; }
}
