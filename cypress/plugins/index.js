const fs = require('fs')

module.exports = (on, config) => {
  on('task', {
    writeToFile({ filename, data }) {
      return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, (err) => {
          if (err) {
            return reject(err)
          }
          resolve(null)
        })
      })
    },
  })
}
