module.exports = {

    elements: {
        header: by.xpath('//form/h3'),
        password: by.xpath('//input[@name="password"]'),
        confirmation: by.xpath('//input[@name="confirmation"]'),
        name: by.xpath('//input[@name="name"]'),
        privateKey: by.xpath('//input[@name="privateKey"]'),
        createButton: by.xpath('//button[.="Create"]')
    },

    waitDialogue: function () {
        return shared.wdHelper.findVisibleElement(this.elements.header).getText()
            .then((text) => expect(text).to.equal('New account'));
    },

    fillPassword: function (password) {
        return shared.wdHelper.findVisibleElement(this.elements.password).sendKeys(password);
    },

    fillPasswordConfirmation: function (password) {
        return shared.wdHelper.findVisibleElement(this.elements.confirmation).sendKeys(password);
    },

    fillAccountName: function (name) {
        return shared.wdHelper.findVisibleElement(this.elements.name).sendKeys(name);
    },

    fillPrivateKey: function (privateKey) {
        return shared.wdHelper.findVisibleElement(this.elements.privateKey).sendKeys(privateKey);
    },

    clickCreateButton: function () {
        return shared.wdHelper.findVisibleElement(this.elements.createButton).click();
    },
};


// console.log("current dir = " + targetFile);