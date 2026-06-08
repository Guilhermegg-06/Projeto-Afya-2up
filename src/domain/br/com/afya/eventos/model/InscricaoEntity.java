package br.com.afya.eventos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(name = "inscricoes", uniqueConstraints = {
        @UniqueConstraint(name = "uk_inscricao_participante_atividade", columnNames = {"participante_id", "atividade_id"})
})
public class InscricaoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participante_id", nullable = false)
    private Long alunoId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atividade_id", nullable = false)
    private AtividadeEntity atividade;

    @Column(nullable = false, length = 30)
    private String status = "Inscrito";

    @Column(nullable = false, length = 30)
    private String presenca = "Pendente";

    @Column(name = "inscrito_em", nullable = false)
    private LocalDateTime inscritoEm = LocalDateTime.now();

    protected InscricaoEntity() {
    }

    public InscricaoEntity(Long alunoId, AtividadeEntity atividade) {
        this.alunoId = alunoId;
        this.atividade = atividade;
    }

    public Long getId() { return id; }
    public Long getAlunoId() { return alunoId; }
    public AtividadeEntity getAtividade() { return atividade; }
    public String getStatus() { return status; }
    public String getPresenca() { return presenca; }

    public void atualizarPresenca(boolean presente) {
        this.presenca = presente ? "Confirmada" : "Ausente";
    }
}