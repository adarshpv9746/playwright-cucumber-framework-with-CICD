const { Then } = require('@cucumber/cucumber')
const { ImportExcel, ImportData } = require('../helper/datahelper')
const { obInit } = require('../setup/init')
let username, password

Then(
  'User enters username and password and click login using data',
  async () => {
    const homePage = global.pageObjects.homePageInit()
    const newData = new ImportExcel('datainput/testdata.xlsx', 'sheet1')
    ImportData.getAsdict()
    const Sheet = await newData.readExcelFile()

    username = Sheet.getCell('C(3)').value.toString()
    password = Sheet.getCell('B(4)').value.toString()
    await homePage.enterLoginCredentials(username, password)
    await homePage.clickLoginButton()
  }
)

Then(
  'User login using {string} and {string} from following data:',
  async (user, passcode, table) => {
    this.po = obInit()
    this.homePage = this.po.homePageInit()
    const input = table.hashes()
    const SheetData = new ImportExcel()
    username = await SheetData.getDataInput(input, user)
    password = await SheetData.getDataInput(input, passcode)
    await this.homePage.enterLoginCredentials(username, password)
    await this.homePage.clickLoginButton()
  }
)
