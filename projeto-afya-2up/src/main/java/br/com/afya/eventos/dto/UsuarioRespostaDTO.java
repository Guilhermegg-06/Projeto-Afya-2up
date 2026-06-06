package br.com.afya.eventos.dto;

import br.com.afya.eventos.model.TipoUsuario;
import br.com.afya.eventos.model.Usuario;

public class UsuarioRespostaDTO {

    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private int idade;
    private TipoUsuario tipo;
    private String matricula;

    public UsuarioRespostaDTO(Usuario u) {
        this.id = u.getId();
        this.nome = u.getNome();
        this.cpf = u.getCpf();
        this.email = u.getEmail();
        this.idade = u.getIdade();
        this.tipo = u.getTipo();
        this.matricula = u.getMatricula();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getCpf() { return cpf; }
    public String getEmail() { return email; }
    public int getIdade() { return idade; }
    public TipoUsuario getTipo() { return tipo; }
    public String getMatricula() { return matricula; }
}
