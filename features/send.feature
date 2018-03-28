
@send
Feature: Send

  Scenario: Send snm to address without 0x
    Given Login to wallet "oneAccount" with password "11111111"
    And Navigate to Send page
    When Account "one-account" is selected From Accounts dropdown
    And Fill Send To address field "233a526fb4b4b96809432b17d39309bae0a1513d"
    And Fill Amount field "123"
    And Select currency "SONM"
    And Click the Next button
    Then Transfer Confirmation page is displayed
    And Account From Name is "one-account" and Address is "0x53b14178576e5597a0ab529ba8ba46166599c3af" is displayed
    And Account to is equal to "233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "123 SNM"
    And Gas limit is equal to "defaultGasLimit"
    When Fill Account Password field "11111111"
    And Click the Send button
    Then Transaction Completed page is displayed
    And Notification contained text "123 SNM has been sent to the address" is displayed
    And Close Notification

  Scenario: Send ethereum to address without 0x
    Given Login to wallet "oneAccount" with password "11111111"
    And Navigate to Send page
    When Account "one-account" is selected From Accounts dropdown
    And Fill Send To address field "233a526fb4b4b96809432b17d39309bae0a1513d"
    And Fill Amount field "321"
    And Select currency "Ethereum"
    And Click the Next button
    Then Transfer Confirmation page is displayed
    And Account From Name is "one-account" and Address is "0x53b14178576e5597a0ab529ba8ba46166599c3af" is displayed
    And Account to is equal to "233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "321 Ether"
    And Gas limit is equal to "defaultGasLimit"
    When Fill Account Password field "11111111"
    And Click the Send button
    Then Transaction Completed page is displayed
    And Notification contained text "321 Ether has been sent to the address" is displayed
    And Close Notification

  Scenario: Send ethereum to address with 0x
    Given Login to wallet "oneAccount" with password "11111111"
    And Navigate to Send page
    When Account "one-account" is selected From Accounts dropdown
    And Fill Send To address field "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Fill Amount field "132"
    And Select currency "Ethereum"
    And Click the Next button
    Then Transfer Confirmation page is displayed
    And Account From Name is "one-account" and Address is "0x53b14178576e5597a0ab529ba8ba46166599c3af" is displayed
    And Account to is equal to "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "132 Ether"
    And Gas limit is equal to "defaultGasLimit"
    When Fill Account Password field "11111111"
    And Click the Send button
    Then Transaction Completed page is displayed
    And Notification contained text "132 Ether has been sent to the address" is displayed
    And Close Notification

  Scenario: Send ethereum to address from account page
    Given Login to wallet "oneAccount" with password "11111111"
    When Open Account "one-account" details
    And Click the Send Ethereum button
    Then Send page is displayed
    And Selected Currency "Ethereum" is displayed
    When Fill Send To address field "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Fill Amount field "312"
    And Click the Next button
    Then Transfer Confirmation page is displayed
    And Account From Name is "one-account" and Address is "0x53b14178576e5597a0ab529ba8ba46166599c3af" is displayed
    And Account to is equal to "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "312 Ether"
    And Gas limit is equal to "defaultGasLimit"
    When Fill Account Password field "11111111"
    And Click the Send button
    Then Transaction Completed page is displayed
    And Notification contained text "312 Ether has been sent to the address" is displayed
    And Close Notification

  Scenario: Send snm to address from account page
    Given Login to wallet "oneAccount" with password "11111111"
    When Open Account "one-account" details
    And Click the Send Sonm button
    Then Send page is displayed
    And Selected Currency "SONM" is displayed
    When Fill Send To address field "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Fill Amount field "313"
    And Click the Next button
    Then Transfer Confirmation page is displayed
    And Account From Name is "one-account" and Address is "0x53b14178576e5597a0ab529ba8ba46166599c3af" is displayed
    And Account to is equal to "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "313 SNM"
    And Gas limit is equal to "defaultGasLimit"
    When Fill Account Password field "11111111"
    And Click the Send button
    Then Transaction Completed page is displayed
    And Notification contained text "313 SNM has been sent to the address" is displayed
    And Close Notification