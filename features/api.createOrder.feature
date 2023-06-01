Feature: User login
    User should be able to login to web application
  @API
  Scenario: User should be able to authenticate, create order and access the order id through api
    Given User should gets authenticated
    Then User should get the products list
    Then User should create an order for an item and access the order id
    Then Verify the order created in the orders page
