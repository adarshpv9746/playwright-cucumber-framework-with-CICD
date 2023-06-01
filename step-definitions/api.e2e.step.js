const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('chai')
const { ApiUtils } = require('../utils/ApiUtils')
const { obInit } = require('../setup/init')
const config = require('config')
const endpoints = require('../config/apiEndPoints.json')
const APP_URL = config.get('api.baseUrl') + endpoints.client

Given('User should gets authenticated', async () => {
  this.apiutil = new ApiUtils(global.page)
  await this.apiutil.authenticate()
})

Then('User should get the products list', async () => {
  const products = await this.apiutil.getProducts()
  await expect(products).to.not.be.empty
})

Then(
  'User should create an order for an item and access the order id',
  async () => {
    this.orderId = await this.apiutil.buildOrderPayloadAndCreateOrder()
    await expect(this.orderId).to.not.be.empty
  }
)

Then('Verify the order created in the orders page', async () => {
  const orderStatus = await this.apiutil.verifyOrderCreated(this.orderId)
  await expect(orderStatus).to.be.true
})

Given('User should navigate to the application home page', async function () {
  this.po = obInit()
  this.homePage = this.po.homePageInit()
  await this.homePage.navigateToHomePage(APP_URL)
})

When('User clicks on Orders button', async function () {
  await this.homePage.clickOrders()
})

Then('User should be navigated to Orders page', async function () {
  const text = await this.homePage.verifyOrders()
  await expect(text).to.equal('Your Orders')
})
