module.exports = {
    elements: {
        sendTab: by.xpath('//li[.="Send"]'),
        logoutButton: by.xpath('//a[@href="#exit"]'),
        addTokenButton: by.xpath('//a[.="+ ADD TOKEN"]'),
        exportWalletButton: by.css('sonm-accounts__export-wallet-button'),
        importAccountButton: by.xpath('//button[.="IMPORT ACCOUNT"]'),
        createNewAccountButton: by.xpath('//button[.="CREATE ACCOUNT"]'),
        walletsHeader: by.className('sonm-wallets__header'),
        balanceHeader: by.className('sonm-currency-balance-list__header'),
        accountNames: by.className('sonm-account-item__name-text'),
        myFundsList: by.css('.sonm-currency-balance-list__list'),
        fundItem: by.css('.sonm-currency-balance-list__list .sonm-balance__symbol',),
    },

    //TODO add copy, download, show private key functions

    //wait for load accounts page according to displayed import account button

    waitForAccountPageLoading: async function () {
        return await shared.wdHelper.findVisibleElement(this.elements.importAccountButton);
    },

    //verify that send tab is disabled

    checkSendTabIsDisabled: async function () {
        return await page.common.checkElementIsDisabled(this.elements.sendTab, 'cursor', 'not-allowed');
    },

    //logout from wallet

    logoutFromWallet: async function () {
        return (await shared.wdHelper.findVisibleElement(this.elements.logoutButton)).click();
    },

    //click on import account button for further account import

    importAccount: async function () {
        return (await shared.wdHelper.findVisibleElement(this.elements.importAccountButton)).click();
    },

    //click on create account button for further account creating

    createNewAccount: async function () {
        return (await shared.wdHelper.findVisibleElement(this.elements.createNewAccountButton)).click();
    },

    //click on add token button for further new token creating

    addToken: async function () {
        return (await shared.wdHelper.findVisibleElement(this.elements.addTokenButton)).click();
    },

    //verify that created token is displayed in the token list

    findTokenInList: function (createdToken) {
        return shared.wdHelper.findVisibleElements(this.elements.fundItem)
            .then(elements => expect(elements.getText().to.equal(createdToken)));
    },

    //find account by name in the list

    findAccountInList: function (name) {
        return shared.wdHelper.findVisibleElements(by.xpath('//span[@class="sonm-account-item__name-text"][.="' + name + '"]'))
            .then(elements => expect(elements.length).to.equal(1));
    },

    //find account by name and hash in the list

    findAccountInListWithHash: function (name, hash) {
        return shared.wdHelper.findVisibleElements(
            by.xpath('//span[@class="sonm-account-item__name-text"][.="' + name + '"]/../../' +
                'a[@href="#' + hash + '"]'))
            .then(elements => expect(elements.length).to.equal(1));
    },

    //click on account from the list

    clickOnAccountInList: function (accountName) {
        return shared.wdHelper.findVisibleElement(
            by.xpath('//div[@class="sonm-deletable-item__children"][.//span[contains(text(), "' + accountName + '")]]//a[@href="#"]'))
            .click();
    },

    //click on edit account name button

    clickOnEditCreatedAccountNameButton: function (accountName) {
        return shared.wdHelper.findVisibleElement(by.xpath('//span[.=' + accountName + ']/button')).click();
    },

    //edit account name

    editCreatedAccountName: function (accountName, newAccountName) {
        return shared.wdHelper.findVisibleElement(by.xpath('//span[.=' + accountName + ']/input')).sendKeys(newAccountName);
    },
};
