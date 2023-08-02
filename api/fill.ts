import { RequestContext } from "@vercel/edge";
import { get } from '@vercel/edge-config';
import { ProjectInformation, RequestObj } from "../types";
import { PRIVATE_KEY } from "../config";
import { getRPCUrl } from "../chains";
import Web3 from "web3";

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
    const balance = await w3.eth.getBalance(address);
    console.log("Balance: ", balance);
    console.log("Balance Int: ", parseInt(balance));

    const amountToFill = 5000000000000 - parseInt(balance);

    console.log("Amount to Fill: ", amountToFill);
    
    if (amountToFill <= 0) return new Response("sFUEL Limit Reached", {
        status: 200
    });

    const signedTx = await w3.eth.accounts.signTransaction({
        to: address,
        value: amountToFill,
        gas: 21_000,
        gasPrice: 100_000
    }, PRIVATE_KEY);
    
    if (!signedTx.rawTransaction) return new Response("Issue Sending Transaction", {
        status: 500
    });

    const txData = await w3.eth.sendSignedTransaction(signedTx.rawTransaction);

    return new Response(JSON.stringify(txData));
}