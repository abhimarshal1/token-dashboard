import { Block, Hash, Log } from "viem";

type ArgsContentType = {
  from?: Hash;
  to?: Hash;
  value?: bigint;
};

type Args = {
  args: ArgsContentType;
};

type BlockTimestamp = {
  timestamp: string;
};

export type Logs = Log & Args;

export type ComputedLogs = Log & Args & BlockTimestamp;

export type TokenConfigType = {
  name: string;
  symbol: string;
  decimal: number;
  address: Hash;
};

export type EntryType = {
  address: Hash;
  value: bigint;
};

export type BlockTimestampMapping = {
  [x: string]: Block;
};

export type AppContextType = {
  logs: Array<ComputedLogs>;
  holders: Array<EntryType>;
  minters: Array<EntryType>;
};
