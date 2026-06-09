-- Schema: Plataforma de Gestao de Eventos Academicos e Certificados
-- PostgreSQL

CREATE TABLE IF NOT EXISTS coordenadores (
    id           SERIAL PRIMARY KEY,
    nome         VARCHAR(150) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    instituicao  VARCHAR(200),
    senha_hash   VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS participantes (
    id     SERIAL PRIMARY KEY,
    nome   VARCHAR(150) NOT NULL,
    email  VARCHAR(255) NOT NULL UNIQUE,
    cpf    CHAR(11) NOT NULL UNIQUE,
    senha_hash VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS eventos (
    id              SERIAL PRIMARY KEY,
    coordenador_id  INT NOT NULL DEFAULT 1,
    titulo          VARCHAR(300) NOT NULL,
    descricao       VARCHAR(2000),
    local           VARCHAR(300) NOT NULL,
    data_inicio     DATE NOT NULL,
    data_fim        DATE NOT NULL,
    capacidade      INT NOT NULL DEFAULT 0,
    status          VARCHAR(40) NOT NULL DEFAULT 'Inscricoes abertas',
    FOREIGN KEY (coordenador_id) REFERENCES coordenadores(id)
);

CREATE TABLE IF NOT EXISTS evento_etiquetas (
    evento_id INT NOT NULL,
    etiqueta  VARCHAR(80),
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS atividades (
    id               SERIAL PRIMARY KEY,
    evento_id        INT NOT NULL,
    titulo           VARCHAR(300) NOT NULL,
    descricao        VARCHAR(2000),
    palestrante      VARCHAR(150),
    tipo             VARCHAR(40) NOT NULL DEFAULT 'Atividade',
    sala             VARCHAR(100),
    horario          VARCHAR(80),
    inicio           TIMESTAMP NOT NULL,
    fim              TIMESTAMP NOT NULL,
    vagas_total      INT NOT NULL,
    vagas_ocupadas   INT NOT NULL DEFAULT 0,
    carga_horaria_h  NUMERIC(4,1) NOT NULL DEFAULT 1.0,
    versao           BIGINT,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inscricoes (
    id              SERIAL PRIMARY KEY,
    participante_id INT NOT NULL,
    atividade_id    INT NOT NULL,
    status          VARCHAR(30) NOT NULL DEFAULT 'Inscrito',
    presenca        VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    inscrito_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (participante_id, atividade_id),
    FOREIGN KEY (participante_id) REFERENCES participantes(id),
    FOREIGN KEY (atividade_id) REFERENCES atividades(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS presencas (
    id             SERIAL PRIMARY KEY,
    inscricao_id   INT NOT NULL UNIQUE,
    presente       BOOLEAN NOT NULL DEFAULT TRUE,
    registrado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certificados (
    id                SERIAL PRIMARY KEY,
    participante_id   INT NOT NULL,
    atividade_id      INT NOT NULL,
    codigo_validacao  VARCHAR(40) NOT NULL UNIQUE,
    validado          BOOLEAN NOT NULL DEFAULT TRUE,
    carga_horaria_h   NUMERIC(4,1) NOT NULL DEFAULT 1.0,
    emitido_em        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (participante_id, atividade_id),
    FOREIGN KEY (participante_id) REFERENCES participantes(id),
    FOREIGN KEY (atividade_id) REFERENCES atividades(id) ON DELETE CASCADE
);

ALTER TABLE IF EXISTS eventos DROP CONSTRAINT IF EXISTS eventos_status_check;
ALTER TABLE IF EXISTS atividades DROP CONSTRAINT IF EXISTS atividades_tipo_check;
ALTER TABLE IF EXISTS inscricoes DROP CONSTRAINT IF EXISTS inscricoes_status_check;

ALTER TABLE IF EXISTS coordenadores ADD COLUMN IF NOT EXISTS senha_hash VARCHAR(64);
ALTER TABLE IF EXISTS participantes ADD COLUMN IF NOT EXISTS senha_hash VARCHAR(64);
