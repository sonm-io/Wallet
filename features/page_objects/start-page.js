module.exports = {
    url: 'file://' + process.cwd() + '/dist/index.html',
    //url: 'https://sonm-io.github.io/wallet-web/',

    elements: {
        accountsForm: by.css('.sonm-login__center .sonm-login__logo'),
        loginToWalletButton: by.className('sonm-login__wallet-login'),
        closeDialogue: by.css('.sonm-popup__inner>.sonm-popup__cross'),
        createWallet: by.xpath('//div/a[@href="#create"]'),
        importWallet: by.xpath("//a[.='IMPORT WALLET']"),
        walletField: by.css('.sonm-login__wallet-select > div'),
        selectedWallet: by.css(
            'div.sonm-login__wallet-select div > div > div.sonm-select-selection-selected-value',
        ),
        dropdownSearchField: by.css(
            '.sonm-select-search__field__wrap > .sonm-select-search__field',
        ),
        dropdown: by.css('div.sonm-select-selection > div'),
        dropdownValue: by.xpath("//li[@unselectable='unselectable']"),
    },

    //wait for loading start page

    waitForAccountsPage: async function() {
        console.log(
            await shared.wdHelper.findVisibleElement(
                this.elements.accountsForm,
            ),
        );
        return await shared.wdHelper.findVisibleElement(
            this.elements.accountsForm,
        );
    },

    closeCreateNewWalletDialogue: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.closeDialogue,
        )).click();
    },

    //click on wallet dropdown

    clickWalletsDropdown: async function() {
        return await page.common.clickDropdown(this.elements.walletField);
    },

    //search value from wallet dropdown

    searchFromWalletDropdown: async function(searchValue) {
        return await page.common.enterValueForSearch(
            this.elements.dropdownSearchField,
            searchValue,
        );
    },

    //get valets list from wallet dropdown

    getValuesFromWalletDropdown: async function() {
        return await page.common.getValuesFromDropdown(
            this.elements.dropdown,
            this.elements.dropdownValue,
        );
    },

    //select value from wallet dropdown

    selectWalletFromDropdown: function(walletName) {
        return page.common.selectFromStandardDropdown(
            this.elements.walletField,
            by.xpath('//li[.="' + walletName + '"]'),
            this.elements.selectedWallet,
            walletName,
        );
    },

    //clear search wallet field

    clearSearchWalletField: async function() {
        return await page.common.clearInputField(
            this.elements.dropdownSearchField,
        );
    },

    //click on login button for further redirect to accounts page

    clickLoginButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.loginToWalletButton,
        )).click();
    },

    //create new wallet from start page

    createWalletFromStartPage: async function() {
        console.log(
            await shared.wdHelper.findVisibleElement(
                this.elements.createWallet,
            ),
        );
        return (await shared.wdHelper.findVisibleElement(
            this.elements.createWallet,
        )).click();
        // console.log(el);
        // return await el.click();
    },

    //import wallet

    clickImportWalletButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.importWallet,
        )).click();
    },
};
