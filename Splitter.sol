pragma solidity ^0.4.13;

contract Splitter {

    address public bob;
    address public carol;
    address public sender;
    bool    private isMoneySend;

    modifier validateAddresses(address _address1, address _address2) {
        require(toBeValidAddress(_address1));
        require(toBeValidAddress(_address2));
        _;
    }

    function toBeValidAddress(address _address) constant private returns(bool isValid) {
        return _address != 0x00000000000000000000000000000000000000;
    }
   
    function Splitter(address bobsAddress, address carolsAddress) 
        public validateAddresses(bobsAddress, carolsAddress)
    {
        bob = bobsAddress;
        carol = carolsAddress;
        sender = msg.sender;
        isMoneySend = false;
    }

    function sendMoney() public payable returns(bool isSuccessful) {
        if (msg.value <= 0) {
            throw;
        }

        sendHalfMoneyTo(msg.value, bob);
        isMoneySend = false;
        sendHalfMoneyTo(msg.value, carol);

        return isMoneySend;
    }

    function sendHalfMoneyTo(uint money, address moneyTaker) private {

        if (isMoneySend) {
            throw;
        }
        isMoneySend = true;

        if (!moneyTaker.send(money / 2)) {
            isMoneySend = false;
            throw;
        } 
    }

    function destroy() public returns (bool) {
        require(msg.sender == sender);
        selfdestruct(sender);
        return true;
    }
}