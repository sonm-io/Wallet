module.exports = {

    elements: {
        header: by.className('sonm-wallets-add-account__header'),
        selectKeystore: by.xpath('//input[@type="file"]'),
        password: by.xpath('//input[@name="password"]'),
        name: by.xpath('//input[@name="name"]'),
        addButton: by.className('sonm-wallets-add-account__submit'),
        preview: by.className('sonm-wallets-add-account__preview-ct'),
        fileField: by.xpath('//input[@type="file"]')
    },

    waitDialogue: function () {
        return shared.wdHelper.findVisibleElement(this.elements.header).getText()
            .then((text) => expect(text).to.equal('Add account'));
    },

    uploadAccountFile: function (filename = 'for_upload.json') {
        let targetFile = process.cwd() + '/features/shared_objects/' + filename;
        driver.executeScript("document.querySelector('input[type=\"file\"]').style.display = 'inline'");
        return shared.wdHelper.findVisibleElement(this.elements.fileField).sendKeys(targetFile);
    },

    findPreview: function () {
        return shared.wdHelper.findVisibleElement(this.elements.preview);
    },

    fillPassword: function (password) {
        return shared.wdHelper.findVisibleElement(this.elements.password).sendKeys(password);
    },

    fillAccountName: function (name) {
        return shared.wdHelper.findVisibleElement(this.elements.name).sendKeys(name);
    },

    clickAddButton: function () {
        return shared.wdHelper.findVisibleElement(this.elements.addButton).click();
    },

};


// console.log("current dir = " + targetFile);