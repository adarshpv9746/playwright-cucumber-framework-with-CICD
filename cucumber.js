const CONFIG_DATA = require('./setup/configData')
const fs = require('fs')

const scenarioLineFilePath = 'outputs/scenario-line.csv'

let scenarioCommands = []

// Check if the scenario-line.csv file exists
if (fs.existsSync(scenarioLineFilePath)) {
  // Read CSV and build scenario array
  const csvData = fs.readFileSync(scenarioLineFilePath, 'utf-8')
  const scenarios = csvData.split('\n').map((row) => row.trim())

  scenarioCommands = scenarios.map((scenario) => {
    const [featureFile, line] = scenario.split(':')
    return `${featureFile}:${line}`
  })
}

const common = `
  --require setup/assertions.js
  --require step-definitions/**/*.step.js
  --require setup/hooks.js
  --parallel ${CONFIG_DATA.parallel} 
  --publish-quiet 
  -f json:reports/json/cucumber_report.json
`

module.exports = {
  default: `${common}`,
  allure: `${common} -f ./allure-config/allure-conf.js`,
  cucumber: `${common} -f json:reports/json/cucumber_report.json`,
  multiple: `${common} ${scenarioCommands.join(' ')}`,
  // -----------------------------------------------------------------
  // --------The code below can be modified as per requirement--------
  // -----------------------------------------------------------------
  testapi: `${common} --tags "@API"`,
  testapiui: `${common} --tags "@API-UI"`,
  regression: `${common} --tags "@Regression"`
}
