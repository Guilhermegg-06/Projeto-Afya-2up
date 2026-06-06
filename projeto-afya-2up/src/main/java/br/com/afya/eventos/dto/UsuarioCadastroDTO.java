package br.com.afya.eventos.dto;

import br.com.afya.eventos.model.TipoUsuario;

public class UsuarioCadastroDTO {

    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private int idade;
    private TipoUsuario tipo;
    private String matricula; // obrigatório se tipo == ALUNO

    public UsuarioCadastroDTO() {}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public int getIdade() { return idade; }
    public void setIdade(int idade) { this.idade = idade; }

    public TipoUsuario getTipo() { return tipo; }
    public void setTipo(TipoUsuario tipo) { this.tipo = tipo; }

    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
}
