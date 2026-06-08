import java.util.Map;

public class ServicoLogin {
    private Map<String, Usuario> usuarios;

    // Recebe os usuários já cadastrados (por exemplo, vindos do cadastro)
    public ServicoLogin(Map<String, Usuario> usuarios) {
        this.usuarios = usuarios;
    }


    public Usuario login(String username, String password) {
        Usuario usuario = usuarios.get(username);
        if (usuario != null && usuario.getPassword().equals(password)) {
            return usuario;
        }
        return null;
    }
}
