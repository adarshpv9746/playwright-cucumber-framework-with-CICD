const nodemailer = require('nodemailer')
const path = require('path')

// Read the Cucumber report
const reportPath = path.join(__dirname, '../reports/json/cucumber_report.json')
const reportJson = require(reportPath)

if (process.argv.length < 3) {
  console.error(
    'Recipient emails not provided. Usage: node send-email.js email1@example.com,email2@example.com'
  )
  process.exit(1)
}

const recipientEmails = process.argv[2].split(',')

// extracting failed and passed scenarios
const failedScenarios = []
const passedScenarios = []
reportJson.forEach((feature) => {
  feature.elements.forEach((scenario) => {
    if (scenario.type === 'scenario') {
      const scenarioResult = scenario.steps.reduce((result, step) => {
        return result && step.result.status === 'passed'
      }, true)
      if (scenarioResult) {
        passedScenarios.push(scenario.name)
      } else {
        failedScenarios.push(scenario.name)
      }
    }
  })
})

async function sendMail () {
  // Configure your username and app password here
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sender@gmail.com',
      pass: 'app-password'
    }
  })

  // specify the recipient and email options
  const mailOptions = {
    from: 'adarshvijayan@qburst.com',
    to: recipientEmails.join(','),
    subject: 'Playwright Allure Report',
    html: `
    <html>
      <head>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          .passed {
            background-color: #c0f5c4;
          }
          .failed {
            background-color: #ffadad;
          }
        </style>
      </head>
      <body>
        <h1>Test Report</h1>
        <table>
          <tr>
            <th>Scenario</th>
            <th>Status</th>
          </tr>
          ${failedScenarios
            .map(
              (scenario) =>
                `<tr><td>${scenario}</td><td class="failed">Failed</td></tr>`
            )
            .join('')}
          ${passedScenarios
            .map(
              (scenario) =>
                `<tr><td>${scenario}</td><td class="passed">Passed</td></tr>`
            )
            .join('')}
        </table>
      </body>
    </html>
  `,
    attachments: [
      {
        filename: 'allure-report.html',
        path: path.join(__dirname, '../reports/html/allure_report.html')
      },
      {
        filename: 'cucumber-report.html',
        path: path.join(__dirname, '../reports/html/cucumber_report.html')
      },
      {
        filename: 'allure-report.pdf',
        path: path.join(__dirname, '../reports/pdfs/allure.pdf')
      }
    ]
  }

  // send the email
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent: ${info.response}`)
  } catch (err) {
    console.error(`Error sending email: ${err}`)
  }
}

sendMail()