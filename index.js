const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const { generateMnemonicPhrase } =require('./mnemonic');
const EthereumGenerator = require('./generators/ethereum');
const BitcoinGenerator = require('./generators/bitcoin');

let mnemonic = process.argv[2];

if(mnemonic===undefined) {
    mnemonic  = generateMnemonicPhrase();
    console.log(`Mnemonic phrase: ${mnemonic}\n`);
}

// Ethereum addresses
console.log('* Ethereum');
for (let i = 0; i < 10; i++) {
    const { address } = EthereumGenerator.generateAddress(mnemonic, i);
    const connector = (i === 9) ? '└─> ' : '├─> ';
    console.log(`${connector} #${i}: ${address}`);
}

// Bitcoin addresses
const btc = new BitcoinGenerator(mnemonic);
const types = ['P2PKH', 'P2SH', 'P2WPKH', 'P2TR'];
let   typesCounter=0;

console.log('* Bitcoin');
for (const type of types) {
    const typeConnector = (typesCounter++ === types.length-1) ? '└─> ' : '├─> ';
    console.log(`${typeConnector} ${type}`);
    for (let account = 0; account < 10; account++) {
        const accountConnector = (account === 9) ? '      └─> ' : '      ├─> ';
        console.log(`${accountConnector} Account #${account}`);
    
        for (let index = 0; index < 3; index++) {
            const address = btc.generateAddress(type, account, index);
            const addressConnector = (index === 2) ? '             └─> ' : '             ├─> ';
            console.log(`${addressConnector} ${address}`);
        }
    }
}
