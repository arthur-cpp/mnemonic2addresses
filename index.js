const { generateMnemonicPhrase } =require('./mnemonic');
const EthereumGenerator = require('./generators/ethereum');
const BitcoinGenerator = require('./generators/bitcoin');

let param = process.argv[2];

// fix to check that mnemonics start with vanitygen: and parse number after : symbol
if(param!==undefined) {
    params = param.split(':');
    if(params[0]==='vanitygen') {
        prefix_count = params[1];
        // generate prefix
        prefix = '0x';
        for(let i=0; i<parseInt(prefix_count); i++) prefix += '0';
        console.log(`Prefix: ${prefix}`)
        // generate mnemonics and lookup for address starting with prefix
        while(true) {
            mnemonic = generateMnemonicPhrase();
            const { address } = EthereumGenerator.generateAddress(mnemonic, 0);
            console.log(`Ethereum address: ${address}`);
            if(address.startsWith(prefix)) {
                console.log(`\nMnemonic phrase: ${mnemonic}`);
                console.log(`Ethereum address: ${address}`);
                break;
            }
        }

        process.exit(0);
        return;
    }
}

// generate new mnemonic phrase and follow base logic
if(param===undefined) {
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
