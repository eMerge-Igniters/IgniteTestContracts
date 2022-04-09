import { Component, h, Host, State } from '@stencil/core';
import ProposalService from '../../services/proposal.services';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  @State() name: string;
  @State() signer;
  proposalService = new ProposalService();

  handleSubmit(e) {
    console.log(e);
    e.preventDefault();
    this.proposalService.createProposal(this.signer, this.name);
  }

  handleChange(event) {
    this.name = event.target.value;
  }

  async connectToWallet() {
    this.signer = await this.proposalService.getSigner();
  }

  async disconnect() {
    this.signer = null;
  }

  @State() pastProposals;

  async componentDidLoad() {
    this.proposalService.onProposalsCreated(
      e => {
        console.log('onCreated');
        console.log(e);
      },
      e => {
        console.log('onData');
        console.log(e);
      },
      e => {
        console.log('onError');
        console.log(e);
      },
    );

    this.proposalService.onPastProposals(e => {
      console.log(e);
      console.log('OnPastProposals');
      this.pastProposals = e;
    });
  }

  render() {
    return (
      <Host>
        <button
          onClick={() => {
            if (this.signer) {
              this.disconnect();
            } else {
              this.connectToWallet();
            }
          }}
        >
          {this.signer ? 'Disconnect' : 'Connect'}
        </button>
        {this.signer && (
          <form onSubmit={e => this.handleSubmit(e)}>
            <label>
              Proposal Name:
              <input type="text" value={this.name} onInput={event => this.handleChange(event)} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        )}
        {this.pastProposals && (
          <ul>
            {this.pastProposals.map(proposal => (
              <li>{proposal.returnValues[8]}</li>
            ))}
          </ul>
        )}
      </Host>
    );
  }
}
