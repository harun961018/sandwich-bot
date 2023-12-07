import { BigNumber } from "ethers";

type BaseTransactionParamerterProps = {
  minAmountOut: BigNumber;
  targetToken: string;
};

export default BaseTransactionParamerterProps;