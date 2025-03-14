import { h, render } from 'preact';

const TestApp = () => {
  return (
    <div>
      <h1>Hello, BetAnalytix!</h1>
      <p>If you can see this, Preact is working correctly.</p>
    </div>
  );
};

render(<TestApp />, document.getElementById('app')); 