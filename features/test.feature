
@test
Feature: dev

  Scenario: Import wallet - correct password
    Given I open wallet with empty storage
    When I click I Understand button
    And Close Create New Wallet dialogue
    And Click Import Wallet button
    And I Select wallet file for import
    And I fill wallet name field "Wallet Import" for Imported Wallet
    And I fill password field "1" for Imported Wallet
    When I click Import Wallet