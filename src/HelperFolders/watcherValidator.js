
const axios = require('axios').default;
const methodArray = ['swapExactETHForTokens','swapETHForExactTokens','swapTokensForExactTokens','swapExactTokensForTokens']
const stable = ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48','0xdac17f958d2ee523a2206206994597c13d831ec7',
'0x6b175474e89094c44da98b954eedeac495271d0f','0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
]

// Gets the significant figures of the token value, some tokens are in 6 significant figures while others at 18
// TODO - refactor, I don't think the function name give a good indication of what the function actually does, e.g
// calculateDecimals or getDecimals (is this getting decimals or significant figures? it could be important to specify and stay consitent for future maintainers)
const precise = async (token) => {
    let sig = await axios.get(`https://api.ethplorer.io/getTokenInfo/${token}?apiKey=${process.env.TOKENKEY}`);
    decimals = sig.data.decimals
    holdersCount = sig.data.holdersCount

    return {
        decimals,
        holdersCount
    };
}
// gets the currently traded gas price
const getGas = async () => {
    let compareGas = await axios.get(process.env.GASAPI)
    compareGas = compareGas.data
    compareGas = (parseInt(compareGas.fast) + parseInt(compareGas.fastest) + parseInt(compareGas.average)) / 30;

    return parseInt(compareGas)
}



// Filters out all emits and converts valuable emiits to filterTransactions that are turned back to index
// TODO - be careful of trailing whitespace (spaces at the end of lines of code and etc.) 
const viableEvent = async (event,myTrie,compareGas) => {

    let path = event.contractCall.params.path
    if(!path) return 

    let end = path.length - 1
    let tokenAddress = path[end]
    let methodName = event.contractCall.methodName
    let gasPrice = parseInt(event.gasPrice)
    let lowerBound = compareGas * 0.87e9
    let upperBound = compareGas * 1.27e9
    let etherValue = event.value
    let amountOutMin = event.contractCall.params.amountOutMin


    
    if(event.status !== 'pending') return
    // console.log("Event status "  + event.status)

    if(amountOutMin === undefined) return
    // console.log({amountOutMin})
    
    if(gasPrice < lowerBound || gasPrice > upperBound) return
    // console.log({lowerBound,gasPrice,upperBound})
    
    if(methodArray.indexOf(methodName) === -1 ) return 

    
    
    if(!myTrie.hasWord(tokenAddress)) return
    // viable address

    // let {decimals} = await precise(path[0].toLowerCase())
    // amountOutMin = amountOutMin / Math.pow(decimals,10)
    // if(etherValue === '0' && !stable.includes(tokenOut)) {
    //     etherValue = await convertToEth(event,tokenAddress,decimals)
    // }
    if(etherValue < 3e18) return
    let {decimals, holdersCount} = await precise(tokenAddress)
    if((holdersCount<250)) return

    console.log(`Their tx hash  = https://etherscan.io/tx/${event.hash}`)

    return {
        method: methodName,
        txHash: event.hash,
        gasPrice: gasPrice,
        etherValue: parseInt(etherValue),
        amountOutMin: parseInt(amountOutMin),
        tokenOut: tokenAddress,
        decimals : decimals
    }
}


module.exports = {
    viableEvent,
    getGas
}