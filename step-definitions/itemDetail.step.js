const { Then } = require('@cucumber/cucumber')
const { obInit } = require('../setup/init')

Then(
  'User should succesfully navigate to the correct item detail page',
  async function () {
    // create page handler object to handle home page
    this.po = obInit()
    const itemDetails = this.po.getItemDetails()
    const itemName = await itemDetails.getItemTitle()
    global.expect(global.item).to.equal(itemName)
  }
)
