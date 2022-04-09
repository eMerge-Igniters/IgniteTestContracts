import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  onSubmit() {
    console.log('submitted');
  }
  render() {
    return (
      <div class="app-home">
        <form onSubmit={this.onSubmit}>
          <input type="text" name="name" placeholder="proposal name" />
          <button type="submit">Create Proposal</button>
        </form>
      </div>
    );
  }
}
