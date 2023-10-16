import { Hash } from "viem";

export const shortenHash = (hash: string | Hash, length = 6) => {
  if (hash.length <= length * 2) {
    return hash;
  }

  const prefix = hash.slice(0, length);
  const suffix = hash.slice(-length);

  return `${prefix}...${suffix}`;
};
