require('dotenv').config()
const chalk = require('chalk')


// Thsi function cauclates an X value given the current amount of tokens in the specific pair liquidity pool
// x is hardcoded to cap out at 2 because of testing and dont want to loose a billion dollars 
const maximise = async(eth,pairToken,slippage, increase) =>{

    let newPrice = Number.parseFloat(slippage*eth.price);  
    let lhs = Number.parseFloat((newPrice*(pairToken.reserve)-eth.reserve))
    let rhs = Number.parseFloat(1+(newPrice*pairToken.price))
    let x = lhs/rhs
    
    console.log(chalk.yellow("old X is " + x))
    console.log(chalk.magenta.bold("This is the maximum Money  : " + x*process.env.ETHPRICE*increase))

    if(x>2){
        return 2;
    }
    return x 
}

module.exports = maximise

// TODO - you guys should read about unit testing.
// use a unit testing library like jest, and add a bunch of unit test, and a script command to run unit tests. 
// const test = () =>{
//     let eth ={
//         reserve : 740,
//         price : 0.00019087,
//     }
//     let pairToken = {
//         reserve : 3876981.54,
//         price :5239.168,
//     }

//     let slippage = 1.016;

//     maximise(eth,pairToken,slippage)
// }

// test();