// Import Preact
import { h, render } from 'preact';
import { useState } from 'preact/hooks';

// Simple version of the App component
const SimpleApp = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Simple navigation handler
  const navigate = (tab) => {
    console.log(`Navigating to ${tab}`);
    setActiveTab(tab);
  };

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <h2>Dashboard</h2>
            <p>This would be the dashboard content.</p>
          </div>
        );
      case 'logger':
        return (
          <div>
            <h2>Bet Logger</h2>
            <p>This would be the bet logger content.</p>
          </div>
        );
      case 'assistant':
        return (
          <div>
            <h2>AI Assistant</h2>
            <p>This would be the AI assistant content.</p>
          </div>
        );
      case 'tools':
        return (
          <div>
            <h2>Tools</h2>
            <p>This would be the tools content.</p>
          </div>
        );
      default:
        return <div>Unknown page</div>;
    }
  };

  return (
    <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
      <header style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ccc;">
        <h1>BetAnalytix Simple App</h1>
        <nav style="margin-top: 15px;">
          <button 
            onClick={() => navigate('home')}
            style={`margin-right: 10px; padding: 8px 12px; ${activeTab === 'home' ? 'font-weight: bold; background: #eee;' : ''}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('logger')}
            style={`margin-right: 10px; padding: 8px 12px; ${activeTab === 'logger' ? 'font-weight: bold; background: #eee;' : ''}`}
          >
            Bet Logger
          </button>
          <button 
            onClick={() => navigate('assistant')}
            style={`margin-right: 10px; padding: 8px 12px; ${activeTab === 'assistant' ? 'font-weight: bold; background: #eee;' : ''}`}
          >
            AI Assistant
          </button>
          <button 
            onClick={() => navigate('tools')}
            style={`margin-right: 10px; padding: 8px 12px; ${activeTab === 'tools' ? 'font-weight: bold; background: #eee;' : ''}`}
          >
            Tools
          </button>
        </nav>
      </header>
      
      <main>
        {renderContent()}
      </main>
      
      <footer style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ccc; text-align: center;">
        <p>BetAnalytix &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

// Render the app to the DOM
console.log('app-simple.js is running');
render(<SimpleApp />, document.getElementById('app')); 