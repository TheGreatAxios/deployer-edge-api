export type Chain =
    | "calypso-testnet"
    | "nebula-testnet"
    | "nebula-mainnet"
    | "europa-testnet"
    | "titan-testnet"
    | "chaos-testnet";

export type RequestObj = {
    address: string;
    chain: Chain;
};
