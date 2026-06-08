package br.com.afya.eventos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "atividades")
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeAtv;

    private String descricaoAtv;
    private String tipoAtv;
    private String dataAtv;
    private String horarioInicioAtv;
    private String horarioFimAtv;

    @Column(nullable = false)
    private int vagasAtv;

    @Column(nullable = false)
    private int vagasOcupadas = 0;

    private double cargaHorariaAtv;

    public Atividade() {}

    // ── getters e setters ────────────────────────────────────────────────────

    public Long getId() { return id; }

    public String getNomeAtv() { return nomeAtv; }
    public void setNomeAtv(String nomeAtv) { this.nomeAtv = nomeAtv; }

    public String getDescricaoAtv() { return descricaoAtv; }
    public void setDescricaoAtv(String descricaoAtv) { this.descricaoAtv = descricaoAtv; }

    public String getTipoAtv() { return tipoAtv; }
    public void setTipoAtv(String tipoAtv) { this.tipoAtv = tipoAtv; }

    public String getDataAtv() { return dataAtv; }
    public void setDataAtv(String dataAtv) { this.dataAtv = dataAtv; }

    public String getHorarioInicioAtv() { return horarioInicioAtv; }
    public void setHorarioInicioAtv(String horarioInicioAtv) { this.horarioInicioAtv = horarioInicioAtv; }

    public String getHorarioFimAtv() { return horarioFimAtv; }
    public void setHorarioFimAtv(String horarioFimAtv) { this.horarioFimAtv = horarioFimAtv; }

    public int getVagasAtv() { return vagasAtv; }
    public void setVagasAtv(int vagasAtv) { this.vagasAtv = vagasAtv; }

    public int getVagasOcupadas() { return vagasOcupadas; }
    public void setVagasOcupadas(int vagasOcupadas) { this.vagasOcupadas = vagasOcupadas; }

    public double getCargaHorariaAtv() { return cargaHorariaAtv; }
    public void setCargaHorariaAtv(double cargaHorariaAtv) { this.cargaHorariaAtv = cargaHorariaAtv; }

    // ── regra de negocio ─────────────────────────────────────────────────────

    public boolean temVagasDisponiveis() {
        return vagasOcupadas < vagasAtv;
    }

    public int getVagasRestantes() {
        return vagasAtv - vagasOcupadas;
    }
}
