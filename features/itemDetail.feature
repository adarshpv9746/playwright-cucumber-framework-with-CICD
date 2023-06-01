Feature: Navigate to Item Details page
    User should succesfully navigate to the correct Item details page
  @Regression
  Scenario: User should be able to click on an item and navigate to the details page
    Given User open the application home page
    When User clicks on the first item
    Then User should succesfully navigate to the correct item detail page
