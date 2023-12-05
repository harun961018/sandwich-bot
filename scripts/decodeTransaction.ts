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

  

  // // Make sure it's a UniswapV2 swap
  // if (!decoded.args.commands.includes("08")) return;
  // let swapPositionInCommands =
  //   decoded.args.commands.substring(2).indexOf("08") / 2;
  // let inputPosition = decoded.args.inputs[swapPositionInCommands];
  // decoded = await decodeSwap(decoded.args);
  // if (!decoded) return;
  // if (!decoded.hasTwoPath) return;
  // if (decoded.recipient === 2) return;
  // if (decoded.path[0].toLowerCase() != wETHAddress.toLowerCase()) return;
  const targetToken = checkTransactionForTarget(decoded.args.path);

  console.log("targetToken", targetToken)

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
    console.log(token.address)
    if (token.address.toLowerCase() == addresses[0].toLowerCase() || token.address.toLowerCase() == addresses[1].toLowerCase()) {
      return true
    }
  }
  return false
}

export default decodeTransaction;
