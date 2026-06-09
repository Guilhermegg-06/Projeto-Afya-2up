# Projeto-Afya-2up

Plataforma de Gestão de Eventos Acadêmicos e Emissão de Certificados
## LINK DO SITE NA WEB: https://cursos-amry.vercel.app

## 📋 Sobre o Projeto

Sistema desenvolvido para gerenciar eventos acadêmicos, permitindo que coordenadores criem eventos e atividades, participantes realizem inscrições e, ao final, certificados sejam emitidos automaticamente para quem teve presença confirmada.

O sistema atende dois perfis principais:

- **Aluno** — visualiza eventos, escolhe atividades, acompanha inscrições e consulta certificados.
- **Coordenador** — cria eventos, gerencia atividades, controla vagas, valida presenças e libera certificados.

## 🎯 Tema

**Tema 6 - Plataforma de Gestão de Eventos Acadêmicos e Emissão de Certificados**

Contextos do domínio:
- **Inscrições** — controle de vagas e inscrições em atividades
- **Grade de Programação** — eventos, palestras e minicursos
- **Certificação** — validação de presença e emissão de certificados

## 🛠️ Tecnologias

- Java 17
- Spring Boot
- Maven
- PostgreSQL
- React + Vite (frontend)
- JUnit 5 (testes)
- GitHub Actions (CI/CD)
- Docker (deploy)

## 📁 Estrutura do Projeto

```
├── .github/
│   └── workflows/
│       └── ci.yml
├── frontend/
├── src/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   │   └── db/
│   │       └── schema.sql
│   └── presentation/
├── tests/
├── Dockerfile
├── pom.xml
├── project-meta.json
└── README.md
```

## 🚀 Como Executar

### Backend

Pré-requisitos:
- Java 17
- Maven
- PostgreSQL rodando localmente com o banco `projeto_afya` criado

```bash
# Executar o script do banco
psql -U postgres -d projeto_afya -f src/infrastructure/db/schema.sql

# Compilar e rodar
mvn clean verify
mvn spring-boot:run
```

URL local: `http://localhost:8080/api/health`

### Frontend

Pré-requisitos:
- Node.js instalado
- Backend rodando localmente

```bash
cd frontend
npm install
npm run dev
```

URL local: `http://localhost:5173`

## 🧪 Testes

```bash
mvn test
```

Testes implementados:
- `ProjetoAfyaApplicationTests` — sobe o contexto Spring com H2 em memória
- `AtividadeEntityTest` — testa limite de vagas e liberação de vaga
- `PeriodoEventoTest` — testa validade do período de evento
- `CodigoCertificadoTest` — testa validade do código de certificado

## 🔌 Endpoints REST

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/eventos` | Listar eventos |
| POST | `/api/eventos` | Criar evento |
| GET | `/api/eventos/{id}` | Buscar evento |
| PUT | `/api/eventos/{id}` | Atualizar evento |
| DELETE | `/api/eventos/{id}` | Remover evento |
| GET | `/api/eventos/{id}/atividades` | Listar atividades |
| POST | `/api/inscricoes` | Realizar inscrição |
| DELETE | `/api/inscricoes/{id}` | Cancelar inscrição |
| POST | `/api/presencas` | Registrar presença |
| GET | `/api/certificados` | Listar certificados |
| GET | `/api/certificados/validar/{codigo}` | Validar certificado |

## 🏗️ Arquitetura DDD

### `src/domain`
Entidades, Value Objects e regras de negócio:
- `EventoEntity`, `AtividadeEntity`, `InscricaoEntity`, `PresencaEntity`, `CertificadoEntity`, `ParticipanteEntity`, `CoordenadorEntity`
- Value Objects: `PeriodoEvento`, `CodigoCertificado`

### `src/application`
Casos de uso e orquestração: `CatalogoAcademicoService`

### `src/infrastructure`
Repositories JPA e script SQL do banco de dados

### `src/presentation`
Controllers REST, DTOs e configuração CORS

## 🚢 Deploy

- **Frontend:** Vercel — `https://cursos-amry.vercel.app`
- **Backend:** Render via Docker
- **Bando de dados** supabase
  
## 👥 Integrantes

| Nome | GitHub |
|---|---|
| Arthur Barbosa | Arthurz11 |
| Kevin Anderson | KevinAFS |
| Guilherme Araujo | Guilhermegg-06 |
| Luis Henrique | luishenrique493 |
| Gabriel Tupinambá de Carvalho | Gabrieltupi19072008 |

---

Disciplina: Projeto de Programação
