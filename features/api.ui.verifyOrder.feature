Feature: User login
    User should be succesfully navigate to the application home page and access the Orders page
  @API-UI
  Scenario: User should be able to click on Orders and navigate to the Orders page
    Given User should navigate to the application home page
    When User clicks on Orders button
    Then User should be navigated to Orders page