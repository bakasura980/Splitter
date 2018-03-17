pragma solidity ^0.4.16;

contract Splitter {

    address public bob;
    address public carol;
    address public owner;
    mapping(address => uint) public moneyBuffer;

    event LogInit(address contractAddress);
    event LogSplittedMoney(uint splittedMoney);
    event LogWithdraw(address beneficiary, uint amount);
    event LogDestruction(address destroyer);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyPositive(uint value) {
        require(value > 0);
        _;
    }

    function Splitter(address bobsAddress, address carolsAddress) public {
        require(bobsAddress != address(0));
        require(carolsAddress != address(0));

        bob = bobsAddress;
        carol = carolsAddress;
        owner = msg.sender;

        LogInit(this);
    }

    function splitMoney() public payable onlyOwner onlyPositive(msg.value) {
        if (msg.value % 2 == 0) {
            loadSplittedMoney(msg.value / 2);
        } else {
            moneyBuffer[owner] += 1;
            loadSplittedMoney((msg.value - 1) / 2); 
        }

        LogSplittedMoney(msg.value % 2 == 0 ? msg.value / 2 : (msg.value - 1) / 2);
    }

    function loadSplittedMoney(uint splittedMoney) private {
        moneyBuffer[bob] += splittedMoney;
        moneyBuffer[carol] += splittedMoney;
    }

    function withdraw() public onlyPositive(moneyBuffer[msg.sender]) {
        uint amount = moneyBuffer[msg.sender];
        moneyBuffer[msg.sender] = 0;
        msg.sender.transfer(amount);

        LogWithdraw(msg.sender, amount);
    }

    function destroy() public onlyOwner {
        LogDestruction(msg.sender);
        selfdestruct(msg.sender);
    }
}