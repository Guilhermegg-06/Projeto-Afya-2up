package model;

public class Professor extends Usuario {
    public Professor(String username, String password) {
        super(username, password);
    }
    @Override
    public String getTipo() {
        return "Professor";
    }
}

