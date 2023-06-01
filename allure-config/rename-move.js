const fs = require('fs-extra')

const oldFilePath = './allure-report/complete.html'
const newFilePath = './reports/html/allure_report.html'

fs.move(oldFilePath, newFilePath, { overwrite: true }, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log(
      `File ${oldFilePath} has been renamed and moved to ${newFilePath}`
    )
  }
})
