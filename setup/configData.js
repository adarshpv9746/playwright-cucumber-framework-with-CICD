const { devices } = require('playwright')
/**
 * Data values required to launch the application
 */
const CONFIG_DATA = {
  browserName: process.env.browser,
  parallel: 1,
  headlessMode: false,
  device: devices[''],
  // smtp_username and password must be base 64 encrypted
  smtp_username: 'YWRhcnNodmlqYXlhbkBxYnVyc3QuY29t',
  smtp_pass: 'bmx3emppemxxaGRscWxocQ=='
}

module.exports = CONFIG_DATA
