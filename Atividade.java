import jakarta.persistence.*;

@Entity
@Table(name = "atividades")

public class Atividade {    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeAtv;
    private String descricaoAtv;
    private String tipoAtv; // Palestra, Minicurso, Workshop...
    private String dataAtv;
    private String horarioInicioAtv;
    private String horarioFimAtv;
    private int vagasAtv;
    private double cargaHorariaAtv;
    private Coordenador responsavelAtv;
    @ManyToOne
    @JoinColumn(name = "evento_id")
    private Eventos evento;

    public Atividade() {
    }

    public Atividade (String nomeAtv, String descricaoAtv, String tipoAtv, String dataAtv, String horarioInicioAtv, String horarioFimAtv, int vagasAtv, double cargaHorariaAtv, Coordenador responsavelAtv, Eventos evento){

        this.nomeAtv = nomeAtv;
        this.descricaoAtv = descricaoAtv;
        this.tipoAtv = tipoAtv;
        this.dataAtv = dataAtv;
        this.horarioInicioAtv = horarioInicioAtv;
        this.horarioFimAtv = horarioFimAtv;
        this.vagasAtv = vagasAtv;
        this.cargaHorariaAtv = cargaHorariaAtv;
        this.responsavelAtv = responsavelAtv;
        this.evento = evento;

    }

    public Long getId() {
        return id;
    }

    public String getNomeAtv() {
        return nomeAtv;
    }

    public void setNomeAtv(String nomeAtv) {
        this.nomeAtv = nomeAtv;
    }

    public String getDescricaoAtv() {
        return descricaoAtv;
    }

    public void setDescricaoAtv(String descricaoAtv) {
        this.descricaoAtv = descricaoAtv;
    }

    public String getTipoAtv() {
        return tipoAtv;
    }

    public void setTipoAtv(String tipoAtv) {
        this.tipoAtv = tipoAtv;
    }

    public String getDataAtv() {
        return dataAtv;
    }

    public void setDataAtv(String dataAtv) {
        this.dataAtv = dataAtv;
    }

    public String getHorarioInicioAtv() {
        return horarioInicioAtv;
    }

    public void setHorarioInicioAtv(String horarioInicioAtv) {
        this.horarioInicioAtv = horarioInicioAtv;
    }

    public String getHorarioFimAtv() {
        return horarioFimAtv;
    }

    public void setHorarioFimAtv(String horarioFimAtv) {
        this.horarioFimAtv = horarioFimAtv;
    }

    public int getVagasAtv() {
    return vagasAtv;
    }

    public void setVagasAtv(int vagasAtv) {
        this.vagasAtv = vagasAtv;
    }

    public double getCargaHorariaAtv() {
        return cargaHorariaAtv;
    }

    public void setCargaHorariaAtv(double cargaHorariaAtv) {
        this.cargaHorariaAtv = cargaHorariaAtv;
    }

    public Coordenador getResponsavelAtv() {
        return responsavelAtv;
    }

    public void setResponsavelAtv(Coordenador responsavelAtv) {
        this.responsavelAtv = responsavelAtv;
    }

    public Eventos getEvento() {
        return evento;
    }

    public void setEvento(Eventos evento) {
        this.evento = evento;
    }


}
