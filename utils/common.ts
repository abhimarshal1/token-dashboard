import { TOKEN_CONFIG } from "@/constants/contract";
import { Hash, formatUnits } from "viem";

export const shortenHash = (hash: string | Hash, length = 6) => {
  if (hash.length <= length * 2) {
    return hash;
  }

  const prefix = hash.slice(0, length);
  const suffix = hash.slice(-length);

  return `${prefix}...${suffix}`;
};

export const formatTokenValueInCurrency = (value: bigint) => {
  const formattedTokenValue = +formatUnits(value, TOKEN_CONFIG.decimal);

  const million = 1e6;
  const billion = 1e9;
  const trillion = 1e12;

  if (formattedTokenValue >= trillion) {
    return `${(formattedTokenValue / trillion).toFixed(2)}T`;
  } else if (formattedTokenValue >= billion) {
    return `${(formattedTokenValue / billion).toFixed(2)}B`;
  } else if (formattedTokenValue >= million) {
    return `${(formattedTokenValue / million).toFixed(2)}M`;
  } else if (formattedTokenValue >= 1e3) {
    return `${(formattedTokenValue / 1e3).toFixed(2)}K`;
  } else {
    return formattedTokenValue.toFixed(2).toString();
  }
};
