public class Presenca {

    private static int proxIdPresenca = 1;

    private int idPresenca;
    private Aluno aluno;
    private Eventos evento;
    private Atividade atividade;
    private StatusPresenca statusPresenca;
    private String dataConfirmacao;
    private Coordenador validadoPor;

    public Presenca (Aluno aluno, Eventos evento, Atividade atividade, StatusPresenca statusPresenca, String dataConfirmacao, Coordenador validadoPor){
        this.idPresenca = proxIdPresenca++;
        this.aluno = aluno;
        this.evento = evento;
        this.atividade = atividade;
        this.statusPresenca = statusPresenca;
        this.dataConfirmacao = dataConfirmacao;
        this.validadoPor = validadoPor;
    }

    public int getIdPresenca() {
        return idPresenca;
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

    public StatusPresenca getStatusPresenca() {
        return statusPresenca;
    }

    public void setStatusPresenca(StatusPresenca statusPresenca) {
        this.statusPresenca = statusPresenca;
    }

    public String getDataConfirmacao() {
        return dataConfirmacao;
    }

    public void setDataConfirmacao(String dataConfirmacao) {
        this.dataConfirmacao = dataConfirmacao;
    }

    public Coordenador getValidadoPor() {
        return validadoPor;
    }

    public void setValidadoPor(Coordenador validadoPor) {
        this.validadoPor = validadoPor;
    }

}
