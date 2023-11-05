const { Wallet } = require('ethers');

class EthereumGenerator {
    static generateAddress(mnemonic, index) {
        const path = `m/44'/60'/0'/0/${index}`;
        const wallet = Wallet.fromMnemonic(mnemonic, path);
        return {
            address: wallet.address,
            privateKey: wallet.privateKey
        };
    }
}

module.exports = EthereumGenerator;