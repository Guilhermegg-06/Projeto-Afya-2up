package Projeto-Afya-2up;

public class Aluno extends Pessoa{

    private static int proxIDAluno = 1;
    private int iDAluno;
    private String matricula;

    public Aluno(String nome, String cpf, int idade, String email, String matricula) {
        super(nome, cpf, idade, email);
        this.iDAluno = proxIDAluno++;
        this.matricula = matricula;
    }

    public int getIdAluno() {
        return iDAluno;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }
}
