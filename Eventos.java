public class Eventos {

    private Boolean disponibilidadeEvento; /*Diz se o evento esta aberto, ou se ja fechou, seja por ja ter passado da Data ou pro escolha do organizador. */
    private String categoriaEvento;
    private String dataEvento;
    private String localEvento;
    private String descricaoEvento;
    private String tipoEvento; /*Palestra ou MiniCurso */
    private String nomeEvento;
    private Double horasComplementares;
    private int vagasDisponiveis;
    private boolean presenca;

public Eventos(Boolean disponibilidadeEvento, String categoriaEvento, String dataEvento, String localEvento, String descricaoEvento, String tipoEvento, String nomeEvento, Double horasComplementares, int vagasDisponiveis, boolean presenca){
    this.disponibilidadeEvento = disponibilidadeEvento;
    this.categoriaEvento = categoriaEvento;
    this.dataEvento = dataEvento;
    this.localEvento = localEvento;
    this.descricaoEvento = descricaoEvento;
    this.tipoEvento = tipoEvento;
    this.nomeEvento = nomeEvento;
    this.horasComplementares = horasComplementares;
    this.vagasDisponiveis = vagasDisponiveis;
    this.presenca = presenca;
}
    public boolean getdisponibilidadeEvento(){
        return disponibilidadeEvento;
    }

    public void setdisponibilidadeEvento(boolean disponibilidadeEvento){
        this.disponibilidadeEvento = disponibilidadeEvento;
    }


    public String getCategoriaEvento() {
        return categoriaEvento;
    }

    public void setCategoriaEvento(String categoriaEvento) {
        this.categoriaEvento = categoriaEvento;
    }

    public String getDataEvento() {
        return dataEvento;
    }

    public void setDataEvento(String dataEvento) {
        this.dataEvento = dataEvento;
    }

    public String getLocalEvento() {
        return localEvento;
    }

    public void setLocalEvento(String localEvento) {
        this.localEvento = localEvento;
    }

    public String getDescricaoEvento() {
        return descricaoEvento;
    }

    public void setDescricaoEvento(String descricaoEvento) {
        this.descricaoEvento = descricaoEvento;
    }

    public String getTipoEvento() {
        return tipoEvento;
    }

    public void setTipoEvento(String tipoEvento) {
        this.tipoEvento = tipoEvento;
    }

    public String getNomeEvento() {
        return nomeEvento;
    }

    public void setNomeEvento(String nomeEvento) {
        this.nomeEvento = nomeEvento;
    }

    public Double getHorasComplementares() {
        return horasComplementares;
    }

    public void setHorasComplementares(Double horasComplementares) {
        this.horasComplementares = horasComplementares;
    }

    public int getVagasDisponiveis() {
        return vagasDisponiveis;
    }

    public void setVagasDisponiveis(int vagasDisponiveis) {
        this.vagasDisponiveis = vagasDisponiveis;
    }

    public boolean isPresenca() {
        return presenca;
    }

    public void setPresenca(boolean presenca) {
        this.presenca = presenca;
    }

}
