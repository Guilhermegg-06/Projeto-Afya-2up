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
import jakarta.persistence.Version;

import java.time.LocalDateTime;

@Entity
@Table(name = "atividades")
public class AtividadeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evento_id", nullable = false)
    private EventoEntity evento;

    @Column(nullable = false, length = 300)
    private String titulo;

    @Column(length = 2000)
    private String descricao;

    @Column(length = 150)
    private String palestrante;

    @Column(name = "vagas_total", nullable = false)
    private Integer vagas;

    @Column(name = "vagas_ocupadas", nullable = false)
    private Integer ocupadas = 0;

    @Column(length = 80)
    private String horario;

    @Column(nullable = false, length = 40)
    private String tipo;

    @Column(length = 100)
    private String sala;

    @Column(nullable = false)
    private LocalDateTime inicio;

    @Column(nullable = false)
    private LocalDateTime fim;

    @Column(name = "carga_horaria_h", nullable = false)
    private Double cargaHoraria = 1.0;

    @Version
    private Long versao;

    protected AtividadeEntity() {
    }

    public AtividadeEntity(EventoEntity evento, String titulo, String descricao, String palestrante, Integer vagas,
                           String horario, String tipo, LocalDateTime inicio, LocalDateTime fim) {
        this.evento = evento;
        this.titulo = titulo;
        this.descricao = descricao;
        this.palestrante = palestrante;
        this.vagas = vagas;
        this.horario = horario;
        this.tipo = tipo;
        this.sala = "Sala a definir";
        this.inicio = inicio;
        this.fim = fim;
    }

    public Long getId() { return id; }
    public EventoEntity getEvento() { return evento; }
    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public String getPalestrante() { return palestrante; }
    public Integer getVagas() { return vagas; }
    public Integer getOcupadas() { return ocupadas; }
    public String getHorario() { return horario; }
    public String getTipo() { return tipo; }
    public Double getCargaHoraria() { return cargaHoraria; }

    public void atualizar(String titulo, String descricao, String palestrante, Integer vagas, String horario, String tipo) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.palestrante = palestrante;
        this.vagas = vagas;
        this.horario = horario;
        this.tipo = tipo;
    }

    public void ocuparVaga() {
        if (ocupadas >= vagas) {
            throw new IllegalStateException("atividade lotada");
        }
        ocupadas++;
    }

    public void liberarVaga() {
        if (ocupadas > 0) {
            ocupadas--;
        }
    }
}