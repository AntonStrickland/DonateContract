pragma solidity ^0.4.17;

contract Donate {

  address public admin;

  uint public currentBalance;
  uint public totalBalance;
  uint public numberOfDonations;

  modifier adminOnly() {
    require(msg.sender == admin);
    _;
  }

  constructor() public {
    admin = msg.sender;
  }

  function donate() public payable {

    // Donation must be greater than zero
    require(msg.value > 0);

    // Keep track of the balance
    currentBalance += msg.value;
    totalBalance += msg.value;

    numberOfDonations++;
  }

  function withdraw() public adminOnly {

    // Reset the tracked balance to zero
    currentBalance = 0;

    // Transfer the entire balance to the admin
    admin.transfer(address(this).balance);
  }

  function getSummary() public view returns (uint, uint, uint) {
    return ( currentBalance, totalBalance, numberOfDonations );
  }

}
