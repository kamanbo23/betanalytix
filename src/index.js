import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'; // Basic CSS import if needed

// Simple error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#660000', 
          padding: '20px',
          margin: '20px',
          borderRadius: '5px'
        }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log('Attempting to render application');

// Check which root element exists
const rootElement = document.getElementById('root');
const appElement = document.getElementById('app');

// Use the element that exists
const targetElement = rootElement || appElement;

if (!targetElement) {
  console.error('Neither #root nor #app elements found in the DOM. Creating emergency container.');
  const emergencyRoot = document.createElement('div');
  emergencyRoot.id = 'emergency-root';
  document.body.appendChild(emergencyRoot);
  
  ReactDOM.render(
    <div style={{ padding: '20px', color: 'red', backgroundColor: '#222' }}>
      Emergency Rendering: No valid container found in your HTML.
      <br />
      <br />
      <App />
    </div>,
    emergencyRoot
  );
} else {
  console.log('Found target element:', targetElement.id);
  
  // First try modern method
  try {
    console.log('Attempting to render with createRoot');
    const { createRoot } = require('react-dom/client');
    const root = createRoot(targetElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('Successfully rendered with createRoot');
  } catch (error) {
    console.error('Error with createRoot:', error);
    
    // Fall back to legacy method
    try {
      console.log('Falling back to ReactDOM.render');
      ReactDOM.render(
        <React.StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </React.StrictMode>,
        targetElement
      );
      console.log('Successfully rendered with ReactDOM.render');
    } catch (error) {
      console.error('All rendering methods failed:', error);
    }
  }
}

// Debugging indicator
window.addEventListener('load', () => {
  setTimeout(() => {
    const targetElement = document.getElementById('root') || document.getElementById('app');
    if (targetElement && !targetElement.hasChildNodes()) {
      console.error('Container is empty after load - UI not rendering properly');
      
      // Create visible error message in the DOM
      const errorMsg = document.createElement('div');
      errorMsg.style.backgroundColor = '#660000';
      errorMsg.style.color = 'white';
      errorMsg.style.padding = '20px';
      errorMsg.style.margin = '20px';
      errorMsg.innerHTML = `
        <h2>React Failed to Render</h2>
        <p>Check the console for errors. Your container is empty.</p>
      `;
      document.body.appendChild(errorMsg);
    }
  }, 1000);
}); 