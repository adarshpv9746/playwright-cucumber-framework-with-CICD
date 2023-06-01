const config = require('config')
const endpoints = require('../config/apiEndPoints.json')
const apiTestData = require('../step-definitions/testData/apiTestData.json')

class ApiUtils {
  constructor (page) {
    this.page = page
  }

  async getToken (loginPayload, loginUrl) {
    const loginResponse = await global.apiContext.post(loginUrl, {
      data: loginPayload
    })
    const loginResponseJson = await loginResponse.json()
    global.token = await loginResponseJson.token
  }

  async authenticate () {
    this.page.addInitScript((value) => {
      window.localStorage.setItem('token', value)
    }, global.token)
  }

  async getProducts () {
    const API_PRODUCTSLIST_URL =
      config.get('api.baseUrl') + endpoints.productsList
    const API_PRODUCTSPAYLOAD = apiTestData.productsPayload
    const OrderReponse = await global.apiContext.post(API_PRODUCTSLIST_URL, {
      data: API_PRODUCTSPAYLOAD,
      headers: {
        Authorization: global.token,
        'Content-Type': 'application/json'
      }
    })
    const orderResponseJson = await OrderReponse.json()
    const items = orderResponseJson.data
    let i = 0
    const lists = []
    for (i = 0; i < items.length; i++) {
      const element = {}
      const itemname = items[i].productName
      const itemid = items[i]._id
      element.name = itemname
      element.id = itemid
      lists.push(element)
    }
    return lists
  }

  async createOrder (orderPayload) {
    const API_CREATEORDER_URL =
      config.get('api.baseUrl') + endpoints.createOrder
    const response = {}
    const OrderReponse = await global.apiContext.post(API_CREATEORDER_URL, {
      data: orderPayload,
      headers: {
        Authorization: global.token,
        'Content-Type': 'application/json'
      }
    })
    const orderResponseJson = await OrderReponse.json()
    response.orderid = orderResponseJson.orders[0]
    return response
  }

  async createOrderAndGetOrderId (orderPayload) {
    global.response = await this.createOrder(orderPayload)
    return global.response.orderid
  }

  async buildOrderPayloadAndCreateOrder () {
    const API_COUNTRY = apiTestData.country
    const API_PRODUCTNAME = apiTestData.productName
    const items = await this.getProducts()
    for (const [, value] of Object.entries(items)) {
      if (value.name === API_PRODUCTNAME) {
        const orderPayload = `{"orders": [{"country": "${API_COUNTRY}","productOrderedId": "${value.id}"}]}`
        return await this.createOrderAndGetOrderId(orderPayload)
      }
    }
  }

  async getOrdersCreated () {
    const API_ORDERS_URL = config.get('api.baseUrl') + endpoints.ordersList
    const OrdersReponse = await global.apiContext.get(API_ORDERS_URL, {
      headers: {
        Authorization: global.token,
        'Content-Type': 'application/json'
      }
    })
    const OrdersReponseJson = await OrdersReponse.json()
    return OrdersReponseJson
  }

  async verifyOrderCreated (orderId) {
    const OrdersReponseson = await this.getOrdersCreated()
    const data = OrdersReponseson.data
    for (const index of data) {
      if (index._id === orderId) {
        return true
      }
    }
    return false
  }
}
module.exports = { ApiUtils }
