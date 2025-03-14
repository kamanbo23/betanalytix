import { h, render } from 'preact';

// Simple Preact component without JSX
const App = () => {
  return h('div', { style: 'padding: 20px; font-family: Arial, sans-serif;' }, [
    h('h1', null, 'BetAnalytix Preact Test'),
    h('p', null, 'If you can see this, Preact is working without JSX!'),
    h('p', null, 'Current time: ' + new Date().toLocaleTimeString())
  ]);
};

// Add console logs for debugging
console.log('simple-preact.js is running');
console.log('Attempting to render Preact component');

// Render the Preact component
render(h(App), document.getElementById('app')); 