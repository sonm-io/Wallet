
@send
Feature: Send

  Scenario: Send snm to address without 0x
    Given Login to wallet "oneAccount" with password "11111111"
    And Navigate to send page
    When I select account from by name "1"
    And I type into send to field address "233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "0.01"
    And I select currency "SONM test token"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "1" and address is "0xc5ae7e1696b55ff6ee952fb1e1cc1a3df8acde5a"
    And Account to is equal to "233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "0.01 SNMT"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page

  Scenario: Send ethereum to address without 0x
    Given Login to wallet "oneAccount" with password "11111111"
    And Navigate to send page
    When I select account from by name "1"
    And I type into send to field address "233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "0.01"
    And I select currency "Ethereum"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "1" and address is "0xc5ae7e1696b55ff6ee952fb1e1cc1a3df8acde5a"
    And Account to is equal to "233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "0.01 Ether"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page

  Scenario: Send ethereum to address with 0x
    Given Login to wallet "oneAccount" with password "11111111"
    And Navigate to send page
    When I select account from by name "1"
    And I type into send to field address "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "0.01"
    And I select currency "Ethereum"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "1" and address is "0xc5ae7e1696b55ff6ee952fb1e1cc1a3df8acde5a"
    And Account to is equal to "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "0.01 Ether"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page

  Scenario: Send ethereum to address from account page
    Given Login to wallet "oneAccount" with password "11111111"
    When I open account "1" details
    And I click on send ethereum button
    Then I should see send page
    And I should see selected currency is "Ethereum"
    When I type into send to field address "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "0.01"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "1" and address is "0xc5ae7e1696b55ff6ee952fb1e1cc1a3df8acde5a"
    And Account to is equal to "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "0.01 Ether"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page

  Scenario: Send snm to address from account page
    Given Login to wallet "oneAccount" with password "11111111"
    When I open account "1" details
    And I click on send sonm button
    Then I should see send page
    And I should see selected currency is "SONM test token"
    When I type into send to field address "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And I set amount "0.01"
    And I click Next
    Then I should see Transfer confirmation page
    And Account from name is "1" and address is "0xc5ae7e1696b55ff6ee952fb1e1cc1a3df8acde5a"
    And Account to is equal to "0x233a526fb4b4b96809432b17d39309bae0a1513d"
    And Amount is equal to "0.01 SNMT"
    And Gas limit is equal to "defaultGasLimit"
    When I type password "11111111" into confirmation section
    And I click send button
    Then I should see Transaction has been sent page