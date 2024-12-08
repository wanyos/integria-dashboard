import { defineConfig } from 'cypress'
import { execSync } from 'child_process'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:5173',

    setupNodeEvents(on, config) {
      on('after:run', (results) => {
        try {
          if (results) {
            console.log('Total duration: ', results.totalDuration)
            console.log('Total suites: ', results.totalSuites)
            console.log('Total tests: ', results.totalTests)
            console.log('')
            console.log('Passed: ', results.totalPassed)
            console.log('Failed: ', results.totalFailed)
            console.log('Pending: ', results.totalPending)
          }

          execSync('lsof -ti :8022 | xargs kill')
          execSync('lsof -ti :5173 | xargs kill')
        } catch (error) {
          console.error(`Error close the servers: ${error.message}`)
        }
      })
    },
  },
})
