package Projeto-Afya-2up;

public class Coordenador extends Pessoa implements CriadorDeEventos{

    private static int proxIDCoord = 1;
    private int iDCoord;

    public Coordenador(String nome, String cpf, int idade, String email) {
        super(nome, cpf, idade, email);
        this.iDCoord = proxIDCoord++;
    }

        public int getIdCoord() {
        return iDCoord;
    }

        @Override
    private CriarEventos (){
        
    }

}
