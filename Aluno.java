package Projeto-Afya-2up;

public class Aluno {

    private String matricula;

    public Aluno(String nome, String cpf, int idade, String email, String matricula) {
        super(nome, cpf, idade, email);
        this.matricula = matricula;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }
}