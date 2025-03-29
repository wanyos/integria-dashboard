-- server/db/seeders/datos-test.sql
USE integria_backup;

INSERT INTO
    tincidencia (inicio, descripcion, estado)
VALUES (
        '2024-01-15',
        'Error en sistema de reportes',
        'cerrada'
    ),
    (
        '2024-02-01',
        'Problema de conexión a base de datos',
        'en_progreso'
    ),
    (
        '2024-03-10',
        'Actualización requerida en panel de control',
        'abierta'
    ),
    (
        '2023-12-05',
        'Fallo en autenticación de usuarios',
        'cerrada'
    ),
    (
        '2024-04-20',
        'Optimización de consultas SQL',
        'abierta'
    );