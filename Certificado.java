public class Certificado {

    private static int proxIdCertificado = 1;

    private int idCertificado;
    private String codigoValidacao;
    private Aluno aluno;
    private Eventos evento;
    private Atividade atividade;
    private Coordenador coordenador;
    private String dataEmissao;
    private double cargaHoraria;

    public Certificado(Aluno aluno, Eventos evento, Atividade atividade, Coordenador coordenador, String dataEmissao, double cargaHoraria){
        this.idCertificado = proxIdCertificado++;
        this.codigoValidacao = "CERT-" + idCertificado;
        this.aluno = aluno;
        this.evento = evento;
        this.atividade = atividade;
        this.coordenador = coordenador;
        this.dataEmissao = dataEmissao;
        this.cargaHoraria = cargaHoraria;
    }

    public int getIdCertificado() {
        return idCertificado;
    }

    public String getCodigoValidacao() {
        return codigoValidacao;
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

    public Coordenador getCoordenador() {
        return coordenador;
    }

    public void setCoordenador(Coordenador coordenador) {
        this.coordenador = coordenador;
    }

    public String getDataEmissao() {
        return dataEmissao;
    }

    public void setDataEmissao(String dataEmissao) {
        this.dataEmissao = dataEmissao;
    }

    public double getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(double cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }

}
