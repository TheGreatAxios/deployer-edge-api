import { RequestContext } from "@vercel/edge";
import { get } from '@vercel/edge-config';
import ABI from "../abi";
import { ProjectInformation, RequestObj } from "../types";
import { PRIVATE_KEY } from "../config";
import { getRPCUrl } from "../chains";
import Web3 from "web3";

export const config = {
    runtime: "edge"
}

  
export default async(request: Request, context: RequestContext) => {

    const apiKey = request.headers.get("x-api-key");
    console.log(request.headers.entries());
    console.log(request.headers.get("x-api-key"));

    if (apiKey === null) return new Response("Api Key Not Found", {
        status: 403
    });

    const { address, chain }: RequestObj = await request.json();
    
    const possibleApiKeyValue = await get(apiKey);
    console.log("Possible API Key", possibleApiKeyValue);

    if (possibleApiKeyValue === undefined || possibleApiKeyValue === null) return new Response("Invalid Api Key", {
        status: 401
    });

    const projectInfo: ProjectInformation = possibleApiKeyValue.valueOf() as unknown as ProjectInformation;
    console.log("Project Info", projectInfo);

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
    const signedTx = await w3.eth.accounts.signTransaction({
        to: "0xD2002000000000000000000000000000000000D2",
        data: "0x2f2ff15dfc425f2263d0df187444b70e47283d622c70181c5baebb1306a01edba1ce184c000000000000000000000000" + address.substring(2),
        gas: 105_000,
        gasPrice: 100_000
    }, PRIVATE_KEY);
    
    if (!signedTx.rawTransaction) return new Response("Issue Sending Transaction", {
        status: 500
    });

    const txData = await w3.eth.sendSignedTransaction(signedTx.rawTransaction);

    return new Response(JSON.stringify(txData));
}