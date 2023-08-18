const CONFIG_DATA = require('./setup/configData')
const fs = require('fs')

// Read CSV and build scenario array
const csvData = fs.readFileSync('scenario-line.csv', 'utf-8')
const scenarios = csvData.split('\n').map((row) => row.trim())

const common = `
  --require setup/assertions.js
  --require step-definitions/**/*.step.js
  --require setup/hooks.js
  --parallel ${CONFIG_DATA.parallel} 
  --publish-quiet 
  -f json:reports/json/cucumber_report.json
`

const scenarioCommands = scenarios.map((scenario) => {
  const [featureFile, line] = scenario.split(':')
  return `${featureFile}:${line}`
})

console.log(scenarioCommands.join(' '))

module.exports = {
  testapi: `${common} --tags "@API"`,
  testapiui: `${common} --tags "@API-UI"`,
  default: `${common}`,
  regression: `${common} --tags "@Regression"`,
  allure: `${common} -f ./allure-config/allure-conf.js`,
  cucumber: `${common} -f json:reports/json/cucumber_report.json`,
  // sanity: `${common} features/userLogin.feature:5 features/itemDetail.feature:4`
  sanity: `${common} ${scenarioCommands.join(' ')}`
}
