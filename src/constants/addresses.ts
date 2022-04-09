import { Networks } from './blockchain';

const ETH_MAINNET = {
  IGNITE_ADDRESS: '0x5184FdD56ceC5DDff26e81b572136968f9A5cA28',
  IGNITE_GOVERNOR_ADDRESS: '0xFFbD58F1f10569A5680c7ee127ceeD07112DE595',
  IGNITE_PROPERTY_ADDRESS: '0xED74b8F16502D1165F52cD1545F0484B733591f8',
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.ETH) return ETH_MAINNET;

  throw Error("Network don't support");
};
