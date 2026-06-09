const SESSION_KEY = "amry:usuario";

export function salvarUsuario(usuario) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
}

export function lerUsuario() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
    } catch {
        return null;
    }
}

export function limparUsuario() {
    localStorage.removeItem(SESSION_KEY);
}

export function alunoIdAtual() {
    const usuario = lerUsuario();
    return usuario?.perfil === "ALUNO" ? String(usuario.id) : "1";
}
