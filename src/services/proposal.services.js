import { ethers } from 'ethers';
import { IgniteContract, IgniteGovernorContract } from '../abi';
import { getAddresses, Networks } from '../constants';

const web3 = new Web3(Web3.givenProvider);
const addresses = getAddresses(Networks.ETH);
const provider = ethers.providers.getDefaultProvider('http://127.0.0.1:9545');
const igniteContract = new ethers.Contract(addresses.IGNITE_ADDRESS, IgniteContract, (provider).getSigner());
const igniteGovernorContract = new ethers.Contract(addresses.IGNITE_GOVERNOR_ADDRESS, IgniteGovernorContract, (provider).getSigner());

export async function createProposal() {
  const teamAddress = '0xf262d625cca985573ec7517e807ece0f5723785f';
  const grantAmount = 1000;

  const transferCalldata = igniteContract.interface.encodeFunctionData('transfer', [teamAddress, grantAmount]);

  console.log(igniteGovernorContract);
  
  let proposal = await igniteGovernorContract.propose([addresses.IGNITE_ADDRESS], [0], [transferCalldata], 'PID #' + "1" + ': ETH 80%, HNT 10%, OHM 10%');
  console.log(proposal);
}

export function onProposalsCreated(onCreated, onData, onError) {
  const governorAddress = addresses.IGNITE_GOVERNOR_ADDRESS;
  let whaleGovernor = new web3.eth.Contract(IgniteGovernorContract, governorAddress);
  //Any new, incoming events
  whaleGovernor.events
    .ProposalCreated({}, () => onCreated())
    .on('data', event => {
      //Has a field called returnValues which maps to the 8 arguments from ProposalCreated
      //See https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor-ProposalCreated-uint256-address-address---uint256---string---bytes---uint256-uint256-string-
      //Only fires on successful events.  Inspect why it happens a lot
      onData(event);
    })
    .on('error', error => {
      //Only fires on errors for ProposalCreated

      onError(error);
    });
}

export function onPastProposals(onPastProposalsCreated) {
  const governorAddress = addresses.IGNITE_GOVERNOR_ADDRESS;
  let whaleGovernor = new web3.eth.Contract(IgniteGovernorContract, governorAddress);
  //All past events
  //Inspect why events here is alwasy length 1
  whaleGovernor.getPastEvents('ProposalCreated', { fromBlock: 0, toBlock: 'latest' }, (_, events) => {
    onPastProposalsCreated(events);
  });
}
