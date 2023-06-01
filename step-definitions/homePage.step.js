const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('chai')
const { obInit } = require('../setup/init')
const config = require('config')
const { getDecryptedData } = require('../utils/decryptData')

const APP_URL = config.get('app.url')
const USER_NAME = config.get('app.username')
const PASS_WORD = config.get('app.password')
const username = getDecryptedData(USER_NAME)
const password = getDecryptedData(PASS_WORD)

Given('User open the application home page', async function () {
  // create page handler object to handle home page
  this.po = obInit()
  // pointer to home page object. This object will be used in all methods in this file
  this.homePage = this.po.homePageInit()
  await this.homePage.openHomePage(APP_URL)
})

When('User clicks on the first item', async function () {
  global.item = await this.homePage.getItemText()
  await this.homePage.clickOnFirstItem()
})

When('User clicks on Login option', async function () {
  await this.homePage.clickLogin()
})

Then('User enters username and password and click login', async function () {
  await this.homePage.enterLoginCredentials(username, password)
  await this.homePage.clickLoginButton()
})

Then('User should get logged in succesfully', async function () {
  const userName = await this.homePage.getLoggedInUserName()
  await expect(userName).to.contain(username)
})
