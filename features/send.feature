
@send
Feature: Send

  Scenario: Send snm to address without 0x
    Given Login to wallet "oneAccount" with password "11111111"
    And Navigate to send page
    When I select account from by name "one-account"
    And I type into send to field address "233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "123"
    And I select currency "SONM"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "one-account" and address is "0x53b14178576e5597a0ab529ba8ba46166599c3af"
    And Account to is equal to "233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "123 SNM"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page
    And I should see notification contained text "123 SNM has been sent to the address"
    And I close notification

  Scenario: Send ethereum to address without 0x
    Given Login to wallet "oneAccount" with password "11111111"
    And Navigate to send page
    When I select account from by name "one-account"
    And I type into send to field address "233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "321"
    And I select currency "Ethereum"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "one-account" and address is "0x53b14178576e5597a0ab529ba8ba46166599c3af"
    And Account to is equal to "233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "321 Ether"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page
    And I should see notification contained text "321 Ether has been sent to the address"
    And I close notification

  Scenario: Send ethereum to address with 0x
    Given Login to wallet "oneAccount" with password "11111111"
    And Navigate to send page
    When I select account from by name "one-account"
    And I type into send to field address "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "132"
    And I select currency "Ethereum"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "one-account" and address is "0x53b14178576e5597a0ab529ba8ba46166599c3af"
    And Account to is equal to "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "132 Ether"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page
    And I should see notification contained text "132 Ether has been sent to the address"
    And I close notification

  Scenario: Send ethereum to address from account page
    Given Login to wallet "oneAccount" with password "11111111"
    When I open account "one-account" details
    And I click on send ethereum button
    Then I should see send page
    And I should see selected currency is "Ethereum"
    When I type into send to field address "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "312"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "one-account" and address is "0x53b14178576e5597a0ab529ba8ba46166599c3af"
    And Account to is equal to "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "312 Ether"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page
    And I should see notification contained text "312 Ether has been sent to the address"
    And I close notification

  Scenario: Send snm to address from account page
    Given Login to wallet "oneAccount" with password "11111111"
    When I open account "one-account" details
    And I click on send sonm button
    Then I should see send page
    And I should see selected currency is "SONM"
    When I type into send to field address "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "313"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "one-account" and address is "0x53b14178576e5597a0ab529ba8ba46166599c3af"
    And Account to is equal to "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "313 SNM"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page
    And I should see notification contained text "313 SNM has been sent to the address"
    And I close notification