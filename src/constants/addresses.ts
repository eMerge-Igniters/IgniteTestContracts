import { Networks } from "./blockchain";

const ETH_MAINNET = {
    IGNITE_ADDRESS: "0x5Bd90921DB4172bef43F866372016294bcB32564",
    IGNITE_GOVERNOR_ADDRESS: "0xc6e3A75d9f1a60d9325085457088CE3b2F21950b",
    IGNITE_PROPERTY_ADDRESS: "0xED74b8F16502D1165F52cD1545F0484B733591f8",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) return ETH_MAINNET;

    throw Error("Network don't support");
};
