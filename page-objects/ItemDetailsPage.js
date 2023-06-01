class ItemDetails {
  constructor (page) {
    this.page = page
    this.itemName = page.locator('.name')
  }

  async getItemTitle () {
    this.itemName = this.page.locator('.name').textContent()
    return this.itemName
  }
}
module.exports = { ItemDetails }
