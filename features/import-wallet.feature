
@importwallet
Feature: Import Wallet

  Scenario: Import wallet - correct password
    Given Wallet with empty storage is opened
    When Click the I Understand button
    And Close Create New Wallet dialogue
    When Click the IMPORT WALLET button
    Then Import Wallet dialogue is displayed
    And Wallet file for import "correct_wallet.txt" is selected
    And Fill Import Wallet Name field "Wallet Import"
    And Fill Import Wallet Password field "1"
    When Click the Import button
    Then Accounts page is displayed
    And Send link tab is disabled
    When Click the Logout button
    Then Logged out from wallet

  Scenario: Import wallet - fields validation
    Given Wallet with one existing wallet is opened
    When Click the I Understand button
    And Close Password dialogue
    When Click the IMPORT WALLET button
    Then Import Wallet dialogue is displayed
    And Wallet file for import "correct_wallet.txt" is selected
    And Fill Import Wallet Name field "empty"
    When Click the Import button
    Then Import Wallet Name field validation error message is displayed
    And Clear Import Wallet Name field
    And Fill Import Wallet Name field "empty1"
    And Fill Import Wallet Password field "2"
    When Click the Import button
    Then Import Wallet Password field validation error message is displayed
    And Clear Import Wallet Password field
    And Fill Import Wallet Password field "1"
    When Click the Import button
    Then Accounts page is displayed
    And Send link tab is disabled
    When Click the Logout button
    Then Logged out from wallet

  Scenario: Import wallet - invalid file
    Given Wallet with empty storage is opened
    When Click the I Understand button
    And Close Create New Wallet dialogue
    When Click the IMPORT WALLET button
    Then Import Wallet dialogue is displayed
    And Wallet file for import "incorrect_wallet.json" is selected
    And Fill Import Wallet Name field "Wallet Import"
    And Fill Import Wallet Password field "1"
    When Click the Import button
    Then Import Wallet File field validation error message is displayed
    And Wallet file for import "correct_wallet.txt" is selected
    When Click the Import button
    Then Accounts page is displayed
    And Send link tab is disabled
    When Click the Logout button
    Then Logged out from wallet

  Scenario: Import wallet - with accounts
    Given Wallet with empty storage is opened
    When Click the I Understand button
    And Close Create New Wallet dialogue
    When Click the IMPORT WALLET button
    Then Import Wallet dialogue is displayed
    And Wallet file for import "correct_wallet_with_acc.txt" is selected
    And Fill Import Wallet Name field "Wallet Import"
    And Fill Import Wallet Password field "1"
    When Click the Import button
    Then Account "Test" is present in Accounts list
    When Click the Logout button
    Then Logged out from wallet

  Scenario: Import Wallet - Cancel
    Given Wallet with empty storage is opened
    When Click the I Understand button
    And Close Create New Wallet dialogue
    When Click the IMPORT WALLET button
    Then Import Wallet dialogue is displayed
    And Wallet file for import "correct_wallet.txt" is selected
    And Fill Import Wallet Name field "Wallet Import"
    And Fill Import Wallet Password field "1"
    When Close Import Wallet dialogue
    Then Wallet "Wallet Import" was not created
    And Click the IMPORT WALLET button
    When Import Wallet dialogue is displayed
    Then All Import Wallet fields are empty