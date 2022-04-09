import { ethers } from 'ethers';
import { IgniteContract, IgniteGovernorContract } from '../abi';
import { getAddresses, Networks } from '../constants';

export default class ProposalService {
  web3 = new Web3(Web3.givenProvider);
  addresses = getAddresses(Networks.ETH);
  provider;

  async getProvider() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.provider.send('eth_requestAccounts', []);
  }

  async getSigner() {
    await this.getProvider();
    return this.provider.getSigner();
  }

  async createProposal(signer, proposalDescription) {
    const teamAddress = '0xf262d625cca985573ec7517e807ece0f5723785f';
    const grantAmount = 1000;
    const igniteContract = new ethers.Contract(this.addresses.IGNITE_ADDRESS, IgniteContract, signer);
    const igniteGovernorContract = new ethers.Contract(this.addresses.IGNITE_GOVERNOR_ADDRESS, IgniteGovernorContract, signer);

    const transferCalldata = igniteContract.interface.encodeFunctionData('transfer', [teamAddress, grantAmount]);

    await igniteGovernorContract.propose([this.addresses.IGNITE_ADDRESS], [0], [transferCalldata], proposalDescription);
  }

  onProposalsCreated(onCreated, onData, onError) {
    const governorAddress = this.addresses.IGNITE_GOVERNOR_ADDRESS;
    let igniteGovernor = new this.web3.eth.Contract(IgniteGovernorContract, governorAddress);
    //Any new, incoming events
    igniteGovernor.events
      .ProposalCreated({}, event => onCreated(event))
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

  onPastProposals(onPastProposalsCreated) {
    const governorAddress = this.addresses.IGNITE_GOVERNOR_ADDRESS;
    let igniteGovernor = new this.web3.eth.Contract(IgniteGovernorContract, governorAddress);
    //All past events
    //Inspect why events here is alwasy length 1
    igniteGovernor.getPastEvents('ProposalCreated', { fromBlock: 0, toBlock: 'latest' }, (_, events) => {
      onPastProposalsCreated(events);
    });
  }

  // getVotes() {
  //   const governorAddress = this.addresses.IGNITE_GOVERNOR_ADDRESS;
  //   let igniteGovernor = new this.web3.eth.Contract(IgniteGovernorContract, governorAddress);
  //   return igniteGovernor.methods.getVotes().call();
  // }

  async vote(proposalId, support, signer) {
    const governorAddress = this.addresses.IGNITE_GOVERNOR_ADDRESS;
    const igniteGovernorContract = new ethers.Contract(governorAddress, IgniteGovernorContract, signer);

    // const castVoteData = igniteGovernorContract.interface.encodeFunctionData('castVote', [proposalId, support]);
    await igniteGovernorContract.castVote(proposalId, support);
  }

  onVoteCast(onCast, onData, onError) {
    const governorAddress = this.addresses.IGNITE_GOVERNOR_ADDRESS;
    let igniteGovernor = new this.web3.eth.Contract(IgniteGovernorContract, governorAddress);
    //Any new, incoming events
    igniteGovernor.events
      .VoteCast({}, event => onCast(event))
      .on('data', event => {
        onData(event);
      })
      .on('error', error => {
        //Only fires on errors for ProposalCreated

        onError(error);
      });
  }

  onPastVoteCreated(onPastVoteCreated) {
    const governorAddress = this.addresses.IGNITE_GOVERNOR_ADDRESS;
    let igniteGovernor = new this.web3.eth.Contract(IgniteGovernorContract, governorAddress);
    //All past events
    //Inspect why events here is alwasy length 1
    igniteGovernor.getPastEvents('VoteCast', { fromBlock: 0, toBlock: 'latest' }, (_, events) => {
      onPastVoteCreated(events);
    });
  }
}
