
@account
Feature: Account

  Scenario: Add first account from file
    Given Login to wallet "emptyWallet" with password "11111111"
    Then I see accounts page
    When I press import account
    Then I see add account dialogue
    When I select keystore file "for_upload.json"
    Then I see preview
    When I type account password "11111111"
    And I type account name "acc name"
    And I press button Add
    Then I see account "acc name" in accounts list


  Scenario: Add new account
    Given Login to wallet "emptyWallet" with password "11111111"
    Then I see accounts page
    When I press create new account
    Then I should see new account dialogue
    When I type new account password "asdaasda"
    And I type new account password confirmation "asdaasda"
    And I type new account name "asda"
    And I press button Create
    Then I see account "asda" in accounts list

  Scenario: Add first account from private key
    Given Login to wallet "emptyWallet" with password "11111111"
    Then I see accounts page
    When I press create new account
    Then I should see new account dialogue
    When I type new account password "asdaasda"
    And I type new account password confirmation "asdaasda"
    And I type new account name "from privateKey"
    And I type private key "b7bacfa65397ea40b67608bf0d2b93da9bf807a4fde55f122922db2373e7f432"
    And I press button Create
    Then I should see account "from privateKey" in accounts list with hash "0x3195198151a456f59d39ce95dd302c5b2d034bff"
