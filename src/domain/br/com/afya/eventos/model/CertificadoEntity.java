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
@Table(name = "certificados", uniqueConstraints = {
        @UniqueConstraint(name = "uk_certificado_participante_atividade", columnNames = {"participante_id", "atividade_id"})
})
public class CertificadoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participante_id", nullable = false)
    private Long alunoId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atividade_id", nullable = false)
    private AtividadeEntity atividade;

    @Column(name = "codigo_validacao", nullable = false, unique = true, length = 40)
    private String codigo;

    @Column(nullable = false)
    private Boolean validado = true;

    @Column(name = "carga_horaria_h", nullable = false)
    private Double cargaHoraria = 1.0;

    @Column(name = "emitido_em", nullable = false)
    private LocalDateTime emitidoEm = LocalDateTime.now();

    protected CertificadoEntity() {
    }

    public CertificadoEntity(Long alunoId, AtividadeEntity atividade, String codigo) {
        this.alunoId = alunoId;
        this.atividade = atividade;
        this.codigo = new CodigoCertificado(codigo).valor();
        this.cargaHoraria = atividade.getCargaHoraria();
    }

    public Long getId() { return id; }
    public Long getAlunoId() { return alunoId; }
    public AtividadeEntity getAtividade() { return atividade; }
    public String getCodigo() { return codigo; }
    public Boolean getValidado() { return validado; }
}
