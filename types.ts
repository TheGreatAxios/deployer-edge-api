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

export type ProjectInformation = {
    project: string;
    created: string;
    active: boolean;
}