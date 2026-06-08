public enum StatusInscricao {

    Inscrito("Inscrito"),
    Cancelado("Cancelado"),
    ListaDeEspera("Lista de Espera"),
    Concluido("Concluído");

    private final String descricao;

    StatusInscricao(String descricao) {
        this.descricao = descricao;
    }

    @Override
    public String toString() {
        return descricao;
    }
}
