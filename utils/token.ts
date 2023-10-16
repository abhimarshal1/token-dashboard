import { Hash, Log, zeroAddress } from "viem";
import { erc20Contract } from "@/utils/contract";
import { publicClient } from "@/utils/client";
import { EntryType, Logs } from "@/types/common";

const sortFunction = (a: EntryType, b: EntryType) => Number(b.value - a.value);

const defaultResult = {
  holders: [],
  minters: [],
};

export const getTokenHoldersAndMinters = async (logs: Array<Logs>) => {
  if (!logs.length) {
    return Promise.resolve(defaultResult);
  }

  const holdersSet = new Set<Hash>();
  const mintersMap: { [x: Hash]: bigint } = {};

  logs.forEach((log) => {
    let isMinted = false;
    const { from, to, value } = log.args;

    if (!from || !to || !value) {
      return Promise.resolve(defaultResult);
    }

    if (from === zeroAddress) {
      isMinted = true;
    }

    // Update balances for 'from' and 'to' addresses
    if (isMinted) {
      if (mintersMap[to]) {
        mintersMap[to] += value;
      } else {
        mintersMap[to] = value;
      }
    } else {
      holdersSet.add(from);
      holdersSet.add(to);
    }
  });

  const mintersList = Object.keys(mintersMap) as Array<Hash>;
  const holdersList = Array.from(holdersSet);

  const formattedMinters = mintersList.map((address) => ({
    address,
    value: mintersMap[address],
  }));

  const resp = await publicClient.multicall({
    contracts: holdersList.map((addr) => ({
      ...erc20Contract,
      functionName: "balanceOf",
      args: [addr],
    })),
  });

  const formattedHolders = holdersList.map((address, index) => ({
    address,
    value: resp[index].result as bigint,
  }));

  // sort both of them

  formattedMinters.sort(sortFunction);
  formattedHolders.sort(sortFunction);

  return { holders: formattedHolders, minters: formattedMinters };
};
