var Splitter = artifdacts.require("./Splitter.sol");
require("../test/assertExtensions");

contract("Splitter",  function(accounts){

    describe("tests contract's constructor", () => {
        it("should not create a contract instance with invalid input paramenters", function(){
            assert.expectThrow(Splitter.new(actualBob, // ,{from: owner}));
        });
    });
  

    describe("tests contract's methods", () => {

        let splitterInstance;
        let owner = accounts[0];
        let actualBob = accounts[1];
        let actualCarol = accounts[2];
        const evenMoney = 10;
        const oddMoney = 5;

        beforeEach(async function(){
            splitterInstance = await Splitter.new(actualBob, actualCarol ,{from: owner});
        });
    
        it("should return relevant bob's address", async function(){
            let bob = await splitterInstance.bob({from: owner});
            assert.equal(actualBob, bob, "Bob is not set correctly");
        });
    
        it("should return relevant carol's address", async function(){
            let bob = await splitterInstance.carol({from: owner});
            assert.equal(actualCarol, bob, "Carol is not set correctly");
        });
    
        it("should be owned by owner", async function(){
            let sender = await splitterInstance.sender({from: owner});
            assert.equal(sender, owner, "Owner is not set correctly");
        });
    
        it("should proccess even splitting", function(){
            let bobsBalance = web3.eth.getBalance().toNumber();
            let catolsBalance = web3.eth.getBalance().toNumber();
            let contractBalance = web3.eth.getBalance().toNumber();
    
            await splitterInstane.splitMoney({from: owner, value: evenMoney});
    
            let bobsCurrentBalance = web3.eth.getBalance().toNumber();
            let catolsCurrentBalance = web3.eth.getBalance().toNumber();
            let contractCurrentBalance = web3.eth.getBalance().toNumber();
    
            assert.strictEqual(bobsBalance, bobsCurrentBalance - evenMoney / 2, "Bob's balance after even splitting is wrong");
            assert.strictEqual(catolsBalance, catolsCurrentBalance - evenMoney / 2, "Carol's balance after even splitting is wrong");
            assert.strictEqual(contractBalance, contractCurrentBalance, "Contract's balance after even splitting is wrong");
        });
    
        // function getBalance(){
    
        // }
    
        it("should proccess odd splitting", function(){
            let bobsBalance = web3.eth.getBalance().toNumber();
            let catolsBalance = web3.eth.getBalance().toNumber();
            let contractBalance = web3.eth.getBalance().toNumber();
    
            await splitterInstane.splitMoney({from: owner, value: oddMoney});
    
            let bobsCurrentBalance = web3.eth.getBalance().toNumber();
            let catolsCurrentBalance = web3.eth.getBalance().toNumber();
            let contractCurrentBalance = web3.eth.getBalance().toNumber();
    
            assert.strictEqual(bobsBalance, bobsCurrentBalance - (oddMoney - 1) - 2, "Bob's balance after odd splitting is wrong");
            assert.strictEqual(catolsBalance, catolsCurrentBalance - (oddMoney - 1) / 2, "Carol's balance after odd splitting is wrong");
            assert.strictEqual(contractBalance + 1, contractCurrentBalance, "Contract's balance after odd splitting is wrong");
        });

        it("should not proccess splitting if the transaction sender is not the owner", function(){
            assert.expectThrow(splitterInstane.splitMoney({from: bob, value: evenMoney}));
        });

        it("should not proccess splitting unless the sending value is higher than zero", function(){
            assert.expectThrow(splitterInstane.splitMoney({from: owner, value: 0}));
        });
    });
});