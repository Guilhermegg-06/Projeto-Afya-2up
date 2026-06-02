package Projeto-Afya-2up;

public class Pessoa {

    private static int proximoID = 1;

    private int id;
    private String nome;
    private String cpf;
    private int idade;
    private String email;

    public Pessoa(String nome, String cpf, int idade, String email) {
        this.id = proximoID++;
        this.nome = nome;
        this.cpf = cpf;
        this.idade = idade;
        this.email = email;
    }

    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}