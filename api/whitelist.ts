import { RequestContext } from "@vercel/edge";
import { get } from '@vercel/edge-config';
import ABI from "../abi";
import { ProjectInformation, RequestObj } from "../types";
import { PRIVATE_KEY } from "../config";
import { getRPCUrl } from "../chains";
import Web3, { Contract } from "web3";

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

    // if (!Web3.modules.Personal.isA(address)) return new Response("Invalid Address", {
    //     status: 400
    // });

    const projectInfo: ProjectInformation = possibleApiKeyValue.valueOf() as unknown as ProjectInformation;
    console.log("Project Info", projectInfo);

    if (projectInfo.active === false) return new Response("Project Inactive", {
        status: 403
    });

    const contract = new Contract(
        ABI,
        "0xD2002000000000000000000000000000000000D2",
    );
    // contract.setProvider(getRPCUrl(chain)); // new Wallet(PRIVATE_KEY).connect(new JsonRpcProvider()))
    const w3 = new Web3(getRPCUrl(chain));
    const signedTx = await w3.eth.accounts.signTransaction({
        to: "0xD2002000000000000000000000000000000000D2",
        data: contract.methods.addToWhitelist.arguments(address).encodeABI(),
    }, PRIVATE_KEY);
    
    const txHash = await w3.eth.sendSignedTransaction(signedTx.rawTransaction);

    return new Response(JSON.stringify({
        txHash,
        projectInfo
    }));
}