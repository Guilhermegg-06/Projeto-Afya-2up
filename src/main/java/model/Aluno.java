package model;

public class Aluno extends Usuario {
    public Aluno(String username, String password) {
        super(username, password);
    }

    @Override
    public String getTipo() {
        return "Aluno";

    }
}