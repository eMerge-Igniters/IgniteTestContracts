import { Networks } from './blockchain';

const ETH_MAINNET = {
  IGNITE_ADDRESS: '0x0c676c1D3c385CebBf4ddD5c03688C22eF4eB947',
  IGNITE_GOVERNOR_ADDRESS: '0x122b4ae7AaD61ca7B1FF3e0d69d726088c1055D7',
  IGNITE_PROPERTY_ADDRESS: '0xED74b8F16502D1165F52cD1545F0484B733591f8',
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.ETH) return ETH_MAINNET;

  throw Error("Network don't support");
};
