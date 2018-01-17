# ./front-tests/features/test.feature

Feature: Start screen

  Scenario: Login with existing wallet
    Given I open wallet with one existing wallet
    When I type password "11111111"
    Then I should see accounts page
    And Send link is disabled

  Scenario: Create wallet empty storage
    Given I open wallet with empty storage
    When I create wallet with name "test" and password "11111111" and password confirmation "11111111"
    And I confirm add new wallet
    Then I should see accounts page

  Scenario: Add second wallet
    Given I open wallet with one existing wallet
    When I close password dialogue
    And I press Add wallet
    And I create wallet with name "test2" and password "11111111" and password confirmation "11111111"
    And I confirm add new wallet
    Then I should see accounts page
