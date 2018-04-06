
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

  Scenario: Account - Creating new account - fields validation
    Given Login to wallet "emptyWallet" with password "11111111"
    Then Accounts page is displayed
    When Click the Create Account button
    Then Create New Account dialogue is displayed
    When Click the Create button
    Then Create New Account Name field validation error message is displayed
    And Create New Account Password field validation error message "Password is required" is displayed
    And Fill Create New Account Name field "test"
    And Fill Create New Account Password field "1"
    When Click the Create button
    Then Create New Account Password field validation error message "Password must be at least 8 character" is displayed
    And Create New Account Password Confirmation field validation error message is displayed
    And Clear Create New Account Password field
    And Fill Create New Account Password field "12345678"
    And Fill Create New Account Password Confirmation field "12345678"
    When Click the Create button
    Then Account "test" is present in Accounts list

  Scenario: Account - Editing Account name
    Given Login to wallet "with2accounts" with password "1" with Two Accounts
    Then Accounts page is displayed
    And Click the Edit Account button next to "Test Account" Name
    And Clear Account Name field
    And Fill Account "Test Account" Name field with new "Edit Account" Name
    When Press ENTER button
    Then Account Name is "Edit Account" is present in Accounts list

  Scenario: Account - Editing Account name - Empty name
    Given Login to wallet "with2accounts" with password "1" with Two Accounts
    Then Accounts page is displayed
    And Click the Edit Account button next to "Test Account" Name
    And Clear Account Name field
    When Press ENTER button
    Then Account Name is "Test Account" is present in Accounts list

  Scenario: Account - Delete Account
    Given Login to wallet "with2accounts" with password "1" with Two Accounts
    Then Accounts page is displayed
    When Click the Delete Account button next to "Some Account" Name
    Then Delete Account dialogue is displayed
    And Account "Some Account" Name for Delete is correct
    When Click the Delete Account button
    Then Account "Some Account" is not present in Accounts list

  Scenario: Account - Delete Account - Cancel
    Given Login to wallet "with2accounts" with password "1" with Two Accounts
    Then Accounts page is displayed
    When Click the Delete Account button next to "Some Account" Name
    Then Delete Account dialogue is displayed
    And Account "Some Account" Name for Delete is correct
    When Click the Cancel Delete Account button
    Then Account Name is "Some Account" is present in Accounts list

  Scenario: Import Account - Cancel
    Given Login to wallet "with2accounts" with password "1" with Two Accounts
    Then Accounts page is displayed
    When Click the Import Account button
    Then Add Account dialogue is displayed
    When Keystore file "for_upload.json" is selected for upload
    Then Account Preview is displayed
    And Fill Import Account Name field "acc name"
    And Fill Import Account Password field "11111111"
    When Close Import Account dialogue
    Then Account was not created
    When Click the Import Account button
    Then Accounts page is displayed
    Then All Import Account Dialogue fields are empty
