const { utils } = require('ethers');

/**
 * 
 * @returns string
 */
function generateMnemonicPhrase() {
    const entropy = utils.randomBytes(32);
    phrase  = utils.entropyToMnemonic(entropy);
    return phrase;
}

module.exports = { generateMnemonicPhrase };