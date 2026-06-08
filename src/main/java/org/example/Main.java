package org.example;
import ServicoLogin.ServicoLogin;
import model.Usuario;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        ServicoLogin servicoLogin = new ServicoLogin();
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== Tela de Login ===");
        System.out.print("Usuário: ");
        String username = scanner.nextLine();
        System.out.print("Senha: ");
        String password = scanner.nextLine();

        Usuario usuario = servicoLogin.login  (username, password);

        if (usuario != null) {
            System.out.println("Login realizado como " + usuario.getTipo());
            } else {
            System.out.println("Usuario ou senha inválidos");
        }
        }
}
//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.


