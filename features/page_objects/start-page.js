module.exports = {

    url: 'file://' + process.cwd() + '/docs/index.html',

    elements: {
        searchField: by.className('sonm-select-search__field'),
        firstLoginButton: by.className('sonm-login__wallet-login'),
        addWallet: by.className('sonm-login__add-wallet')
    },

    loginToWalletByTypingMultipleWallets: function () {

    },

    clickLogin: function (password) {

    },

    clickAddWallet: function () {
        return shared.wdHelper.findVisibleElement(this.elements.addWallet).click();
    }
};