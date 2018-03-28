
@account
Feature: Account

  Scenario: Account - Creating new account
    Given Login to wallet "emptyWallet" with password "11111111"
    Then Accounts page is displayed
    When Click the Create Account button
    Then Create New Account dialogue is displayed
    When Fill Create New Account Name field "asda"
    And Fill Create New Account Password field "asdaasda"
    And Fill Create New Account Password Confirmation field "asdaasda"
    And Click the Create button
    Then Account "asda" is present in Accounts list

  Scenario: Account - Creating new account from private key
    Given Login to wallet "emptyWallet" with password "11111111"
    Then Accounts page is displayed
    When Click the Create Account button
    Then Create New Account dialogue is displayed
    When Fill Create New Account Name field "from privateKey"
    And Fill Create New Account Password field "asdaasda"
    And Fill Create New Account Password Confirmation field "asdaasda"
    And Fill Private Key field "b7bacfa65397ea40b67608bf0d2b93da9bf807a4fde55f122922db2373e7f432"
    And Click the Create button
    Then Account "from privateKey" is present in Accounts list with hash "0x3195198151a456f59d39ce95dd302c5b2d034bff"
