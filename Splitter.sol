pragma solidity ^0.4.13;

contract Splitter {

    address public bob;
    address public carol;
    address public sender;

    modifier onlyOwner() {
        require(msg.sender == sender);
        _;
    }

    modifier onlyPositiveSend() {
        require(msg.value > 0);
        _;
    }

    function Splitter(address bobsAddress, address carolsAddress) public {
        validateAddress(bobsAddress);
        validateAddress(carolsAddress);

        bob = bobsAddress;
        carol = carolsAddress;
        sender = msg.sender;
    }

    function validateAddress(address _address) private constant {
        require(_address != address(0));
    }

    function splitMoney() public payable onlyOwner onlyPositiveSend {
        if (msg.value % 2 == 0) {
            transferMoney(msg.value / 2);
        } else {
            transferMoney((msg.value - 1) / 2);
        }
    }

    function transferMoney(uint money) private {
        bob.transfer(money);
        carol.transfer(money);
    }

    function destroy() public returns (bool) {
        require(msg.sender == sender);
        selfdestruct(sender);
        return true;
    }
}