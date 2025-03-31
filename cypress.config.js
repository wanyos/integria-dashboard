// import { defineConfig } from 'cypress'
// import { execSync, spawn } from 'child_process'

// const formatTime = (ms) => {
//   const totalSeconds = Math.floor(ms / 1000);
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
//   return `${minutes}m ${seconds}s`;
// };

// let backendProcess;
// let frontendProcess;
// let serversStarted = false;

// export default defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       process.env.NODE_ENV = 'test';
//       console.log(`NODE_ENV = ${process.env.NODE_ENV}`)

//       on('before:run', async () => {
//         if (serversStarted) {
//           console.log('⚠️ Servers are already running...');
//           return;
//         }
//         console.log('🟢 Starting servers...');
//         backendProcess = spawn('npm', ['run', 'serve:express'], { stdio: 'inherit', shell: true });
//         frontendProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

//         serversStarted = true;
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         console.log('✅ Servers started');
//       });

//       on('after:run', (results) => {
//         try {
//           if (results) {
//             const formattedDuration = formatTime(results.totalDuration);
//             console.log('Total duration: ', formattedDuration);
//             console.log('Total suites: ', results.totalSuites);
//             console.log('Total tests: ', results.totalTests);
//             console.log('');
//             console.log('Passed: ', results.totalPassed);
//             console.log('Failed: ', results.totalFailed);
//             console.log('Pending: ', results.totalPending);
//           }
//         } catch (error) {
//           console.error(`Error close the servers: ${error.message}`);
//         } finally {
//           try {
//             // execSync('lsof -ti :8022 | xargs kill', { stdio: 'ignore' });
//             // execSync('lsof -ti :8124 | xargs kill', { stdio: 'ignore' });
//             if (backendProcess) backendProcess.kill('SIGTERM');
//             if (frontendProcess) frontendProcess.kill('SIGTERM');
//             // backendProcess.kill();
//             // frontendProcess.kill();
//             console.log('🛑 Servers stopped');
//           } catch (execError) {
//             console.error(`Error closing the server: ${execError.message}`);
//           }
//         }
//       })
//     },
//   },
//   viewportWidth: 1440,
//   viewportHeight: 1200,
//   video: false,
//   reporter: 'dot'
// })

import { defineConfig } from 'cypress'
import { execSync, spawn } from 'child_process'
import { platform } from 'os'

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

let backendProcess;
let frontendProcess;
let serversStarted = false;

const isWindows = platform() === 'win32';

const killProcessOnPort = (port) => {
  try {
    if (isWindows) {
      // Comando para Windows
      execSync(`FOR /F "tokens=5" %p IN ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') DO taskkill /F /PID %p`, { shell: true, stdio: 'ignore' });
    } else {
      // Comando para macOS/Linux
      execSync(`lsof -ti :${port} | xargs kill -9`, { stdio: 'ignore' });
    }
    console.log(`🛑 Killed process on port ${port}`);
  } catch (error) {
    console.log(`No process found on port ${port} or error killing it`);
  }
};

const VITE_PORT = 5173;
const EXPRESS_PORT = 8022;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      process.env.NODE_ENV = 'test';
      console.log(`NODE_ENV = ${process.env.NODE_ENV}`);

      on('before:run', async () => {
        // if (serversStarted) {
        //   console.log('⚠️ Servers are already running...');
        //   return;
        // }
        killProcessOnPort(VITE_PORT);
        killProcessOnPort(EXPRESS_PORT);

        // Configuración para capturar la salida y mostrarla en nuestra consola
        const spawnOptions = {
          stdio: ['ignore', 'pipe', 'pipe'], // Capturar stdout y stderr
          shell: true,
          windowsHide: true // Ocultar ventanas en Windows
        };

        backendProcess = spawn('npm', ['run', 'serve:express'], spawnOptions);
        frontendProcess = spawn('npm', ['run', 'dev'], spawnOptions);

        backendProcess.stdout.on('data', (data) => {
          const output = data.toString().trim();
          if (output.includes('listening') || output.includes('port 8022')) {
            console.log('✅ Express server running on port 8022');
          }
        });

        backendProcess.stderr.on('data', (data) => {
          console.error(`[Express Error] ${data.toString().trim()}`);
        });

        frontendProcess.stdout.on('data', (data) => {
          const output = data.toString().trim();
          if (output.includes('Local:') || output.includes('port 5173')) {
            console.log('✅ Vite server running on port 5173');
          }
        });

        frontendProcess.stderr.on('data', (data) => {
          console.error(`[Vite Error] ${data.toString().trim()}`);
        });

        serversStarted = true;

        await new Promise((resolve) => {
          let viteReady = false;
          let expressReady = false;

          const checkReady = () => {
            if (viteReady && expressReady) {
              resolve();
            }
          };

          //  Función para comprobar si los puertos están abiertos
          const checkPort = (port, name, timeout = 10000) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
              try {
                // Intentar conectar al puerto
                if (isWindows) {
                  const result = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { encoding: 'utf-8' });
                  if (result) {
                    clearInterval(interval);
                    console.log(`✅ Confirmed ${name} server is running on port ${port}`);
                    if (name === 'Vite') viteReady = true;
                    if (name === 'Express') expressReady = true;
                    checkReady();
                  }
                } else {
                  const result = execSync(`lsof -i :${port} | grep LISTEN`, { encoding: 'utf-8' });
                  if (result) {
                    clearInterval(interval);
                    console.log(`✅ Confirmed ${name} server is running on port ${port}`);
                    if (name === 'Vite') viteReady = true;
                    if (name === 'Express') expressReady = true;
                    checkReady();
                  }
                }
              } catch (e) {
                // Puerto aún no está abierto
              }

              // Timeout después de 10 segundos
              if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                console.log(`⚠️ Timeout waiting for ${name} server on port ${port}`);
                // Asumimos que está listo de todos modos para continuar
                if (name === 'Vite') viteReady = true;
                if (name === 'Express') expressReady = true;
                checkReady();
              }
            }, 500);
          };

          // Comprobar ambos puertos
          checkPort(5173, 'Vite');
          checkPort(8022, 'Express');
        });

        console.log('✅ All servers started and ready');
      });

      on('after:run', (results) => {
        try {
          if (results) {
            const formattedDuration = formatTime(results.totalDuration);
            console.log('Total duration: ', formattedDuration);
            console.log('Total suites: ', results.totalSuites);
            console.log('Total tests: ', results.totalTests);
            console.log('');
            console.log('Passed: ', results.totalPassed);
            console.log('Failed: ', results.totalFailed);
            console.log('Pending: ', results.totalPending);
          }
        } catch (error) {
          console.error(`Error closing the servers: ${error.message}`);
        } finally {
          try {
            if (backendProcess) {
              backendProcess.kill('SIGTERM');
            }
            if (frontendProcess) {
              frontendProcess.kill('SIGTERM');
            }
            killProcessOnPort(5173);
            killProcessOnPort(8022);
            console.log('🛑 All servers stopped');
          } catch (execError) {
            console.error(`Error closing the servers: ${execError.message}`);
          }
        }
      });
    },
  },
  viewportWidth: 1640,
  viewportHeight: 1600,
  video: false,
  reporter: 'dot',
  chromeWebSecurity: false,
})