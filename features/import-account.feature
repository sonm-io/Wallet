
@importaccount
Feature: Start screen

  Scenario: Import Account - invalid file
    Given Login to wallet "emptyWallet" with password "11111111"
    Then I see accounts page
    When I press import account
    Then I see add account dialogue
    When I select keystore file "incorrect_file.json"
    Then I see import account file validation error message
    When I select keystore file "for_upload.json"
    Then I see preview
    And I type account name "import acc"
    And I type account password "11111111"
    When I press button Add
    Then I see account "import acc" in accounts list

  Scenario: Import Account - Add first account from file
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

  Scenario: Import Account - fields validation
    Given Login to wallet "emptyWallet" with password "11111111"
    Then I see accounts page
    When I press import account
    Then I see add account dialogue
    When I select keystore file "for_upload.json"
    When I press button Add
    Then I see import account name validation error message
    Then I see import account password validation error message "Password is required"
    And I type account name "import acc test"
    And I type account password "2"
    When I press button Add
    Then I see import account password validation error message "Password is not valid"
    And I clear import account password field
    And I type account password "11111111"
    When I press button Add
    Then I see account "import acc test" in accounts list
