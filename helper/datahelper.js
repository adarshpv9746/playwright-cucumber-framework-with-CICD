const ExcelJS = require('exceljs')

class ImportExcel {
  constructor (filepath, sheetname) {
    this.filepath = filepath
    this.sheetname = sheetname
  }

  async readExcelFile () {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(this.filepath)
    const sheet = workbook.getWorksheet(this.sheetname)
    return sheet
  }
  /**
   * Read excel file
   * @returns sheet{object}
   */

  async getAsdict () {
    const workbook = new ExcelJS.Workbook()
    workbook.xlsx.readFile(this.filepath).then(() => {
      const worksheet = workbook.getWorksheet(this.sheetname)
      const headerRow = worksheet.getRow(1)
      const headers = []
      headerRow.eachCell(function (cell) {
        headers.push(cell.value)
      })
      const data = []
      worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
        if (rowNumber === 1) {
          return
        }
        const rowData = {}
        row.eachCell(function (cell, colNumber) {
          rowData[headers[colNumber - 1]] = cell.value
        })
        data.push(rowData)
      })
    })
  }

  async getDataInput (input, data) {
    let DataInput
    await Promise.all(
      input.map(async (row) => {
        const { filename, header, filepath, cell } = row
        const newData = new ImportExcel(filepath, filename)
        const sheet = await newData.readExcelFile()
        if (header === data) {
          DataInput = sheet.getCell(cell).value.toString()
        }
      })
    )

    return DataInput
  }
}

module.exports = { ImportExcel }
