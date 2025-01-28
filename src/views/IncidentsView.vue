<template>
 <section class="main-container container-report">

  <section class="section-search">
    <button @click="search">Search</button>
   <div class="chart-base container-incidents">
        {{ incidents }}
   </div>

   <button @click="transform">Transform</button>
      <p> {{ conversion }} </p>
  </section>

  <button @click="send">Send</button>

 </section>
</template>

<script setup>
import IncidentsApi from '@/api/incidents_api'
import { onMounted, ref } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'
import { json2csv } from 'json-2-csv';

import nodemailer from 'nodemailer';
// import fs from 'fs/promises';


const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com', // Cambia según tu proveedor de correo
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: 'JuanJose.Romero@emtmadrid.es', // Tu correo empresarial
    pass: '8492@Dmr-Jr%69'          // Contraseña del correo (o token de aplicación)
  }
});
try {
  await transporter.verify();
  console.log('Servidor SMTP conectado correctamente');
} catch (error) {
  console.error('Error al conectar con el servidor SMTP:', error);
}


const incidents = ref([])
const conversion = ref(false)
const authStore = useAuthenticationStore()
let token = null

onMounted(async () => {
  try {
    token = authStore.isAuthenticated
    if (!token) {
      console.log('!!!Error in token....')
    }
  } catch (error) {
    console.error('Error fetching incidents:', error)
  }
})

const search = async () => {
  incidents.value = await IncidentsApi.getIncidents(token)
}

const transform = async () => {
  const campos = ['id_incidencia', 'inicio', 'id_creador']; // Campos que quieres incluir en el CSV
const opciones = { campos };

try {
  const csv = await json2csv(incidents.value, opciones);
  console.log(csv);
} catch (err) {
  console.error(err);
}
}

const send = async () => {
  try {
    // Lee el archivo CSV (asegúrate de que exista en la ruta indicada)
    // const csvPath = './archivo.csv';
    // const csvContent = await fs.readFile(csvPath);

    // Configuración del correo
    const mailOptions = {
      from: '"Tu Empresa" JuanJose.Romero@emtmadrid.es',
      to: 'juanjor99@gmail.com',
      subject: 'Reporte CSV adjunto',
      text: 'Por favor, encuentra el reporte adjunto en formato CSV.',
      attachments: [
        {
          filename: 'reporte.csv',
          // content: csvContent
        }
      ]
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado correctamente:', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}
</script>

<style lang="css" scoped>
.container-report {
  margin-top: 15px;
  border-radius: 15px;
  padding: 10px 15px;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: 200px;
  gap: 10px;
}

.section-search {
  grid-column: 1 / -1;
}

.section-search > button {
  grid-row: 1 / 2;
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 5px 15px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
}

.section-search > button:hover {
  background-color: var(--hover-button);
}

.chart-base {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}

.container-incidents {
  height: 100%;
}


</style>
