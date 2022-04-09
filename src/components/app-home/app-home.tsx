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

  @State() votes = {};
  proposalService = new ProposalService();

  handleSubmit(e) {
    e.preventDefault();
    this.proposalService.createProposal(this.signer, `${this.name}`);
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

  @State() proposals;

  async componentDidLoad() {
    await this.connectToWallet();
    this.proposalService.onProposalsCreated(
      e => {},
      e => {
        this.proposals = [...this.proposals, e];
        const { returnValues } = e;
        const { proposalId } = returnValues;
        this.votes[proposalId] = {
          yes: 0,
          no: 0,
          abstain: 0,
        };
      },
      e => {},
    );

    this.proposalService.onVoteCast(
      e => {},
      e => {
        const { returnValues } = e;
        const { proposalId, support } = returnValues;
        if (!this.votes[proposalId]) {
          this.votes[proposalId] = {
            yes: 0,
            no: 0,
            abstain: 0,
          };
        }
        if (support === '0') {
          console.log('here');
          this.votes[proposalId]['yes'] += 1;
        } else if (support === '1') {
          this.votes[proposalId]['no'] += 1;
        } else if (support === '2') {
          this.votes[proposalId]['abstain'] += 1;
        }

        // deep copy this.votes
        this.votes = JSON.parse(JSON.stringify(this.votes));
      },
      e => {},
    );

    this.proposalService.onPastProposals(e => {
      this.proposals = e;
    });
    this.proposalService.onPastVoteCreated(e => {
      for (let i = 0; i < e.length; i++) {
        const vote = e[i];
        const { returnValues } = vote;
        const { proposalId, support } = returnValues;
        if (!this.votes[proposalId]) {
          this.votes[proposalId] = {
            yes: 0,
            no: 0,
            abstain: 0,
          };
        }
        if (support === '0') {
          console.log('here');
          this.votes[proposalId]['yes'] += 1;
        } else if (support === '1') {
          this.votes[proposalId]['no'] += 1;
        } else if (support === '2') {
          this.votes[proposalId]['abstain'] += 1;
        }
        this.votes = JSON.parse(JSON.stringify(this.votes));
      }
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
        {this.proposals && (
          <ul>
            {this.proposals.map(proposal => (
              <li key={proposal.proposalId}>
                <div>
                  {proposal.returnValues[8]}
                  <button
                    onClick={() => {
                      this.proposalService.vote(proposal.returnValues.proposalId, 0, this.signer);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      this.proposalService.vote(proposal.returnValues.proposalId, 1, this.signer);
                    }}
                  >
                    No
                  </button>
                  <button
                    onClick={() => {
                      this.proposalService.vote(proposal.returnValues.proposalId, 2, this.signer);
                    }}
                  >
                    Abstain
                  </button>
                  <div>Yes: {this.votes[proposal.returnValues.proposalId] && this.votes[proposal.returnValues.proposalId].yes}</div>
                  <div>No: {this.votes[proposal.returnValues.proposalId] && this.votes[proposal.returnValues.proposalId].no}</div>
                  <div>Abstain: {this.votes[proposal.returnValues.proposalId] && this.votes[proposal.returnValues.proposalId].abstain}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Host>
    );
  }
}
