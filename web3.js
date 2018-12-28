import Web3 from 'web3';
const secret = require('./secret.js');

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and MetaMask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server OR the user is not running MetaMask
  const provider = new Web3.providers.HttpProvider(
    secret.infura
  );
  web3 = new Web3(provider);
}

export default web3;
