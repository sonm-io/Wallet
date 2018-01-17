module.exports = {

    elements: {
        password: by.className('sonm-login__input'),
        loginButton: by.className('sonm-login__create'),
        closeDialogueButton: by.className('sonm-popup__cross')
    },

    enterPassword: function (password) {
        return shared.wdHelper.findVisibleElement(this.elements.password).sendKeys(password);
    },

    clickLogin: function () {
        return shared.wdHelper.findVisibleElement(this.elements.loginButton).click();
    },

    closeDialogue: function () {
        return shared.wdHelper.findVisibleElement(this.elements.closeDialogueButton).click();
    }
};