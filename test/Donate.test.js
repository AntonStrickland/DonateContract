const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledContract = require('../build/Donate.json');

let accounts;
let contract;

beforeEach(async () => {

  accounts = await web3.eth.getAccounts();

  contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
  .deploy( {data: compiledContract.bytecode })
  .send( {from: accounts[0], gas: '1000000'});

});

describe('Donate', () => {

  it('deploys the contract', () => {
    assert.ok(contract.options.address);
  });

  it('marks caller as the donation receiver', async () => {
    const admin = await contract.methods.admin().call();
    assert.equal(accounts[0], admin);
  });

  it('only accepts donations greater than zero', async () => {

    try {
      await contract.methods.donate().send({
        from: accounts[1],
        value: '0',
        gas: '1000000'
      })
    } catch (error) {
      assert(error);
    }

  });

  it('lets anyone donate and only admins withdraw', async () => {

    // Send a donation from account 1 to account 0
    await contract.methods.donate().send({
      from: accounts[1],
      value: web3.utils.toWei('10', 'ether'),
      gas: '1000000'
    })

    // Withdraw the donation into account 0
    await contract.methods.withdraw().send({
      from: accounts[0],
      gas: '1000000'
    })

    let balance = await web3.eth.getBalance(accounts[0]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 109);

  });

});
