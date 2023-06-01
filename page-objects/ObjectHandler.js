const { HomePage } = require('./HomePage')
const { ItemDetails } = require('./ItemDetailsPage')

class ObjectHandler {
  constructor (page) {
    this.page = page
    this.homePage = new HomePage(this.page)
    this.itemDetails = new ItemDetails(this.page)
  }

  homePageInit () {
    return this.homePage
  }

  getItemDetails () {
    return this.itemDetails
  }
}

module.exports = ObjectHandler
