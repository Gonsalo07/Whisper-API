-- =========================================
-- BASE DE DATOS WHISPER
-- Versión actualizada con campo estado
-- =========================================

DROP DATABASE IF EXISTS Whisper;
CREATE DATABASE Whisper
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE Whisper;

-- =========================================
-- 1. USUARIOS
-- =========================================
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'USUARIO',
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    CONSTRAINT chk_rol CHECK (rol IN ('USUARIO', 'ADMINISTRADOR'))
) ENGINE=InnoDB;

-- =========================================
-- 2. ALIAS PÚBLICOS
-- =========================================
CREATE TABLE alias_publicos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    alias VARCHAR(50) NOT NULL UNIQUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alias_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- 3. CATEGORÍAS
-- =========================================
CREATE TABLE categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
) ENGINE=InnoDB;

-- =========================================
-- 4. DENUNCIAS
-- =========================================
CREATE TABLE denuncias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    alias_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion TEXT NULL,
    estado VARCHAR(20) DEFAULT 'EN_EVALUACION',
    creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_denuncia_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_denuncia_alias
        FOREIGN KEY (alias_id) REFERENCES alias_publicos(id),
    CONSTRAINT fk_denuncia_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB;

-- =========================================
-- 5. EVIDENCIAS
-- =========================================
CREATE TABLE evidencias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    denuncia_id BIGINT NOT NULL,
    url TEXT NOT NULL,
    tipo VARCHAR(20),
    creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidencia_denuncia
        FOREIGN KEY (denuncia_id) REFERENCES denuncias(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- 6. VOTOS DE DENUNCIAS
-- =========================================
CREATE TABLE votos_denuncia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    denuncia_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    voto TINYINT NOT NULL,
    -- 1 = CONSISTENTE, 0 = EN_EVALUACION, -1 = CUESTIONADA
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_voto_denuncia
        FOREIGN KEY (denuncia_id) REFERENCES denuncias(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_voto_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT unico_voto UNIQUE (denuncia_id, usuario_id)
) ENGINE=InnoDB;

-- =========================================
-- 7. COMENTARIOS (con estado)
-- =========================================
CREATE TABLE comentarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    denuncia_id BIGINT NOT NULL,
    alias_id BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'VISIBLE',   -- ← nuevo
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentario_denuncia
        FOREIGN KEY (denuncia_id) REFERENCES denuncias(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_comentario_alias
        FOREIGN KEY (alias_id) REFERENCES alias_publicos(id)
) ENGINE=InnoDB;

-- =========================================
-- 8. REPORTES DE FALSEDAD (con estado)
-- =========================================
CREATE TABLE reportes_falsedad (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    denuncia_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'VISIBLE',   -- ← nuevo
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_falsedad_denuncia
        FOREIGN KEY (denuncia_id) REFERENCES denuncias(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_falsedad_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- =========================================
-- 9. EVIDENCIAS DE FALSEDAD (con estado)
-- =========================================
CREATE TABLE evidencias_falsedad (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id BIGINT NOT NULL,
    url TEXT NOT NULL,
    tipo VARCHAR(20),
    estado VARCHAR(20) DEFAULT 'VISIBLE',   -- ← nuevo
    creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidencia_reporte
        FOREIGN KEY (reporte_id) REFERENCES reportes_falsedad(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;