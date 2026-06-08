public class Inscricao {

    private static int proxIdInscricao = 1;

    private int idInscricao;
    private Aluno aluno;
    private Eventos evento;
    private Atividade atividade;
    private String dataInscricao;
    private StatusInscricao status;;
    
    public Inscricao(Aluno aluno, Eventos evento, Atividade atividade, String dataInscricao, StatusInscricao status){
        this.idInscricao = proxIdInscricao++;
        this.aluno = aluno;
        this.evento = evento;
        this.atividade = atividade;
        this.dataInscricao = dataInscricao;
        this.status = status;
    }

    public int getIdInscricao() {
        return idInscricao;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Eventos getEvento() {
        return evento;
    }

    public void setEvento(Eventos evento) {
        this.evento = evento;
    }

    public Atividade getAtividade() {
        return atividade;
    }

    public void setAtividade(Atividade atividade) {
        this.atividade = atividade;
    }

    public String getDataInscricao() {
        return dataInscricao;
    }

    public void setDataInscricao(String dataInscricao) {
        this.dataInscricao = dataInscricao;
    }

    public StatusInscricao getStatus() {
        return status;
    }

    public void setStatus(StatusInscricao status) {
        this.status = status;
    }

}
