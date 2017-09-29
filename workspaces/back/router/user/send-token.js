'use strict';

module.exports = async function (api, data) {
    const result = await api.sendToken(data.to, data.amount);

    if ( result ) {
        return {
            success: true,
        }
    } else {
        return {
            error: 'send_token_false',
        }
    }
};