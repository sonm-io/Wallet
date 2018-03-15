
@account
Feature: Account

  Scenario: Add first account from file
    Given Login to wallet "emptyWallet" with password "11111111"
    Then I should see accounts page
    When I press import account
    Then I should see add account dialogue
    When I select keystore file "for_upload.json"
    Then I see preview
    When I type account password "11111111"
    And I type account name "acc name"
    And I press button Add
    Then I should see account "acc name" in accounts list


  Scenario: Add new account
    Given Login to wallet "emptyWallet" with password "11111111"
    Then I should see accounts page
    When I press create new account
    Then I should see new account dialogue
    When I type new account password "asdaasda"
    And I type new account password confirmation "asdaasda"
    And I type new account name "asda"
    And I press button Create
    Then I should see account "asda" in accounts list