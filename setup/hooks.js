const {
  Before,
  After,
  BeforeAll,
  AfterAll,
  AfterStep
} = require('@cucumber/cucumber')
const CONFIG_DATA = require('./configData')
const { getBrowserType } = require('./init')
const allure = require('allure-js-commons')
let step = 0
let feature = 0

BeforeAll(async function () {
  // Launch browser
  const browserType = await getBrowserType()
  global.browser = await browserType.launch({
    headless: CONFIG_DATA.headlessMode
  })
})

AfterAll(async function () {
  await global.browser.close()
})

Before(async function () {
  // Creating new browser context
  global.context = await global.browser.newContext({ ...CONFIG_DATA.device })
  global.page = await global.context.newPage()
  await global.context.tracing.start({
    path: 'trace.json',
    screenshots: true,
    snapshots: true
  })
})

Before({ tags: '@API-UI or @API' }, async function () {
  const config = require('config')
  const endpoints = require('../config/apiEndPoints.json')
  const { request } = require('playwright')
  const { ApiUtils } = require('../utils/ApiUtils')
  const { getDecryptedData } = require('../utils/decryptData')
  const API_LOGINURL = config.get('api.baseUrl') + endpoints.login
  const USER_NAME = config.get('api.username')
  const PASS_WORD = config.get('api.password')
  const username = getDecryptedData(USER_NAME)
  const password = getDecryptedData(PASS_WORD)
  /** Creating new api context */
  global.apiContext = await request.newContext()
  const apiutil = new ApiUtils(global.page)
  const loginPayload = {
    userEmail: username,
    userPassword: password
  }
  await apiutil.getToken(loginPayload, API_LOGINURL)
})

After(async function () {
  feature++
  await global.context.tracing.stop({
    path: `reports/trace/trace${feature}.zip`
  })
  await global.page.close()
  await global.context.close()
})

AfterStep(async function (Scenario) {
  step++
  if (Scenario.result.status === 'FAILED') {
    const screenshotPath = `reports/screenshots/step-${step}.png`
    const screenshot = await global.page.screenshot({
      path: screenshotPath,
      type: 'png'
    })
    await this.attach(screenshot, 'image/png')
    await allure.attachment(
      'Screenshot',
      Buffer.from(screenshot, 'base64'),
      'image/png'
    )
  }
})
