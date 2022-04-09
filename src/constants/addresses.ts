import { Networks } from './blockchain';

const ETH_MAINNET = {
  IGNITE_ADDRESS: '0xFC4847e3213eEE03C9DBA7eDf134003e0dB87738',
  IGNITE_GOVERNOR_ADDRESS: '0xC891ec13DAC70181159856105B69694A4FC5Ce11',
  IGNITE_PROPERTY_ADDRESS: '0xED74b8F16502D1165F52cD1545F0484B733591f8',
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.ETH) return ETH_MAINNET;

  throw Error("Network don't support");
};
