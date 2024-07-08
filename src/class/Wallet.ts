import * as crypto from 'crypto';
import { Transaction } from './Transaction';
import { Chain } from './Chain';

export class Wallet {
  public balance: number;
  public publicKey: string;
  public privateKey: string;

  constructor(initialBalance: number = 0) {
    this.balance = initialBalance;

    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;
  }

  sendMoney(amount: number, payeePublicKey: string) {
    if (this.balance - amount < 0) {
      console.log(`cannot send ${amount} coin, not enough coin in wallet (${this.balance})`);
      return;
    }

    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);
    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();

    const signature = sign.sign(this.privateKey);

    const success = Chain.instance.addBlock(transaction, this.publicKey, signature);
    if (success) this.balance -= amount;
  }
}
