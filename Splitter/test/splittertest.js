var Splitter = artifacts.require("./Splitter.sol");
require("../test/assertExtensions");

contract("Splitter",  function(accounts){

    let owner = accounts[0];
    
    describe("tests contract's constructor", () => {
        it("should not create a contract instance with invalid input paramenters", function(){
            let zeroAddress = 0x0000000000000000000000000000000000000000;
            
            assert.expectRevert(Splitter.new(accounts[0], zeroAddress, {from: owner}));
        });
    });
  
    let splitterInstance;

    describe("tests contract's methods", () => {

        let actualBob = accounts[1];
        let actualCarol = accounts[2];
        const evenMoney = 3000;
        const oddMoney = 3001;

        before(async function(){
            splitterInstance = await Splitter.new(actualBob, actualCarol, {from: owner});
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
            let sender = await splitterInstance.owner({from: owner});
            assert.strictEqual(sender, owner, "Owner is not set correctly");
        });
    
        it("should proccess even splitting", async function(){
            await processSplitting(evenMoney, (bobsBalance, carolsBalance) => {
                assert(bobsBalance.beforeSplitting.eq(bobsBalance.afterSplitting.minus(evenMoney / 2)), "Bob's balance after even splitting is incorrect");
                assert(carolsBalance.beforeSplitting.eq(carolsBalance.afterSplitting.minus(evenMoney / 2)), "Carol's balance after even splitting is incorrect");
            });
        });
    
        it("should proccess odd splitting", async function(){
            await processSplitting(oddMoney, (bobsBalance, carolsBalance) => {
                assert(bobsBalance.beforeSplitting.eq(bobsBalance.afterSplitting.minus((oddMoney - 1) / 2)), "Bob's balance after odd splitting is incorrect");
                assert(carolsBalance.beforeSplitting.eq(carolsBalance.afterSplitting.minus((oddMoney - 1) / 2)), "Carol's balance after odd splitting is incorrect");
            });
        });

        async function processSplitting(moneyAmount, next){
            let bobsBalance = { beforeSplitting: 0, afterSplitting: 0};
            let carolsBalance = { beforeSplitting: 0, afterSplitting: 0};

            bobsBalance.beforeSplitting = await splitterInstance.moneyBuffer.call(actualBob);
            carolsBalance.beforeSplitting =  await splitterInstance.moneyBuffer.call(actualCarol);

            await splitterInstance.splitMoney({from: owner, value: moneyAmount});
    
            bobsBalance.afterSplitting = await splitterInstance.moneyBuffer.call(actualBob);
            carolsBalance.afterSplitting = await splitterInstance.moneyBuffer.call(actualCarol);

            next(bobsBalance, carolsBalance);
        }

        it("should not proccess splitting if the transaction sender is not the owner", async function(){
            assert.expectRevert(splitterInstance.splitMoney({from: actualBob, value: evenMoney}));
        });

        it("should not proccess splitting unless the sending value is higher than zero", async function(){
            assert.expectRevert(splitterInstance.splitMoney({from: owner, value: 0}));
        });      
        
        it("should process owner's withdraw", async function(){
            await proceessWithdraw(owner, (ownerBalance) => {
                assert(
                    ownerBalance.beforeWithdraw.eq(ownerBalance.afterWithdraw.plus(ownerBalance.txCost).minus(1)), 
                    "Owner's balance is incorrect after withdraw"
                );
            })

        });

        it("should process bob's withdraw", async function(){
            await proceessWithdraw(actualBob, (bobBalance) => {
                assert(
                    bobBalance.beforeWithdraw.eq(bobBalance.afterWithdraw.plus(bobBalance.txCost).minus(3000)), 
                    "Bob's balance is incorrect after withdraw"
                );
            });
        });

        it("should process carol's withdraw", async function(){
            await proceessWithdraw(actualCarol, (carolBalance) => {
                assert(
                    carolBalance.beforeWithdraw.eq(carolBalance.afterWithdraw.plus(carolBalance.txCost).minus(3000)), 
                    "Carol's balance is incorrect after withdraw"
                );
            });
        });

        async function proceessWithdraw(personAddress, next){
            let personBalance = { beforeWithdraw: 0, afterWithdraw: 0, txCost: 0 };

            personBalance.beforeWithdraw = await web3.eth.getBalance(personAddress);

            let withdraw = await splitterInstance.withdraw({from: personAddress});
            personBalance.txCost = await getTransactionGasCost(withdraw["tx"]);
            
            personBalance.afterWithdraw = await web3.eth.getBalance(personAddress);

            next(personBalance);
        }

        async function getTransactionGasCost(tx) {
            let transaction = await web3.eth.getTransactionReceipt(tx);
            let amount = transaction.gasUsed;
            let price = await web3.eth.getTransaction(tx).gasPrice;
          
            return price * amount;
        }

        it("schould not process withdraw if there are not money for take", function() {
            assert.expectRevert(splitterInstance.withdraw({from: owner}));
        });
    });

    describe("tests contract's desctruction", () => {
        it("should not selfdestruct if the msg.sender is not the owner", function(){
            assert.expectRevert(splitterInstance.destroy({from: accounts[1]}));
        });

        it("should selfdestruct", async function(){
            assert.expectEvent(splitterInstance.destroy({from: owner}), {destroyer: owner}); 
        });
    });
});