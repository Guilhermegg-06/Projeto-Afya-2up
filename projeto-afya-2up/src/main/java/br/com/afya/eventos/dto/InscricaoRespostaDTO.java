package br.com.afya.eventos.dto;

import br.com.afya.eventos.model.Inscricao;
import br.com.afya.eventos.model.StatusInscricao;

import java.time.LocalDateTime;

public class InscricaoRespostaDTO {

    private Long id;
    private Long usuarioId;
    private String nomeUsuario;
    private Long atividadeId;
    private String nomeAtividade;
    private int vagasRestantes;
    private LocalDateTime dataInscricao;
    private StatusInscricao status;

    public InscricaoRespostaDTO(Inscricao i) {
        this.id = i.getId();
        this.usuarioId = i.getUsuario().getId();
        this.nomeUsuario = i.getUsuario().getNome();
        this.atividadeId = i.getAtividade().getId();
        this.nomeAtividade = i.getAtividade().getNomeAtv();
        this.vagasRestantes = i.getAtividade().getVagasRestantes();
        this.dataInscricao = i.getDataInscricao();
        this.status = i.getStatus();
    }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public String getNomeUsuario() { return nomeUsuario; }
    public Long getAtividadeId() { return atividadeId; }
    public String getNomeAtividade() { return nomeAtividade; }
    public int getVagasRestantes() { return vagasRestantes; }
    public LocalDateTime getDataInscricao() { return dataInscricao; }
    public StatusInscricao getStatus() { return status; }
}
