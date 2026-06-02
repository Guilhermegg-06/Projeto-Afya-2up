-- Schema: Plataforma de Gestão de Eventos Acadêmicos
-- Tema 6 | Java + MySQL

CREATE TABLE coordenadores (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    instituicao VARCHAR(200)
);

CREATE TABLE participantes (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    cpf         CHAR(11)     NOT NULL UNIQUE
);

CREATE TABLE eventos (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    coordenador_id  INT          NOT NULL,
    titulo          VARCHAR(300) NOT NULL,
    local           VARCHAR(300) NOT NULL,
    data_inicio     DATE         NOT NULL,
    data_fim        DATE         NOT NULL,
    status          ENUM('RASCUNHO','PUBLICADO','ENCERRADO','CANCELADO') NOT NULL DEFAULT 'RASCUNHO',
    FOREIGN KEY (coordenador_id) REFERENCES coordenadores(id)
);

CREATE TABLE atividades (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    evento_id       INT          NOT NULL,
    titulo          VARCHAR(300) NOT NULL,
    tipo            ENUM('PALESTRA','MINICURSO','WORKSHOP') NOT NULL,
    sala            VARCHAR(100),
    inicio          DATETIME     NOT NULL,
    fim             DATETIME     NOT NULL,
    vagas_total     SMALLINT     NOT NULL,
    vagas_ocupadas  SMALLINT     NOT NULL DEFAULT 0,
    carga_horaria_h DECIMAL(4,1) NOT NULL,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE inscricoes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    participante_id INT NOT NULL,
    atividade_id    INT NOT NULL,
    status          ENUM('CONFIRMADA','CANCELADA','LISTA_ESPERA') NOT NULL DEFAULT 'CONFIRMADA',
    inscrito_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (participante_id, atividade_id),
    FOREIGN KEY (participante_id) REFERENCES participantes(id),
    FOREIGN KEY (atividade_id)    REFERENCES atividades(id)
);

CREATE TABLE presencas (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    inscricao_id INT NOT NULL UNIQUE,
    registrado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id)
);

CREATE TABLE certificados (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    participante_id  INT          NOT NULL,
    atividade_id     INT          NOT NULL,
    codigo_validacao VARCHAR(20)  NOT NULL UNIQUE,
    carga_horaria_h  DECIMAL(4,1) NOT NULL,
    emitido_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (participante_id, atividade_id),
    FOREIGN KEY (participante_id) REFERENCES participantes(id),
    FOREIGN KEY (atividade_id)    REFERENCES atividades(id)
);

-- Dados de exemplo
INSERT INTO coordenadores (nome, email, instituicao) VALUES
('Ana Lima', 'ana.lima@universidade.edu.br', 'Universidade Federal');

INSERT INTO participantes (nome, email, cpf) VALUES
('Carlos Silva',  'carlos@email.com',  '12345678901'),
('Beatriz Souza', 'beatriz@email.com', '98765432100');

INSERT INTO eventos (coordenador_id, titulo, local, data_inicio, data_fim, status) VALUES
(1, 'Semana Acadêmica de Computação 2025', 'Campus Central - Bloco A', '2025-10-20', '2025-10-24', 'PUBLICADO');

INSERT INTO atividades (evento_id, titulo, tipo, sala, inicio, fim, vagas_total, carga_horaria_h) VALUES
(1, 'Introdução ao DDD com Java', 'MINICURSO', 'Sala 101',       '2025-10-21 08:00:00', '2025-10-21 12:00:00', 30,  4.0),
(1, 'Keynote: O Futuro da IA',   'PALESTRA',  'Auditório Principal', '2025-10-22 19:00:00', '2025-10-22 20:30:00', 200, 1.5);
