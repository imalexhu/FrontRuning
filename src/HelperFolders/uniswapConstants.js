require('dotenv').config()



// Initialised all the constant variables I work with from the uniswap SDK
// TODO - I have a feeling that the typically styling convention for constants  is: SHOUTY_SNAKE_CASE

const { ChainId, WETH, Percent } = require('@uniswap/sdk');
const ChainID = ChainId.MAINNET;
const Ethers = require('ethers');

const Provider = Ethers.getDefaultProvider('mainnet', {
    infra: process.env.INFURA
})

const BuyTolerance = new Percent('100', '100000');

const SellTolerance = new Percent('100', '100000');

const Weth = WETH[ChainID];


const Signer = new Ethers.Wallet(process.env.WALLET);

const Account = Signer.connect(Provider);

const Buy = new Ethers.Contract(
    process.env.UNISWAP,
    [process.env.SWAPEXACTETHFORTOKENS]
    , Account
);

const Sell = new Ethers.Contract(
    process.env.UNISWAP,
    [process.env.SWAPEXACTTOKENSFORETH]
    , Account
);

module.exports = {
    BuyTolerance,
    ChainID,
    Ethers,
    SellTolerance,
    Weth,
    Buy,
    Sell
}
