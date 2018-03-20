
@test
  Feature: test

    Scenario: Import wallet - with accounts
      Given I open wallet with empty storage
      When I click I Understand button
      And Close Create New Wallet dialogue
      And I click Import Wallet button
      And I Select wallet file for import "correct_wallet_with_acc.txt"
      And I fill wallet name field "Wallet Import" for Import Wallet
      And I fill password field "1" for Import Wallet
      When I click Import Wallet
      Then Send link tab is disabled
      Then I see account "Test" in accounts list
      When I press logout button
      Then I log out from wallet