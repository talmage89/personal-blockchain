import { Chain } from './class/Chain';

const creator = Chain.instance.creator;

console.log('Public key:');
console.log(creator.publicKey);
console.log('Private key:');
console.log(creator.privateKey);
console.log('DO NOT SHARE YOUR PRIVATE KEY WITH ANYONE.');
console.log('Chain has been instantiated.');
