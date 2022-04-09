import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  @State() name: string;

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.name);
  }

  handleChange(event) {
    this.name = event.target.value;
  }

  render() {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <label>
          Proposal Name:
          <input type="text" value={this.name} onInput={event => this.handleChange(event)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
