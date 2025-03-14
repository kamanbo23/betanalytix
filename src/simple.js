// Simple vanilla JS code to check if basic JS is working
console.log('Simple.js is running');
document.addEventListener('DOMContentLoaded', function() {
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>BetAnalytix Test</h1>
        <p>If you can see this, basic JavaScript is working.</p>
        <p>Current time: ${new Date().toLocaleTimeString()}</p>
      </div>
    `;
    console.log('Content added to #app element');
  } else {
    console.error('Could not find #app element');
  }
}); 