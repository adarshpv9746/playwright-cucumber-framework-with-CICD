const ObjectHandler = require('../page-objects/ObjectHandler')
const { chromium, firefox, webkit } = require('playwright')
const CONFIG_DATA = require('./configData')

/**
 * Func to create and initialise object handler of the application
 * @returns {object}
 */
const obInit = function () {
  const poHandler = new ObjectHandler(global.page)
  return poHandler
}

/**
 * Func to check the browser choice and get the playwright's browser type
 * @returns {object}
 */
async function getBrowserType () {
  let browserType
  if (CONFIG_DATA.browserName === undefined) {
    browserType = chromium
  } else {
    switch (CONFIG_DATA.browserName.toLowerCase()) {
      case 'chromium':
        browserType = chromium
        break
      case 'firefox':
        browserType = firefox
        break
      case 'webkit':
        browserType = webkit
        break
      default:
        browserType = chromium
    }
  }
  return browserType
}
module.exports = { obInit, getBrowserType }
