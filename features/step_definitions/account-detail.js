module.exports = function() {
    this.When(/^Click the Send Ethereum button$/, function() {
        return page.accountDetailPage.clickSendEthereum();
    });

    this.When(/^Click the Send Sonm button$/, function() {
        return page.accountDetailPage.clickSendSnm();
    });
};
