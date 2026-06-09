# Explicacao dos Fluxos Reais - AMRY Cursos

Este arquivo explica as regras implementadas para deixar login, cadastro, presenca e certificado com comportamento mais realista, sem adicionar JWT ainda.

## 1. Login

O login deixou de aceitar qualquer texto.

Agora o frontend envia email e senha para:

```http
POST /api/auth/login
```

Payload:

```json
{
  "email": "aluno1@amry.local",
  "senha": "aluno123"
}
```

O backend valida:

- email obrigatorio;
- formato basico de email;
- senha obrigatoria;
- senha com pelo menos 6 caracteres;
- usuario precisa existir no banco;
- senha digitada precisa bater com o hash salvo.

Se o usuario for aluno, o frontend libera a area do aluno.
Se o usuario for coordenador, o frontend libera a area do coordenador.
Se o usuario tentar entrar pela area errada, a tela avisa.

Usuarios padrao criados pelo seed:

```text
Aluno:
email: aluno1@amry.local
senha: aluno123

Coordenador:
email: coordenador@amry.local
senha: admin123
```

A senha nao fica salva pura. O backend salva um hash SHA-256 no campo `senha_hash`.

## 2. Cadastro

O cadastro deixou de ser apenas visual.

Agora o frontend envia os dados para:

```http
POST /api/auth/cadastro
```

Payload:

```json
{
  "nome": "Nome do Aluno",
  "email": "aluno@email.com",
  "cpf": "00000000000",
  "senha": "senha123"
}
```

O backend valida:

- nome obrigatorio;
- email obrigatorio e com formato valido;
- CPF obrigatorio com 11 digitos;
- senha obrigatoria com pelo menos 6 caracteres;
- email nao pode existir em participantes nem coordenadores;
- CPF nao pode existir em participantes.

Se estiver tudo certo, cria um participante novo no banco.

## 3. Presenca

Antes o coordenador digitava qualquer inscricao e a presenca era aceita de forma solta.

Agora a regra e:

- o coordenador escolhe uma atividade;
- o sistema lista as inscricoes reais daquela atividade;
- o coordenador marca cada inscricao como presente ou ausente;
- o backend confere se a inscricao realmente pertence a atividade informada.

Endpoint usado para listar inscricoes:

```http
GET /api/atividades/{atividadeId}/inscricoes
```

Endpoint usado para registrar presenca:

```http
POST /api/presencas
```

Payload:

```json
{
  "atividadeId": 1,
  "inscricaoId": 10,
  "presente": true
}
```

O backend valida:

- atividadeId obrigatorio;
- inscricaoId obrigatorio;
- inscricao precisa existir;
- inscricao precisa pertencer a atividade informada;
- se a presenca ja existir, ela e atualizada;
- a inscricao recebe status `Confirmada` ou `Ausente`.

## 4. Certificado

A emissao de certificado agora segue uma regra real:

- aluno precisa estar inscrito na atividade;
- a atividade precisa pertencer ao evento informado, quando o evento for enviado;
- a presenca precisa estar confirmada pelo coordenador;
- o sistema nao gera certificado duplicado para o mesmo aluno e atividade;
- o certificado recebe codigo de validacao.

Endpoint de emissao:

```http
POST /api/certificados/gerar
```

Payload:

```json
{
  "alunoId": 1,
  "eventoId": 1,
  "atividadeId": 1
}
```

Endpoint de validacao:

```http
GET /api/certificados/validar/{codigo}
```

Endpoint da imagem do certificado:

```http
GET /api/certificados/validar/{codigo}/imagem
```

A imagem e gerada no backend com Java puro, usando `BufferedImage` e `Graphics2D`.
Nao foi adicionada biblioteca externa para evitar risco no deploy.

A imagem contem:

- nome da plataforma;
- titulo do certificado;
- nome do aluno;
- nome da atividade/curso;
- mensagem de parabens;
- codigo de validacao;
- assinatura simples da coordenacao.

## 5. Banco de Dados

As tabelas `participantes` e `coordenadores` agora possuem o campo:

```sql
senha_hash VARCHAR(64)
```

O script `src/infrastructure/db/schema.sql` foi atualizado.

Como o Render usa Hibernate com `ddl-auto=update`, o campo deve ser criado automaticamente no Supabase quando a aplicacao subir.

## 6. Frontend

O frontend agora usa sessao simples em `localStorage`.

Arquivo:

```text
frontend/src/services/session.js
```

Ele guarda:

- id do usuario;
- nome;
- email;
- perfil: `ALUNO` ou `COORDENADOR`.

Isso ainda nao e JWT. E uma sessao simples para o trabalho funcionar de forma realista sem implementar seguranca completa agora.

## 7. Limites conhecidos

Ainda nao foi implementado:

- JWT;
- criptografia forte com BCrypt;
- recuperacao de senha;
- permissao real no backend por perfil;
- PDF do certificado.

Mesmo assim, o fluxo deixou de ser falso e passou a ter regras reais de banco, validacao e consistencia.
