const glob = require('glob')
const fs = require('fs')

const folderPath = 'features/'
const outputTxtFile = 'outputs/scenario-line.csv'
const fileExtensions = ['feature', 'txt']

;(async () => {
  try {
    const csvData = fs.readFileSync('datainput/scenario.csv', 'utf-8')
    const rows = csvData.split('\n').map((row) => {
      return { action: row.trim() }
    })

    const matchedLines = []

    for (const row of rows) {
      const action = row.action

      const files = await searchFiles(action, folderPath, fileExtensions)
      if (files.length > 0) {
        for (const file of files) {
          const fileContent = fs.readFileSync(file, 'utf-8')
          const lines = fileContent.split('\n')
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()
            const pattern = new RegExp(`^${action}\\s*$`)
            if (pattern.test(line)) {
              matchedLines.push(`${file}:${i + 1}`)
            }
          }
        }
      }
    }

    const outputData = matchedLines.join('\n')
    fs.writeFile(outputTxtFile, outputData, { encoding: 'utf8' }, (err) => {
      if (err) {
        console.error(`Error writing to file: ${err}`)
      } else {
        console.log(`Output written to ${outputTxtFile}`)
      }
    })
  } catch (error) {
    console.error(`Error searching for files: ${error}`)
  }
})()

function searchFiles (action, folderPath, fileExtensions) {
  return new Promise((resolve, reject) => {
    const pattern = `${folderPath}/**/*.{${fileExtensions.join(',')}}`
    glob(pattern, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}
