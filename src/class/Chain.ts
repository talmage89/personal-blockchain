import * as crypto from 'crypto';
import { Block } from './Block';
import { Transaction } from './Transaction';
import { Wallet } from './Wallet';

export class Chain {
  public static instance = new Chain();

  chain: Block[];
  public creator: Wallet;

  constructor() {
    const genesisWallet = new Wallet();
    const genesisTransaction = new Transaction(100, genesisWallet.publicKey, genesisWallet.publicKey);
    const genesisBlock = new Block(null, genesisTransaction);
    this.chain = [genesisBlock];
    this.creator = genesisWallet;
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer): boolean {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(transaction.toString());

    const isValid = verifier.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
      return true;
    }

    return false;
  }

  mine(nonce: number) {
    let solution = 1;
    console.log('⛏️ mining...');

    while (true) {
      const hash = crypto.createHash('MD5');
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');

      if (attempt.slice(0, 4) === '0000') {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }
}
