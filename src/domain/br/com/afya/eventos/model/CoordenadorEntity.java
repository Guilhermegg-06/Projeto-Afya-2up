package br.com.afya.eventos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "coordenadores")
public class CoordenadorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 200)
    private String instituicao;

    @Column(name = "senha_hash", length = 64)
    private String senhaHash;

    protected CoordenadorEntity() {
    }

    public CoordenadorEntity(String nome, String email, String instituicao) {
        this(nome, email, instituicao, null);
    }

    public CoordenadorEntity(String nome, String email, String instituicao, String senhaHash) {
        this.nome = nome;
        this.email = email == null ? null : email.toLowerCase();
        this.instituicao = instituicao;
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

    public String getInstituicao() {
        return instituicao;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void definirSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }
}
