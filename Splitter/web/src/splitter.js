if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var Splitter = (function(){

    let splitterContract = web3.eth.contract(compiledSplitter.abi);
    let bob;
    let carol;
    let owner;

    let createSplitter = function(){        
        owner = document.getElementById("myAddress").value;
        bob = document.getElementById("bobsAddress").value;
        carol = document.getElementById("carolsAddress").value;

        splitterInstance = splitterContract.new(bob, carol, {data: compiledSplitter.unlinked_binary, from: owner, gas: 300000}, 
                                                function(err, txn){                                                    
                                                    if (err){
                                                        console.log("Invalid Address");
                                                    }
                                                }
                                            );
    }
    
    let getBalance = function(account){
        let balanceOf = account.balanceOf;
        let addressBalance;

        if (balanceOf === "address"){
            addressBalance = splitterInstance.address;
        }else{
            addressBalance = splitterInstance[balanceOf]();
        }
        web3.eth.getBalance(addressBalance, function(err, balance) {
            if (err) {
                console.error(err);
            } else {
                let balanceId = account.balanceId;
                document.getElementById(balanceId).innerHTML = balance;
            }
        });
    }

    let splitMoney = function(){
        let amount = document.getElementById("moneyAmount").value;
    
        let currencyType = document.getElementById("currencyType");
        let selectedCurrency = currencyType.options[currencyType.selectedIndex].value;
    
        splitterInstance.splitMoney(
            {from: owner, value: web3.toWei(amount, selectedCurrency)},
            function(err, txn){
                if (err){
                    console.log(err);
                }
            }
        );
    }

    return{
        createSplitter: createSplitter,
        getBalance: getBalance,
        splitMoney: splitMoney,
    }
})();