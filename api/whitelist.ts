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
    const apiKey = request.headers.get("x-api-key");
    
    if (!apiKey) return new Response("Api Key Not Found", {
        status: 403
    });

    const { address, chain }: RequestObj = await request.json();
    
    const apiKeyValue = await get(apiKey);
    
    if (!apiKeyValue) return new Response("Invalid Api Key", {
        status: 401
    });

    return new Response(JSON.stringify({
        "hello": "test"
    }));
}