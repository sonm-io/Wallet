module.exports = {

    elements: {
        nwName: by.xpath('//input[@name="newName"]'),
        nwPass: by.xpath('//input[@name="newPassword"]'),
        nwPassConfirm: by.xpath('//input[@name="confirmation"]'),
        createNewWallet: by.className('sonm-login__create')
    },

    fillNewWalletDialogue: function (name, pass, confirm) {
        shared.wdHelper.findVisibleElement(this.elements.nwName).sendKeys(name);
        shared.wdHelper.findVisibleElement(this.elements.nwPass).sendKeys(pass);
        return  shared.wdHelper.findVisibleElement(this.elements.nwPassConfirm).sendKeys(confirm);

    },
    confirmCreateNewWallet: function () {
        return  shared.wdHelper.findVisibleElement(this.elements.createNewWallet, 15).click();
    }
};