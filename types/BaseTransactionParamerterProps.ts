import { BigNumber } from "ethers";
import TokenProps from "./TokenProps";

type BaseTransactionParamerterProps = {
  minAmountOut: BigNumber;
  targetToken: TokenProps | undefined;
};

export default BaseTransactionParamerterProps;