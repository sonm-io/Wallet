module.exports = {
    url: 'file://' + process.cwd() + '/dist/index.html',
    //url: 'https://sonm-io.github.io/wallet-web/',

    elements: {
        accountsForm: by.css('.sonm-login .sonm-login__center'),
        loginToWalletButton: by.className('sonm-login__wallet-login'),
        closeDialogue: by.css('.sonm-popup__inner>.sonm-popup__cross'),
        createWallet: by.xpath("//a[.='CREATE WALLET']"),
        importWallet: by.xpath("//a[.='IMPORT WALLET']"),
        walletField: by.css('.sonm-login__wallet-select > div'),
        selectedWallet: by.css('div.sonm-login__wallet-select div > div > div.sonm-select-selection-selected-value'),
        dropdownSearchField: by.css('.sonm-select-search__field__wrap > .sonm-select-search__field'),
        dropdown: by.css('div.sonm-select-selection > div'),
        dropdownValue: by.xpath("//li[@unselectable='unselectable']"),
    },

    //wait for loading start page

    waitForAccountsPage: function () {
        return shared.wdHelper.findVisibleElement(this.elements.createWallet, 15);
    },

    closeCreateNewWalletDialogue: function () {
        return shared.wdHelper.findVisibleElement(this.elements.closeDialogue).click();
    },

    //click on wallet dropdown

    clickWalletsDropdown: async function () {
        await page.common.clickDropdown(this.elements.walletField);
    },

    //search value from wallet dropdown

    searchFromWalletDropdown: async function (searchValue) {
        await page.common.enterValueForSearch(this.elements.dropdownSearchField, searchValue);
    },

    //get valets list from wallet dropdown

    getValuesFromWalletDropdown: function () {
        return page.common.getValuesFromDropdown(this.elements.dropdown, this.elements.dropdownValue);
    },

    //select value from wallet dropdown

    selectWalletFromDropdown: function (walletName) {
        return page.common.selectFromStandardDropdown(this.elements.walletField, by.xpath('//li[.="' + walletName + '"]'),
            this.elements.selectedWallet, walletName);
    },

    //clear search wallet field

    clearSearchWalletField: async function () {
        await page.common.clearInputField(this.elements.dropdownSearchField);
    },

    //click on login button for further redirect to accounts page

    clickLoginButton: function () {
        return shared.wdHelper.findVisibleElement(this.elements.loginToWalletButton).click();
    },

    //create new wallet from start page

    createWalletFromStartPage: async function () {
        await shared.wdHelper.findVisibleElement(this.elements.createWallet, 15).click();
    },

    //import wallet

    clickImportWalletButton: function () {
        return shared.wdHelper.findVisibleElement(this.elements.importWallet).click();
    },
};
