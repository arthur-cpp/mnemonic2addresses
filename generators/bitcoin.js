const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

const bip32 = BIP32Factory(ecc);
bitcoin.initEccLib(ecc);

/* Bitcoin Address Types Table
+--------+---------+------------------------+-----------------+
| Type   | Prefix  | Path                   | Name            |
+--------+---------+------------------------+-----------------+
| P2PKH  | 1...    | m/44'/0'/0'/0/index    | Legacy          |
| P2SH   | 3...    | m/49'/0'/0'/0/index    | Script          |
| P2WPKH | bc1q... | m/84'/0'/0'/0/index    | Bech32 / SegWit |
| P2TR   | bc1p... | m/86'/0'/0'/0/index    | Taproot         |
+--------+---------+------------------------+-----------------+
*/
class BitcoinGenerator {

    constructor(mnemonic) {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        this.node = bip32.fromSeed(seed);
    }

    generateAddress(type, account, index) {
        const child = this.node.derivePath(`m/44'/0'/${account}'/0/${index}`);
        let   address;

        switch(type) {
            case 'P2PKH':
                ({ address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: bitcoin.networks.bitcoin }));
                break;
            case 'P2SH':
                ({ address } = bitcoin.payments.p2sh({
                    redeem: bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: bitcoin.networks.bitcoin }),
                    network: bitcoin.networks.bitcoin
                  }));
                break;
            case 'P2WPKH':
                ({ address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: bitcoin.networks.bitcoin }));
                break;
            case 'P2TR':
                const xOnlyPubkey = child.publicKey.subarray(1, 33);
                ({ address } = bitcoin.payments.p2tr({ pubkey: xOnlyPubkey, network: bitcoin.networks.bitcoin }));
                break;
        }

        return address;
    }
}

module.exports = BitcoinGenerator;