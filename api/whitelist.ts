import { RequestContext } from "@vercel/edge";
import { get } from '@vercel/edge-config';

export const config = {
    runtime: "edge"
}

type Chain = "calypso-testnet" | "nebula-testnet" | "europa-testnet" | "titan-testnet" | "chaos-testnet";

type RequestObj = {
    address: string;
    chain: Chain;
}
  
export default async(request: Request, context: RequestContext) => {
    const { address, chain }: RequestObj = await request.json();
    const greeting = await get('greeting');
    
    return new Response(JSON.stringify(greeting));
}