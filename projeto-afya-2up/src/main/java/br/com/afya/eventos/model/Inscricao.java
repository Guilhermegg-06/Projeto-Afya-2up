package br.com.afya.eventos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscricoes")
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Aluno que se inscreve (referencia o Usuario com tipo ALUNO)
    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Atividade na qual o aluno se inscreve
    @ManyToOne(optional = false)
    @JoinColumn(name = "atividade_id")
    private Atividade atividade;

    @Column(nullable = false)
    private LocalDateTime dataInscricao = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusInscricao status = StatusInscricao.INSCRITO;

    public Inscricao() {}

    public Inscricao(Usuario usuario, Atividade atividade) {
        this.usuario = usuario;
        this.atividade = atividade;
        this.dataInscricao = LocalDateTime.now();
        this.status = StatusInscricao.INSCRITO;
    }

    public Long getId() { return id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Atividade getAtividade() { return atividade; }
    public void setAtividade(Atividade atividade) { this.atividade = atividade; }

    public LocalDateTime getDataInscricao() { return dataInscricao; }

    public StatusInscricao getStatus() { return status; }
    public void setStatus(StatusInscricao status) { this.status = status; }
}
