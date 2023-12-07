import { Transaction, ethers } from "ethers";
// import UniswapUniversalRouterV3Abi from "../abi/UniswapUniversalRouterV3.json";
import UniswapV2RouterAbi from "../abi/UniswapV2Router.json";
import { uniswapUniversalRouterAddress, uniswapV2RouterAddress, wETHAddress } from "../constants";
import { decodeSwap } from "./utils";
import DecodedTransactionProps from "../types/DecodedTransactionProps";
import { tokenList } from "../constants";
import TokenProps from "../types/TokenProps";
// const uniswapV3Interface = new ethers.utils.Interface(
//   UniswapUniversalRouterV3Abi
// );

const uniswapV2Interface = new ethers.utils.Interface(
  UniswapV2RouterAbi
)

const decodeTransaction = async (
  transaction: Transaction
): Promise<DecodedTransactionProps | undefined> => {
  
  if (!transaction || !transaction.to) return ;
  if (Number(transaction.value) == 0) return;
  if (
    transaction.to.toLowerCase() != uniswapV2RouterAddress.toLowerCase()
  ) {
    return;
  }
  
  let decoded;

  try {
    decoded = uniswapV2Interface.parseTransaction(transaction);
  } catch (e) {
    return;
  }

  const result = checkTransactionForTarget(decoded.args.path);

  console.log("targetToken", result)

  return {
    transaction,
    amountIn: transaction.value,
    // minAmountOut: decoded.minAmountOut,
    // targetToken: decoded.path[1],
    minAmountOut: decoded.args.amountOutMin,
    targetToken: decoded.args.path[1],
  };
};

const checkTransactionForTarget = async (addresses: string[]):Promise<boolean> =>{
  for (const token of tokenList) {
    if (token.address.toLowerCase() == addresses[0].toLowerCase() || token.address.toLowerCase() == addresses[1].toLowerCase()) {
      return true
    }
  }
  return false
}

// const checkProfitableTransaction = async ()

export default decodeTransaction;
