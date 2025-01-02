const QUERIES = {
  // Consultas para obtener incidentes por rango de fechas
  allIncidents: 'SELECT * FROM tincidencia LIMIT 100',
  totalIncidents: `SELECT * FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY)`,
  openIncidents: `SELECT COUNT(*) AS count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY)`,
  closeIncidents: `SELECT COUNT(*) AS count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND cierre > '0001-01-01'`,
  pendingIncidents: `SELECT COUNT(*) AS count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND cierre < '0001-01-01'`,
  //   avgIncidents: `
  //      SELECT
  //       FLOOR(media_horas) AS horas,
  //       ROUND((media_horas - FLOOR(media_horas)) * 60) AS minutos
  //       FROM (
  //       SELECT
  //       AVG(TIMESTAMPDIFF(HOUR, inicio, cierre)) AS media_horas
  //       FROM tincidencia
  //       WHERE cierre > '0001-01-01' AND inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY)
  //       ) AS subquery`,

  avgIncidents: `SELECT AVG(TIMESTAMPDIFF(MINUTE, inicio, cierre)) AS minutos
            FROM tincidencia WHERE cierre IS NOT NULL AND cierre > '0001-01-01' AND inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY);`,

  // Consultas para obtener incidentes por año
  allIncidentsYearOpen: `
      SELECT DATE(inicio) as date, COUNT(*) as count
      FROM tincidencia
      WHERE YEAR(inicio) = ?
      GROUP BY DATE(inicio);
    `,
  allIncidentsYearClose: `
      SELECT DATE(cierre) as date, COUNT(*) as count
      FROM tincidencia
      WHERE YEAR(cierre) = ?
      GROUP BY DATE(cierre);
    `,

  // Incidencias abiertas por id_grupo 2=operadores, 7=tecnicos, 8=administradores, 148=ciberseguridad
  openIncidentsGr: `SELECT id_incidencia, inicio, id_grupo FROM tincidencia WHERE cierre < "0001-01-01" AND id_grupo IN (2, 7, 8, 148) AND estado <> 7;`,
  // openIncidentsGr: `SELECT id_incidencia, inicio, id_grupo FROM tincidencia WHERE (cierre IS NULL OR cierre < '0001-01-01 00:00:00') AND id_grupo IN (2, 7, 8, 148);`,

  // Todas incidencias por rango de fechas y grupos, abiertas
  allIncOpenOperadores: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND id_grupo = 2;`,
  allIncOpenTecnicos: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND id_grupo = 7;`,
  allIncOpenAdministradores: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND id_grupo = 8;`,
  allIncOpenCiberseguridad: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND id_grupo = 148;`,
  allIncOpenHorizontales: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND id_grupo IN (19,84,86,87,122,126,149,141,21);`,
  allIncOpenNegocio: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND id_grupo IN (85,20,23,40,90,91,101,43,147);`,
  allIncOpenExterno: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND id_grupo IN (22,24,28,31,56,154,50,52,59,32);`,
  // Todas incidencias por rango de fechas y grupos, cerradas
  allIncCloseOperadores: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND cierre > '0001-01-01' AND id_grupo = 2;`,
  allIncCloseTecnicos: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND cierre > '0001-01-01' AND id_grupo = 7;`,
  allIncCloseAdministradores: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND cierre > '0001-01-01' AND id_grupo = 8;`,
  allIncCloseCiberseguridad: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND cierre > '0001-01-01' AND id_grupo = 148;`,
  allIncCloseHorizontales: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND cierre > '0001-01-01' AND id_grupo IN (19,84,86,87,122,126,149,141,21);`,
  allIncCloseNegocio: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND cierre > '0001-01-01' AND id_grupo IN (85,20,23,40,90,91,101,43,147);`,
  allIncCloseExterno: `SELECT COUNT(*) as count FROM tincidencia WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY) AND cierre > '0001-01-01' AND id_grupo IN (22,24,28,31,56,154,50,52,59,32);`,

  // Total de incidencias por rango de fechas y su localización
  allIncLocationRange: `SELECT
    SUM(CASE WHEN R.data IN ('PACIFICO', 'CERRO PLATA') THEN 1 ELSE 0 END) AS pacifico,
    SUM(CASE WHEN R.data = 'FUENCARRAL' THEN 1 ELSE 0 END) AS fuencarral,
    SUM(CASE WHEN R.data = 'LA ELIPA' THEN 1 ELSE 0 END) AS la_elipa,
    SUM(CASE WHEN R.data = 'CARABANCHEL' THEN 1 ELSE 0 END) AS carabanchel,
    SUM(CASE WHEN R.data = 'ENTREVIAS' THEN 1 ELSE 0 END) AS entrevias,
    SUM(CASE WHEN R.data = 'SANCHINARRO' THEN 1 ELSE 0 END) AS sanchinarro
FROM tincident_field_data R
INNER JOIN tincidencia I
    ON R.id_incident = I.id_incidencia
    AND R.id_incident_field IN (98, 103, 109, 114)
WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY);`,


//   allIncLocationRange: `SELECT count(*) as total FROM tincident_field_data R
// INNER JOIN
//     tincidencia I
//     ON R.id_incident = I.id_incidencia
//     AND R.id_incident_field IN (98, 103, 109, 114)
// WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY)
//         AND R.data IN(?);`,


//   allIncLocationRange: `SELECT count(*) as total FROM tincident_field_data R
// LEFT JOIN
//     tincidencia I
//     ON R.id_incident = I.id_incidencia
//     AND R.id_incident_field IN (98, 103, 109, 114)
// LEFT JOIN
//     tincident_status S
//     ON I.estado = S.id
// LEFT JOIN
//     tusuario U
//     ON I.id_creator = U.id_usuario
// LEFT JOIN
//     tusuario E
//     ON I.id_usuario = E.id_usuario
// LEFT JOIN
//     tgrupo G
//     ON I.id_grupo = G.id_grupo
// LEFT JOIN
//     tincident_type T
//     ON I.id_incident_type = T.id
// WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY)
//        AND R.data IN(?);`,

//   allIncBasesRange: `SELECT count(*) as total FROM tincident_field_data R
// LEFT JOIN
//     tincidencia I
//     ON R.id_incident = I.id_incidencia
//     AND R.id_incident_field IN (98, 103, 109, 114)
// WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY)
//         AND R.data LIKE ? AND R.data LIKE ?;`,

// allIncBasesRange: `SELECT COUNT(*) AS total
// FROM (
//     SELECT R.id_incident
//     FROM tincident_field_data R
//     WHERE R.id_incident_field IN (98, 103, 109, 114)
//       AND R.data LIKE ?
//       AND R.data LIKE ?
// ) AS FilteredData
// INNER JOIN tincidencia I
//     ON FilteredData.id_incident = I.id_incidencia
// WHERE I.inicio >= ?
//   AND I.inicio < DATE_ADD(?, INTERVAL 1 DAY);`,


  allIncBasesRange: `SELECT
    SUM(CASE
        WHEN R.data LIKE '%Colon%' AND R.data LIKE '%%' THEN 1
        ELSE 0
    END) AS Colon,
    SUM(CASE
        WHEN R.data LIKE '%Escuadron%' AND R.data LIKE '%%' THEN 1
        ELSE 0
    END) AS Escuadron,
    SUM(CASE
        WHEN R.data LIKE '%Mediodia%' AND R.data LIKE '%2%' THEN 1
        ELSE 0
    END) AS Mediodia2,
    SUM(CASE
        WHEN R.data LIKE '%Mediodia%' AND R.data LIKE '%3%' THEN 1
        ELSE 0
    END) AS Mediodia3,
    SUM(CASE
        WHEN R.data LIKE '%Ntra%' AND R.data LIKE '%Recuerdo%' THEN 1
        ELSE 0
    END) AS Recuerdo,
    SUM(CASE
        WHEN R.data LIKE '%Imperial%' AND R.data LIKE '%%' THEN 1
        ELSE 0
    END) AS Imperial,
    SUM(CASE
        WHEN R.data LIKE '%Vicalvaro%' AND R.data LIKE '%%' THEN 1
        ELSE 0
    END) AS Vicalvaro
FROM tincident_field_data R
INNER JOIN tincidencia I ON R.id_incident = I.id_incidencia
WHERE inicio >= ? AND inicio < DATE_ADD(?, INTERVAL 1 DAY);
`,



}

export default QUERIES
