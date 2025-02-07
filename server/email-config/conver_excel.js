import ExcelJS from 'exceljs';

export const convertJsonToExcel = async (jsonData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  const headers = Object.keys(jsonData[0]);
  worksheet.columns = headers.map(header => ({ header, key: header }));

  jsonData.forEach(data => {
    worksheet.addRow(data);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  console.log('Excel file created successfully as Buffer');
  return buffer;
};

// // Ejemplo de uso
// const exampleJson = [
//   { id: 1, name: 'John Doe', age: 30 },
//   { id: 2, name: 'Jane Doe', age: 25 },
// ];

// convertJsonToExcel(exampleJson).then(buffer => {
//   // Aquí puedes usar el buffer para enviar el archivo por correo
//   console.log('Buffer length:', buffer.length);
// });
