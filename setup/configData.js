const { devices } = require('playwright')
/**
 * Data values required to launch the application
 */
const CONFIG_DATA = {
  browserName: process.env.browser,
  parallel: 1,
  headlessMode: false,
  device: devices['']
}

module.exports = CONFIG_DATA
