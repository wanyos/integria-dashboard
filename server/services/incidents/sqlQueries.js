const QUERIES = {
  // Consultas para obtener incidentes por rango de fechas
  allIncidents: 'SELECT * FROM tincidencia LIMIT 100',
  totalIncidents: 'SELECT * FROM tincidencia WHERE inicio BETWEEN ? AND ?',
  openIncidents: 'SELECT COUNT(*) AS count FROM tincidencia WHERE inicio BETWEEN ? AND ?',
  closeIncidents:
    'SELECT COUNT(*) AS count FROM tincidencia WHERE inicio BETWEEN ? AND ? AND cierre > "0001-01-01"',
  pendingIncidents:
    'SELECT COUNT(*) AS count FROM tincidencia WHERE inicio BETWEEN ? AND ? AND cierre < "0001-01-01"',
  avgIncidents: `
      SELECT
        FLOOR(media_horas) AS horas,
        ROUND((media_horas - FLOOR(media_horas)) * 60) AS minutos
      FROM (
        SELECT
          AVG(TIMESTAMPDIFF(HOUR, inicio, cierre)) AS media_horas
        FROM tincidencia
        WHERE cierre > '0001-01-01' AND inicio BETWEEN ? AND ?
      ) AS subquery;
    `,
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
}

export default QUERIES
