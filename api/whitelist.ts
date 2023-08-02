import { RequestContext } from "@vercel/edge";
import { createClient, get } from '@vercel/edge-config';
// import { JsonRpcProvider, NonceManager, Wallet } from "ethers";
import { Chain, ProjectInformation, RequestObj } from "../types";
import { PRIVATE_KEY } from "../config";
import { getRPCUrl } from "../chains";
import { ConfigController } from "@skaleproject/config-controller";
import { Wallet } from "@skaleproject/config-controller/node_modules/ethers";
// import { Wallet } from "ethers";

export const config = {
    runtime: "edge"
}

  
export default async(request: Request, context: RequestContext) => {

    const apiKey = request.headers.get("x-api-key");
    
    if (!apiKey) return new Response("Api Key Not Found", {
        status: 403
    });

    const { address, chain }: RequestObj = await request.json();
    
    const possibleApiKeyValue = await get(apiKey);

    if (!possibleApiKeyValue) return new Response("Invalid Api Key", {
        status: 401
    });

    const projectInfo: ProjectInformation = possibleApiKeyValue.valueOf() as unknown as ProjectInformation;

    if (!projectInfo.active) return new Response("Project Inactive", {
        status: 403
    });

    const configController = new ConfigController({
        rpcUrl: getRPCUrl(chain),
        signer: new Wallet(PRIVATE_KEY)
    });

    const receipt = await configController.addToWhitelist({
        address,
        runChecks: true
    });

    return new Response(JSON.stringify({
        receipt,
        projectInfo
    }));
}