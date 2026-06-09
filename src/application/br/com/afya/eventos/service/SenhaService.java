package br.com.afya.eventos.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class SenhaService {

    public String gerarHash(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encoded = digest.digest(senha.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte value : encoded) {
                hex.append(String.format("%02x", value));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Nao foi possivel gerar hash da senha", ex);
        }
    }

    public boolean confere(String senhaDigitada, String hashSalvo) {
        if (senhaDigitada == null || hashSalvo == null || hashSalvo.isBlank()) {
            return false;
        }
        return gerarHash(senhaDigitada).equals(hashSalvo);
    }
}
