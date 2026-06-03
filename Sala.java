public class Sala {
    
    private String instrituicao;
    private String nome;
    private String bloco;
    private String numSala;
    private String andar;
    private int capacidade;
    private String descricao;

    public Sala(String instituicao, String nome, String bloco, String numSala, String andar, int capacidade, String descricao){
        this.instrituicao = instituicao;
        this.nome = nome;
        this.bloco = bloco;
        this.numSala = numSala;
        this.andar = andar;
        this.capacidade = capacidade;
        this.descricao = descricao;

    }
    
    public String getInstrituicao() {
        return instrituicao;
    }

    public void setInstrituicao(String instrituicao) {
        this.instrituicao = instrituicao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getBloco() {
        return bloco;
    }

    public void setBloco(String bloco) {
        this.bloco = bloco;
    }

    public String getNumSala() {
        return numSala;
    }

    public void setNumSala(String numSala) {
        this.numSala = numSala;
    }

    public String getAndar() {
        return andar;
    }

    public void setAndar(String andar) {
        this.andar = andar;
    }

    public int getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(int capacidade) {
        this.capacidade = capacidade;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

}
