# ./front-tests/features/test.feature

@wallet
Feature: Start screen

  Scenario: Correct login - one account
    Given I open wallet with one existing wallet
    When I click I Understand button
    And I type password "11111111"
    Then I see accounts page
    And Send link tab is disabled
    When I press logout button
    Then I log out from wallet

  Scenario: Creating wallet with empty storage
    Given I open wallet with empty storage
    When I click I Understand button
    When I create wallet with name "test" and password "11111111" and password confirmation "11111111"
    And I click Create New Wallet button
    Then I see accounts page
    When I press logout button
    Then I log out from wallet

  Scenario: Creating wallet - add second wallet
    Given I open wallet with one existing wallet
    When I click I Understand button
    When I close password dialogue
    And I press Create wallet
    And I create wallet with name "test2" and password "11111111" and password confirmation "11111111"
    And I click Create New Wallet button
    Then I see accounts page
    When I press logout button
    Then I log out from wallet

  Scenario: Creating wallet - existing wallet name validation
    Given I open wallet with one existing wallet
    When I click I Understand button
    And I close password dialogue
    When I press Create wallet
    Then I fill wallet name field "empty"
    When I click Create New Wallet button
    Then I see wallet name validation error message "Already exist"

  Scenario: Login with existing wallet without displaying disclaimer in future
    Given I open wallet with one existing wallet
    When I click on dont show disclaimer again button
    When I type password "11111111"
    Then I see accounts page
    And Send link tab is disabled
    When I press logout button
    Then I log out from wallet and see enter password popup

  Scenario: Login to wallet - incorrect password
    Given I open wallet with one existing wallet
    When I click I Understand button
    When I type password "22#435asds2"
    Then I should see password field validation error

  Scenario: Creating wallet - fields validation
    Given I open wallet with empty storage
    When I click I Understand button
    When I click Create New Wallet button
    Then I see wallet name validation error message "Name length must be in range 1..20"
    And I fill wallet name field "autotest"
    When I click Create New Wallet button
    Then I see wallet password validation error message
    And I fill password field "122"
    When I click Create New Wallet button
    Then I see wallet confirm password validation error message
    And I fill confirm password name field "22"
    And I click Create New Wallet button
    Then I see wallet confirm password validation error message
    And I clear confirm password field
    And I fill confirm password name field "122"
    And Select network for wallet "rinkeby"
    And I click Create New Wallet button
    Then I see accounts page
    When I press logout button
    Then I log out from wallet

  Scenario: Login to wallet - search wallet from list and further login
    Given I have three wallet accounts
    When I click I Understand button
    When I enter value "t" into account search field for search accounts
    Then I get wallets search results "['test','tAlex','45te']"
    When I enter value "45" into account search field for search accounts
    Then I get wallets search results "['45te']"
    When I select wallet name "45te" from dropdown
    And I click login button
    And I type password "1"
    Then I see accounts page
    And Send link tab is disabled
    When I press logout button
    Then I log out from wallet