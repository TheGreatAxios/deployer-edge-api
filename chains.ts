import { Chain } from "./types";

export const chainNames: Record<Chain, string> = {
    "calypso-testnet": "staging-utter-unripe-menkar",
    "chaos-testnet": "staging-fast-active-bellatrix",
    "europa-testnet": "staging-legal-crazy-castor",
    "nebula-testnet": "staging-faint-slimy-achird",
    "titan-testnet": "staging-aware-chief-gianfar",
    "nebula-mainnet": "green-giddy-denebola"
}

export function getRPCUrl(chain: Chain) {
    if (chain.includes("testnet")) {
        return `https://staging-v3.skalenodes.com/v1/${chainNames[chain]}`;
    }

    return `https://mainnet.skalenodes.com/v1/${chainNames[chain]}`;
}