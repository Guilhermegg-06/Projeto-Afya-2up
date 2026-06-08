package br.com.afya.eventos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "presencas")
public class PresencaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inscricao_id", nullable = false, unique = true)
    private InscricaoEntity inscricao;

    @Column(nullable = false)
    private Boolean presente;

    @Column(name = "registrado_em", nullable = false)
    private LocalDateTime registradoEm = LocalDateTime.now();

    protected PresencaEntity() {
    }

    public PresencaEntity(InscricaoEntity inscricao, Boolean presente) {
        this.inscricao = inscricao;
        this.presente = presente;
    }

    public Long getId() { return id; }
    public InscricaoEntity getInscricao() { return inscricao; }
    public Boolean getPresente() { return presente; }

    public void atualizar(Boolean presente) {
        this.presente = presente;
        this.registradoEm = LocalDateTime.now();
    }
}