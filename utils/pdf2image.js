const pdftoimage = require('pdftoimage')
const fs = require('fs')

// Check if the command-line argument for the input PDF file is provided
if (process.argv.length < 3) {
  console.log('Usage: node script.js <input-pdf-file>')
  process.exit(1)
}

// Get the input PDF file path from the command-line argument
const file = process.argv[2]

// Define the output directory path
const outputDir = 'pdf-pages'

// Check if the output directory exists, and create it if it doesn't
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

// Returns a Promise
pdftoimage(file, {
  format: 'png', // png, jpeg, tiff or svg, defaults to png
  prefix: 'img', // prefix for each image except svg, defaults to input filename
  outdir: outputDir // path to output directory, defaults to current directory
})
  .then(function () {
    console.log('Conversion done')
  })
  .catch(function (err) {
    console.log(err)
  })
