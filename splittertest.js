var Splitter = artifdacts.require("./Splitter.sol");
require("../test/assertExtensions");

contract("Splitter",  function(accounts){

    describe("tests contract's constructor", () => {
        it("should not create a contract instance with invalid input paramenters", function(){
            assert.expectThrow(Splitter.new(accounts[0],  //,{from: owner}));
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
            assert.strictEqual(actualBob, bob, "Bob is not set correctly");
        });
    
        it("should return relevant carol's address", async function(){
            let carol = await splitterInstance.carol({from: owner});
            assert.strictEqual(actualCarol, carol, "Carol is not set correctly");
        });
    
        it("should be owned by owner", async function(){
            let sender = await splitterInstance.sender({from: owner});
            assert.strictEqual(sender, owner, "Owner is not set correctly");
        });
    
        it("should proccess even splitting", function(){
            processSplitting((bobsBalance, carolsBalance, contractBalance) => {
                assert.strictEqual(bobsBalance.beforeSplitting, bobsBalance.afterSplitting - (evenMoney / 2), "Bob's balance after even splitting is incorrect");
                assert.strictEqual(catolsBalance.beforeSplitting, carolsBalance.afterSplitting - (evenMoney / 2), "Carol's balance after even splitting is incorrect");
                assert.strictEqual(contractBalance.beforeSplitting, contractBalance, "Contract's balance after even splitting is incorrect");
            });
        });
    
        it("should proccess odd splitting", function(){
            processSplitting((bobsBalance, carolsBalance, contractBalance) => {
                assert.strictEqual(bobsBalance.beforeSplitting, bobsBalance.afterSplitting - (oddMoney - 1) / 2, "Bob's balance after odd splitting is incorrect");
                assert.strictEqual(catolsBalance.beforeSplitting, carolsBalance.afterSplitting -  (oddMoney - 1) / 2, "Carol's balance after odd splitting is incorrect");
                assert.strictEqual(contractBalance.beforeSplitting, contractBalance - 1, "Contract's balance after odd splitting is incorrect");
            });
        });

         function processSplitting(next){
            let bobsBalance = { beforeSplitting: 0, afterSplitting: 0};
            let carolsBalance = { beforeSplitting: 0, afterSplitting: 0};
            let contractBalance = { beforeSplitting: 0, afterSplitting: 0};

            bobsBalance.beforeSplitting = web3.eth.getBalance().toNumber();
            carolsBalance.beforeSplitting = web3.eth.getBalance().toNumber();
            contractBalance.beforeSplitting = web3.eth.getBalance().toNumber();
    
            await splitterInstane.splitMoney({from: owner, value: evenMoney});
    
            bobsCurrentBalance.afterSplitting = web3.eth.getBalance().toNumber();
            carolsBalance.afterSplitting = web3.eth.getBalance().toNumber();
            contractCurrentBalance.afterSplitting = web3.eth.getBalance().toNumber();

            next(bobsBalance, carolsBalance, contractBalance);
        }

        it("should not proccess splitting if the transaction sender is not the owner", function(){
            assert.expectThrow(splitterInstane.splitMoney({from: bob, value: evenMoney}));
        });

        it("should not proccess splitting unless the sending value is higher than zero", function(){
            assert.expectThrow(splitterInstane.splitMoney({from: owner, value: 0}));
        });
    });
});
