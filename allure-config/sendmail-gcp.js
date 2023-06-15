const fs = require('fs')
const { google } = require('googleapis')

// Read the credentials from the credentials.json file
const credentialsPath = './credentials.json'
const credentialsContent = fs.readFileSync(credentialsPath)
const credentials = JSON.parse(credentialsContent)

// OAuth 2.0 credentials
const {
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uris: redirectUris
} = credentials.installed

// Create an OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUris[0]
)

// Use the access token to send emails
const sendEmail = async (accessToken, to, from, subject, body) => {
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUris[0]
  )
  oAuth2Client.setCredentials({ access_token: accessToken })

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

  const message = {
    requestBody: {
      raw: createEmail(to, from, subject, body)
    },
    userId: 'me'
  }

  try {
    const res = await gmail.users.messages.send(message)
    console.log('Email sent:', res.data)
  } catch (error) {
    console.error('Failed to send email:', error.message)
  }
}

// Check if tokens.json file exists
const tokensPath = './tokens.json'
let tokens = null

if (fs.existsSync(tokensPath)) {
  const tokensContent = fs.readFileSync(tokensPath)
  tokens = JSON.parse(tokensContent)
}

// Reuse the existing tokens if they are valid
if (tokens && tokens.access_token && tokens.refresh_token) {
  const to = 'csicoet18@gmail.com'
  const from = 'adarshvijayan@qburst.com'
  const subject = 'Test Email'
  const body = 'This is a test email sent from the Gmail API.'

  ;(async () => {
    try {
      await sendEmail(tokens.access_token, to, from, subject, body)
    } catch (error) {
      console.error(
        'Failed to send email using existing tokens:',
        error.message
      )
      // Perform the normal flow when tokens are invalid
      await performNormalFlow()
    }
  })()
} else {
  ;(async () => {
    await performNormalFlow()
  })()
}

// Perform the normal flow to obtain new tokens
async function performNormalFlow () {
  // Generate the authorization URL
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.compose']
  })

  console.log('Authorize this app by visiting the following URL:')
  console.log(authorizeUrl)

  // Create a readline interface to get user input
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  // Prompt the user to enter the authorization code
  rl.question('Enter the authorization code: ', async (authorizationCode) => {
    rl.close()

    try {
      // Exchange authorization code for access and refresh tokens
      const { tokens } = await oAuth2Client.getToken(authorizationCode)

      // Save the tokens for future use
      fs.writeFileSync(tokensPath, JSON.stringify(tokens))

      // Use the access token to send emails
      const to = 'csicoet18@gmail.com'
      const from = 'adarshvijayan@qburst.com'
      const subject = 'Test Email'
      const body = 'This is a test email sent from the Gmail API.'
      try {
        await sendEmail(tokens.access_token, to, from, subject, body)
      } catch (error) {
        console.error('Failed to send email using new tokens:', error.message)
      }
    } catch (error) {
      console.error('Failed to obtain access token:', error.message)
    }
  })
}

// Helper function to create email message
function createEmail (to, from, subject, message) {
  const emailLines = []
  emailLines.push(`From: ${from}`)
  emailLines.push(`To: ${to}`)
  emailLines.push('Content-Type: text/html; charset=utf-8')
  emailLines.push('MIME-Version: 1.0')
  emailLines.push(`Subject: ${subject}`)
  emailLines.push('')
  emailLines.push(message)

  const email = emailLines.join('\r\n').trim()
  const encodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return encodedEmail
}
