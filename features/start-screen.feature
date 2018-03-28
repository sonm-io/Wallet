# ./front-tests/features/test.feature

@wallet
Feature: Start screen

  Scenario: Correct login - one account
    Given Wallet with one existing wallet is opened
    When Click the I Understand button
    And Fill Wallet Popup Password field "11111111"
    Then Accounts page is displayed
    And Send link tab is disabled
    When Click the Logout button
    Then Logged out from wallet

  Scenario: Creating wallet with empty storage
    Given Wallet with empty storage is opened
    When Click the I Understand button
    Then Create New Wallet dialogue is displayed
    And Wallet dialogue with Name "test" and Password "11111111" and Password Confirmation "11111111" is filled
    When Click the Create Wallet button
    Then Accounts page is displayed
    When Click the Logout button
    Then Logged out from wallet

  Scenario: Creating wallet - add second wallet
    Given Wallet with one existing wallet is opened
    When Click the I Understand button
    Then Close Password dialogue
    And Click the CREATE WALLET button
    Then Create New Wallet dialogue is displayed
    And Wallet dialogue with Name "test2" and Password "11111111" and Password Confirmation "11111111" is filled
    And Click the Create Wallet button
    Then Accounts page is displayed
    When Click the Logout button
    Then Logged out from wallet

  Scenario: Creating wallet - existing wallet name validation
    Given Wallet with one existing wallet is opened
    When Click the I Understand button
    And Close Password dialogue
    When Click the CREATE WALLET button
    Then Create New Wallet dialogue is displayed
    And Fill Create New Wallet Name field "empty"
    When Click the Create Wallet button
    Then Create New Wallet Name validation error message "Already exist" is displayed

  Scenario: Login with existing wallet without displaying disclaimer in future
    Given Wallet with one existing wallet is opened
    When Click the Dont Show Disclaimer Again button
    When Fill Wallet Popup Password field "11111111"
    Then Accounts page is displayed
    And Send link tab is disabled
    When Click the Logout button
    Then Logged out from wallet and Enter Password popup is displayed

  Scenario: Login to wallet - incorrect password
    Given Wallet with one existing wallet is opened
    When Click the I Understand button
    When Fill Wallet Popup Password field "22#435asds2"
    Then Enter Password popup Password field validation error message is displayed

  Scenario: Creating wallet - fields validation
    Given Wallet with empty storage is opened
    When Click the I Understand button
    And Create New Wallet dialogue is displayed
    When Click the Create Wallet button
    Then Create New Wallet Name validation error message "Name length must be in range 1..20" is displayed
    And Fill Create New Wallet Name field "autotest"
    When Click the Create Wallet button
    Then Create New Wallet Password validation error message is displayed
    And Fill Create New Wallet Password field "122"
    When Click the Create Wallet button
    Then Create New Wallet Confirmation Password validation error message is displayed
    And Fill Create New Wallet Confirmation Password field "22"
    And Click the Create Wallet button
    Then Create New Wallet Confirmation Password validation error message is displayed
    And Clear Create New Wallet Confirmation Password field
    And Fill Create New Wallet Confirmation Password field "122"
    And Select Network for wallet "rinkeby"
    And Click the Create Wallet button
    Then Accounts page is displayed
    When Click the Logout button
    Then Logged out from wallet

  Scenario: Login to wallet - search wallet from list and further login
    Given Three wallet accounts are created
    When Click the I Understand button
    When Enter value "t" into Account Search field for search Accounts
    Then Wallets search results "['test','tAlex','45te']" are displayed
    When Enter value "45" into Account Search field for search Accounts
    Then Wallets search results "['45te']" are displayed
    When Wallet "45te" is selected from Wallets dropdown
    And Click the Login button
    And Fill Wallet Popup Password field "11111111"
    Then Accounts page is displayed
    And Send link tab is disabled
    When Click the Logout button
    Then Logged out from wallet