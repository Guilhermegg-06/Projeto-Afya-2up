package br.com.afya.eventos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "participantes")
public class ParticipanteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(name = "senha_hash", length = 64)
    private String senhaHash;

    protected ParticipanteEntity() {
    }

    public ParticipanteEntity(String nome, String email, String cpf) {
        this(nome, email, cpf, null);
    }

    public ParticipanteEntity(String nome, String email, String cpf, String senhaHash) {
        this.nome = nome;
        this.email = email == null ? null : email.toLowerCase();
        this.cpf = cpf;
        this.senhaHash = senhaHash;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getCpf() {
        return cpf;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void definirSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }
}
