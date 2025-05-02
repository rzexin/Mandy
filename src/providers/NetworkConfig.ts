import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

export const ACTIVE_NETWORK = "testnet";

const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
});

const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
});

export { networkConfig, suiClient };
