
@importwallet
Feature: Import Wallet

  Scenario: Import wallet - correct password
    Given I open wallet with empty storage
    When I click I Understand button
    And Close Create New Wallet dialogue
    And I click Import Wallet button
    And I Select wallet file for import "correct_wallet.txt"
    And I fill wallet name field "Wallet Import" for Import Wallet
    And I fill password field "1" for Import Wallet
    When I click Import Wallet
    Then I should see accounts page
    And Send link tab is disabled
    When I press logout button
    Then I log out from wallet

  Scenario: Import wallet - invalid file
    Given I open wallet with one existing wallet
    When I click I Understand button
    And I close password dialogue
    And I click Import Wallet button
    And I Select wallet file for import "correct_wallet.txt"
    And I fill wallet name field "empty" for Import Wallet
    When I click Import Wallet
    Then I see import wallet name validation error message
    And I fill wallet name field "empty" for Import Wallet
    And I fill password field "2" for Import Wallet
    When I click Import Wallet
    Then I see import wallet password validation error message
    And I fill password field "11111111" for Import Wallet
    When I click Import Wallet
    Then I should see accounts page
    And Send link tab is disabled
    When I press logout button
    Then I log out from wallet

  Scenario: Import wallet - invalid file
    Given I open wallet with empty storage
    When I click I Understand button
    And Close Create New Wallet dialogue
    And I click Import Wallet button
    And I Select wallet file for import "incorrect_wallet.json"
    And I fill wallet name field "Wallet Import" for Import Wallet
    And I fill password field "1" for Import Wallet
    When I click Import Wallet
    Then I see import wallet validation error message
    And I Select wallet file for import "correct_wallet.txt"
    When I click Import Wallet
    Then I should see accounts page
    And Send link tab is disabled
    When I press logout button
    Then I log out from wallet

    