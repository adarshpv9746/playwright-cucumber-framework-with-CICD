const CONFIG_DATA = require('./setup/configData')

const common = `
  --require setup/assertions.js
  --require step-definitions/**/*.step.js
  --require setup/hooks.js
  --parallel ${CONFIG_DATA.parallel} 
  --publish-quiet 
  -f json:reports/json/cucumber_report.json
`

module.exports = {
  testapi: `${common} --tags "@API"`,
  testapiui: `${common} --tags "@API-UI"`,
  default: `${common}`,
  regression: `${common} --tags "@Regression"`,
  allure: `${common} -f ./allure-config/allure-conf.js`,
  cucumber: `${common} -f json:reports/json/cucumber_report.json`
}
