const secret = require('./secret.js');

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const compiledContract = require('./build/Donate.json');

const provider = new HDWalletProvider(
  secret.mnemonic,
  secret.infura
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account ', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
  .deploy ({data: '0x' + compiledContract.bytecode})
  .send({gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};

deploy();
