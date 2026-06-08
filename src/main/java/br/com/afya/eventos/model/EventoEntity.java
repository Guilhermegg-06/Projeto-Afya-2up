package br.com.afya.eventos.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "eventos")
public class EventoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "coordenador_id", nullable = false)
    private Long coordenadorId = 1L;

    @Column(nullable = false, length = 300)
    private String titulo;

    @Column(length = 2000)
    private String descricao;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @Column(nullable = false, length = 300)
    private String local;

    @Column(nullable = false)
    private Integer capacidade;

    @Column(nullable = false, length = 40)
    private String status;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "evento_etiquetas", joinColumns = @JoinColumn(name = "evento_id"))
    @Column(name = "etiqueta", length = 80)
    private List<String> etiquetas = new ArrayList<>();

    protected EventoEntity() {
    }

    public EventoEntity(String titulo, String descricao, LocalDate dataInicio, LocalDate dataFim, String local,
                        Integer capacidade, String status, List<String> etiquetas) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.local = local;
        this.capacidade = capacidade;
        this.status = status;
        this.etiquetas = new ArrayList<>(etiquetas);
    }

    public Long getId() { return id; }
    public Long getCoordenadorId() { return coordenadorId; }
    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public LocalDate getDataInicio() { return dataInicio; }
    public LocalDate getDataFim() { return dataFim; }
    public String getLocal() { return local; }
    public Integer getCapacidade() { return capacidade; }
    public String getStatus() { return status; }
    public List<String> getEtiquetas() { return etiquetas; }

    public void definirCoordenadorId(Long coordenadorId) {
        this.coordenadorId = coordenadorId;
    }

    public void atualizar(String titulo, String descricao, LocalDate dataInicio, LocalDate dataFim, String local,
                          Integer capacidade, String status, List<String> etiquetas) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.local = local;
        this.capacidade = capacidade;
        this.status = status;
        this.etiquetas.clear();
        this.etiquetas.addAll(etiquetas);
    }
}
