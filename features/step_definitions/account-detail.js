module.exports = function() {
    this.When(/^I click on send ethereum button$/, function() {
        return page.accountDetailPage.clickSendEthereum();
    });

    this.When(/^I click on send sonm button$/, function() {
        return page.accountDetailPage.clickSendSnm();
    });
};
