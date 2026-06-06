public enum StatusPresenca {
    
    Presente("Presente"),
    Ausente("Ausente"),
    Pendente("Pendente");

    private final String descricao;

    StatusPresenca(String descricao) {
        this.descricao = descricao;
    }

    @Override
    public String toString() {
        return descricao;
    }
    
}
