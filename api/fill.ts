import { RequestContext } from "@vercel/edge";
import { get } from '@vercel/edge-config';
import { ProjectInformation, RequestObj } from "../types";
import { PRIVATE_KEY } from "../config";
import { getRPCUrl } from "../chains";
import Web3 from "web3";
import provideSFuel from "../sfuel";

export const config = {
    runtime: "edge"
}

  
export default async(request: Request, context: RequestContext) => {

    const apiKey = request.headers.get("x-api-key");

    if (apiKey === null) return new Response("Api Key Not Found", {
        status: 403
    });

    const { address, chain }: RequestObj = await request.json();
    
    const possibleApiKeyValue = await get(apiKey);

    if (possibleApiKeyValue === undefined || possibleApiKeyValue === null) return new Response("Invalid Api Key", {
        status: 401
    });

    const projectInfo: ProjectInformation = possibleApiKeyValue.valueOf() as unknown as ProjectInformation;

    if (projectInfo.active === false) return new Response("Project Inactive", {
        status: 403
    });

    if (address.length !== 42) return new Response("Invalid Address Length", {
        status: 400
    });

    if (!address.startsWith("0x")) return new Response("Invalid Eth Address", {
        status: 400
    });

    const w3 = new Web3(getRPCUrl(chain));
    
    const signedTx = await provideSFuel(w3, address);

    if (signedTx === false) {
        return new Response("sFUEL Already Filled Up");
    } else if (signedTx === 500) {
        return new Response("Issue Sending Transaction", {
            status: 500
        });
    } else if (signedTx.rawTransaction) {
        const txData = await w3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return new Response(JSON.stringify(txData));
    }
}