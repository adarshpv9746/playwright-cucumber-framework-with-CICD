class HomePage {
  constructor (page) {
    this.page = page
    this.item = page.locator('.card-title a')
    this.homeLoginButton = page.locator('#login2')
    this.loggedInUserName = this.page.locator('#nameofuser')
    this.userNameModal = this.page.getByRole('dialog')
    this.username = this.page.locator('#loginusername')
    this.password = this.page.locator('#loginpassword')
    this.loginButton = this.page.getByRole('button', { name: 'Log in' })
    this.closeButton = page.locator('text=Close')
    this.ordersButton = this.page.locator(
      'button[routerlink="/dashboard/myorders"]'
    )
    this.ordersListTitle = this.page.locator('h1.ng-star-inserted')
  }

  /**
   * Opens the application web page
   * @param {string} appUrl
   */
  async openHomePage (appUrl) {
    await this.page.goto(appUrl)
  }

  async clickLogin () {
    await this.homeLoginButton.click()
  }

  async enterLoginCredentials (username, password) {
    await this.username.click()
    await this.username.fill(username)
    await this.password.click()
    await this.password.fill(password)
  }

  async clickLoginButton () {
    await this.loginButton.click()
  }

  async getItemText () {
    const itemText = this.item.first().textContent()
    return itemText
  }

  async clickOnFirstItem () {
    await this.item.first().click()
  }

  async getLoggedInUserName () {
    await this.page.waitForLoadState('networkidle')
    const userName = await this.loggedInUserName.textContent()
    return userName
  }

  async closeDialog () {
    await this.page.on('login dialog popup', (dialog) => {
      this.closeButton.click()
    })
  }

  /**
   * Opens the application web page
   * @param {string} appUrl
   */
  async navigateToHomePage (appUrl) {
    this.page.addInitScript((value) => {
      window.localStorage.setItem('token', value)
    }, global.token)
    await this.page.goto(appUrl)
  }

  async clickOrders () {
    await this.ordersButton.click()
  }

  async verifyOrders () {
    return await this.ordersListTitle.textContent()
  }
}

module.exports = { HomePage }
