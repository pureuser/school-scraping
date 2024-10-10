const { defineConfig } = require('cypress')
const fs = require('fs')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        writeToFile({ filename, data }) {
          return new Promise((resolve, reject) => {
            fs.writeFile(filename, data, 'utf8', (err) => {
              if (err) {
                reject(err)
              } else {
                resolve(null)
              }
            })
          })
        },
      })
    },
  },
})
