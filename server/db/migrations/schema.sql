-- server/db/migrations/structure-integria.sql
CREATE DATABASE IF NOT EXISTS integria_backup;

USE integria_backup;

CREATE TABLE IF NOT EXISTS tincidencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inicio DATE NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estado ENUM(
        'abierta',
        'en_progreso',
        'cerrada'
    ) DEFAULT 'abierta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Índice para búsquedas por fecha
CREATE INDEX idx_inicio ON tincidencia (inicio);