const { chromium } = require('playwright')
const path = require('path')
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  const htmlPath = path.join(__dirname, '../allure-report', 'index.html')
  const htmlUrl = `file://${htmlPath}`

  // Navigate to the HTML file and wait until the content is loaded
  await page.goto(htmlUrl, { waitUntil: 'networkidle' })

  // Define an array of PDF paths and section names
  const sections = [
    {
      name: 'overview',
      path: './reports/pdfs/overview.pdf',
      section: null,
      selector: "//h2[contains(text(),'Allure')]"
    },
    {
      name: 'categories',
      path: './reports/pdfs/categories.pdf',
      section: '#categories',
      selector: "//span[contains(text(),'Categories')]"
    },
    {
      name: 'suites',
      path: './reports/pdfs/suites.pdf',
      section: '#suites',
      selector: "//span[contains(text(),'Suites')]"
    },
    {
      name: 'graph',
      path: './reports/pdfs/graph.pdf',
      section: '#graph',
      selector: "//div[@class='status-widget__content chart__body']"
    },
    {
      name: 'timeline',
      path: './reports/pdfs/timeline.pdf',
      section: '#timeline',
      selector: "//div[@class='timeline__chart']"
    },
    {
      name: 'behaviors',
      path: './reports/pdfs/behaviors.pdf',
      section: '#behaviors',
      selector: "//span[contains(text(),'Behaviors')]"
    },
    {
      name: 'packages',
      path: './reports/pdfs/packages.pdf',
      section: '#packages',
      selector: "//span[contains(text(),'Packages')]"
    }
  ]

  // Loop through the sections and generate PDFs
  for (let i = 0; i < sections.length; i++) {
    const { name, path, section, selector } = sections[i]
    if (section) {
      page.goto(`${htmlUrl}${section}`, { waitUntil: 'networkidle' })
    }
    await page.waitForSelector(selector, { visible: true, timeout: 5000 })
    await page.pdf({ path, format: 'A4', printBackground: true })
    console.log(`Generated PDF for ${name}`)
  }

  // Close the browser
  const files = [
    './reports/pdfs/overview.pdf',
    './reports/pdfs/categories.pdf',
    './reports/pdfs/suites.pdf',
    './reports/pdfs/graph.pdf',
    './reports/pdfs/timeline.pdf',
    './reports/pdfs/behaviors.pdf',
    './reports/pdfs/packages.pdf'
  ]

  const mergedPdf = await PDFDocument.create()

  for (const file of files) {
    const pdfBytes = await fs.promises.readFile(file)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
    pages.forEach((page) => mergedPdf.addPage(page))
  }

  const mergedPdfBytes = await mergedPdf.save()

  await fs.promises.writeFile('./reports/pdfs/allure.pdf', mergedPdfBytes)

  for (const file of files) {
    await fs.promises.unlink(file)
  }

  await browser.close()
})()
