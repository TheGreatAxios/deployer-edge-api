import Web3 from "web3";
import { PRIVATE_KEY } from "./config";

export default async function provideSFuel(web3: Web3, address: string) {
    const balance = await web3.eth.getBalance(address);

    const amountToFill = 5000000000000 - parseInt(balance);

    if (amountToFill <= 0) return false;

    const signedTx = await web3.eth.accounts.signTransaction({
        to: address,
        value: amountToFill,
        gas: 21_000,
        gasPrice: 100_000
    }, PRIVATE_KEY);
    
    if (!signedTx.rawTransaction) return 500;

    return signedTx;

}