# Projeto-Afya-2up

Plataforma de Gestão de Eventos Acadêmicos e Emissão de Certificados

## 📋 Sobre o Projeto

Sistema desenvolvido para gerenciar eventos acadêmicos, permitindo que coordenadores criem eventos e atividades, participantes realizem inscrições e, ao final, certificados sejam emitidos automaticamente para quem teve presença confirmada.

## 🎯 Tema

**Tema 6 - Plataforma de Gestão de Eventos Acadêmicos e Emissão de Certificados**

Contextos do domínio:
- **Inscrições** — controle de vagas e inscrições em atividades
- **Grade de Programação** — eventos, palestras e minicursos
- **Certificação** — validação de presença e emissão de certificados

## 🛠️ Tecnologias

- Java 17
- Maven
- MySQL 8
- JUnit 5 (testes)
- GitHub Actions (CI/CD)

## 📁 Estrutura do Projeto

```
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   │   └── db/
│   │       └── schema.sql
│   └── presentation/
├── tests/
├── project-meta.json
└── README.md
```

## 🚀 Como Executar

1. Clone o repositório
```bash
git clone https://github.com/Guilhermegg-06/Projeto-Afya-2up.git
```

2. Configure o banco de dados MySQL e execute o script:
```bash
mysql -u root -p < src/infrastructure/db/schema.sql
```

3. Execute o projeto com Maven:
```bash
mvn clean install
mvn exec:java
```

## 🧪 Testes

```bash
mvn test
```

## 👥 Integrantes

| Nome | GitHub |
|---|---|
| Arthur Barbosa |Arthurz11 |
| Kevin Anderson |KevinAFS |
| Guilherme Araujo |Guilhermegg-06 |
| Luis Henrique | |
| Gabriel Tupinambá | |

---

Disciplina: Projeto de Programação
