public class Eventos {

    private static int proxIdEvento = 1;
    private int idEvento;
    private Boolean disponibilidadeEvento; /*Diz se o evento esta aberto, ou se ja fechou, seja por ja ter passado da Data ou pro escolha do organizador. */
    private String categoriaEvento;
    private String dataEvento;
    private String localEvento;
    private String descricaoEvento;
    private String tipoEvento; /*Palestra, MiniCurso e etc */
    private String nomeEvento;
    private Double horasComplementares;
    private int vagasDisponiveis;
    private Coordenador organizador;

    public Eventos(Boolean disponibilidadeEvento, String categoriaEvento, String dataEvento, String localEvento, String descricaoEvento, String tipoEvento, String nomeEvento, Double horasComplementares, int vagasDisponiveis, Coordenador organizador){
        this.idEvento = proxIdEvento++;
        this.disponibilidadeEvento = disponibilidadeEvento;
        this.categoriaEvento = categoriaEvento;
        this.dataEvento = dataEvento;
        this.localEvento = localEvento;
        this.descricaoEvento = descricaoEvento;
        this.tipoEvento = tipoEvento;
        this.nomeEvento = nomeEvento;
        this.horasComplementares = horasComplementares;
        this.vagasDisponiveis = vagasDisponiveis;
        this.organizador = organizador;

}
    public int getIdEvento() {
        return idEvento;
    }

    public Boolean getDisponibilidadeEvento() {
        return disponibilidadeEvento;
    }

    public void setDisponibilidadeEvento(Boolean disponibilidadeEvento) {
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

    public Coordenador getOrganizador() {
        return organizador;
    }

    public void setOrganizador(Coordenador organizador) {
        this.organizador = organizador;
    }

}
