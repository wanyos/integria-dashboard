import { convertJsonToExcel } from './convert_excel.js';
import dayjs from 'dayjs';
import isBetween from './plugins/isBetween.js';
import isSameOnBefore from './plugins/isSameOnBefore.js';

dayjs.extend(isBetween);
dayjs.extend(isSameOnBefore);

const data = {
    iss_fuencarral: 'NIVEL 0 IISS FUENCARRAL',
    iss_carabanchel: 'NIVEL 0 IISS CARABANCHEL',
    iss_movilidad: 'NIVEL 0 IISS Bases Y Aparcamientos',
    iss_la_elipa: 'NIVEL 0 IISS LA ELIPA',
    iss_entrevias: 'NIVEL 0 IISS ENTREVIAS',
    iss_pacifico: 'NIVEL 0 IISS',
    iss_sanchinarro: 'NIVEL 0 IISS SANCHINARRO'
}

// Num_Incidencia	Estado	FechaApertura	FechaCierre	Usuario	Extension	Resumen	Grupo	Tecnico_Asignado	Tipo_Inc	Descripcion_Tipo
const orderServidesk = [
    'Num_Incidencia',
    'Estado',
    'FechaApertura',
    'FechaCierre',
    'Usuario',
    'Extension',
    'Resumen',
    'Grupo',
    'Tecnico_Asignado',
    'Descripcion_Tipo',
    'Tipo_Inc',
  ];

  // Num_Incidencia Estado FechaApertura FechaCierre Usuario Extension Resumen
  // Grupo Tecnico_Asignado Descripcion_Tipo Ultima_actuacion Hora_creacion Localizacion Origen
  const orderIntegria = [
      'Num_Incidencia',
      'Estado',
      'FechaApertura',
      'FechaCierre',
      'Usuario',
      'Extension',
      'Resumen',
      'Grupo',
      'Tecnico_Asignado',
      'Descripcion_Tipo',
      'Ultima_actuacion',
      'Localizacion',
    ];

export const createFileIss = async (servideskInc, openDate, closeDate) => {
    const result = [];

    Object.keys(data).forEach(key => {
        const incidents = servideskInc[key];
        if (incidents) {

            const keyObject = {
                tratadas: [],
                cerradas: [],
                pendientes: []
            };

            incidents.forEach(incident => {
                const fechaApertura = dayjs(incident.FechaApertura, 'DD/MM/YYYY');
                const fechaCierre = dayjs(incident.FechaCierre, 'DD/MM/YYYY');

                if (fechaApertura.isBetween(openDate, closeDate, null, '[]') && (incident.Estado === 'Abierta' || incident.Estado === 'Cerrada' || incident.Estado === 'Fijada')) {
                    keyObject.tratadas.push(incident);
                }

                if (fechaCierre.isBetween(openDate, closeDate, null, '[]') && incident.Estado === 'Cerrada') {
                    keyObject.tratadas.push(incident);
                    keyObject.cerradas.push(incident);
                }

                if (fechaApertura.isSameOrBefore(openDate) && (incident.Estado === 'Abierta' || incident.Estado === 'Fijada' || incident.Estado === 'Resolutor Externo')) {
                    keyObject.pendientes.push(incident);
                }
            });

             result.push({ [key]: keyObject });
        }
    });

     const startDate = openDate.format('DD/MM/YYYY');
     const endDate =  closeDate.format('DD/MM/YYYY');
     const filesIss = [];
     for (const jsondata of result) {
        const filePath = await convertJsonToExcel(jsondata, orderServidesk, startDate, endDate);
        filesIss.push({
          name: filePath.name,
          content: filePath.content,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
      }

    //   console.log('Archivos generados:', filesIss.map(f => ({
    //     name: f.name,
    //     type: f.type,
    //     contentType: f.content instanceof Uint8Array
    // })));

    return filesIss;
}

export const createFileIntegria = async (integriaInc, openDate, closeDate) => {
    const result = []
    Object.keys(integriaInc).forEach((item) => {
        const incidents = integriaInc[item]

        const keyObject = {
            tratadas: [],
            cerradas: [],
            pendientes: []
        };

        incidents.forEach((inc) => {
            const fechaApertura = dayjs(inc.FechaApertura, 'D/M/YYYY');
            const fechaCierre = dayjs(inc.FechaCierre, 'D/M/YYYY');

            if (fechaApertura.isBetween(openDate, closeDate, null, '[]') && (inc.Estado === 'Nuevo' || inc.Estado === 'Cerrada' || inc.Estado === 'ASignado')) {
                keyObject.tratadas.push(inc);
            }

            if (fechaCierre.isBetween(openDate, closeDate, null, '[]') && inc.Estado === 'Cerrada') {
                keyObject.tratadas.push(inc);
                keyObject.cerradas.push(inc);
            }

            if (fechaApertura.isSameOrBefore(openDate) && (inc.Estado === 'Nuevo' || inc.Estado === 'Asignado')) {
                keyObject.pendientes.push(inc);
            }
        });
        result.push({ [item]: keyObject });

    })

    const startDate = openDate.format('DD/MM/YYYY');
    const endDate =  closeDate.format('DD/MM/YYYY');
    const filesIntegria = []
    for (const jsondata of result) {
        const file = await convertJsonToExcel(jsondata, orderIntegria, startDate, endDate);
        filesIntegria.push({
          name: file.name,
          content: file.content,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
    }
    return filesIntegria;
}
