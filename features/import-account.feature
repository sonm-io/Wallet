
@importaccount
Feature: Start screen

  Scenario: Import Account - invalid file
    Given Login to wallet "emptyWallet" with password "11111111"
    Then Accounts page is displayed
    When Click the Import Account button
    Then Add Account dialogue is displayed
    When Keystore file "incorrect_file.json" is selected for upload
    Then Import Account File field validation error message is displayed
    When Keystore file "for_upload.json" is selected for upload
    Then Account Preview is displayed
    When Fill Import Account Name field "import acc"
    When Fill Import Account Password field "11111111"
    And Click the Add button
    Then Account "import acc" is present in Accounts list

  Scenario: Import Account - Add first account from file
    Given Login to wallet "emptyWallet" with password "11111111"
    Then Accounts page is displayed
    When Click the Import Account button
    Then Add Account dialogue is displayed
    When Keystore file "for_upload.json" is selected for upload
    Then Account Preview is displayed
    When Fill Import Account Name field "acc name"
    When Fill Import Account Password field "11111111"
    And Click the Add button
    Then Account "acc name" is present in Accounts list

  Scenario: Import Account - fields validation
    Given Login to wallet "emptyWallet" with password "11111111"
    Then Accounts page is displayed
    When Click the Import Account button
    Then Add Account dialogue is displayed
    When Keystore file "for_upload.json" is selected for upload
    And Click the Add button
    Then Import Account Name field validation error message is displayed
    Then Import Account Password validation error message "Password is required" is displayed
    And Fill Import Account Name field "import acc test"
    And Fill Import Account Password field "2"
    And Click the Add button
    Then Import Account Password validation error message "Password is not valid" is displayed
    And Clear Import Account Password Field
    And Fill Import Account Password field "11111111"
    And Click the Add button
    Then Account "import acc test" is present in Accounts list
