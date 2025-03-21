import os from 'node:os'

let odbc
if (os.platform() === 'win32') {
  odbc = await import('odbc')
}

  const query = `SELECT TOP 10 ref_num AS Num_Incidencia, open_date AS FechaApertura, summary AS Resumen FROM call_req ORDER BY open_date DESC;`

  const getIncidents = `SELECT inc.ref_num AS Num_Incidencia, est.sym AS Estado, inc.open_date AS FechaApertura, inc.close_date AS FechaCierre, [ca_contact].[middle_name] & " " & [ca_contact].[last_name] & " " & [ca_contact].[first_name] AS Usuario, ca_contact.pri_phone_number AS Extension, inc.summary AS Resumen, grp.last_name AS Grupo, [con].[middle_name] & " " & [con].[last_name] & " " & [con].[first_name] AS Tecnico_Asignado, prob.sym AS Tipo_Inc, prob.description AS Descripcion_Tipo INTO EMT_Incidencias
FROM ((((((call_req AS inc LEFT JOIN ca_contact AS grp ON inc.group_id = grp.contact_uuid) LEFT JOIN ca_contact AS con ON inc.assignee = con.contact_uuid) LEFT JOIN prob_ctg AS prob ON inc.category = prob.persid) LEFT JOIN cr_stat AS est ON inc.status = est.code) LEFT JOIN ca_contact ON inc.customer = ca_contact.contact_uuid) LEFT JOIN ca_resource_cost_center ON ca_contact.cost_center = ca_resource_cost_center.id) LEFT JOIN EMT_Origen ON inc.severity = EMT_Origen.Origen
WHERE inc.open_date >= 1704067200
  AND inc.open_date <= 1767221999
ORDER BY inc.ref_num, grp.last_name;`

const query1 = `SELECT TOP 10 inc.ref_num, est.sym, inc.open_date
FROM call_req AS inc
LEFT JOIN cr_stat AS est ON inc.status = est.code;
`

const query2 = `SELECT TABLE_SCHEMA, TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'EMT_Origen';
`

const allTables = `SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES;
`

const query3 = `SELECT
    inc.ref_num AS Num_Incidencia,
    est.sym AS Estado,
    inc.open_date AS FechaApertura,
    inc.close_date AS FechaCierre,
    [ca_contact].[middle_name] + ' ' + [ca_contact].[last_name] + ' ' + [ca_contact].[first_name] AS Usuario,
    ca_contact.pri_phone_number AS Extension,
    inc.summary AS Resumen,
    grp.last_name AS Grupo,
    [con].[middle_name] + ' ' + [con].[last_name] + ' ' + [con].[first_name] AS Tecnico_Asignado,
    prob.sym AS Tipo_Inc,
    prob.description AS Descripcion_Tipo
FROM ((((call_req AS inc
    LEFT JOIN ca_contact AS grp ON inc.group_id = grp.contact_uuid)
    LEFT JOIN ca_contact AS con ON inc.assignee = con.contact_uuid)
    LEFT JOIN prob_ctg AS prob ON inc.category = prob.persid)
    LEFT JOIN cr_stat AS est ON inc.status = est.code)
    LEFT JOIN ca_contact ON inc.customer = ca_contact.contact_uuid
    LEFT JOIN ca_resource_cost_center ON ca_contact.cost_center = ca_resource_cost_center.id
WHERE inc.open_date >= 1704067200
  AND inc.open_date <= 1767221999
ORDER BY inc.ref_num, grp.last_name;`

export async function getServideskData() {
  if (os.platform() !== 'win32') {
    return []
  }

  try {
    const connection = await odbc.connect("DSN=CA_SERVICEDESK;UID=SA;PWD=Cartago01");
    const result = await connection.query(query3);
    await connection.close();
    return result;
  } catch (err) {
    console.error("Error en la consulta ODBC:", err);
    throw err;
  }
}

  // ejecutarConsultaODBC(query3)
  // .then((data) => console.log(data))
  // .catch((err) => console.error(err));
