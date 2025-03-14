import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SimpleRecoveryDashboard from './components/SimpleRecoveryDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import BetLogger from './components/BetLogger';
import AIAssistant from './components/AIAssistant';
import Tools from './components/Tools';

// Main App component with navigation and error handling
function App() {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  // Handle navigation between different sections
  const navigate = (page) => {
    setActivePage(page);
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Mark as loaded after a short delay to ensure all dependencies are ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Render content based on active page
  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading content...</p>
        </div>
      );
    }

    if (hasError) {
      return <SimpleRecoveryDashboard />;
    }

    switch (activePage) {
      case 'logger':
        return (
          <ErrorBoundary onError={() => setHasError(true)}>
            <BetLogger />
          </ErrorBoundary>
        );
      case 'assistant':
        return (
          <ErrorBoundary onError={() => setHasError(true)}>
            <AIAssistant />
          </ErrorBoundary>
        );
      case 'tools':
        return (
          <ErrorBoundary onError={() => setHasError(true)}>
            <Tools />
          </ErrorBoundary>
        );
      case 'dashboard':
      default:
        return (
          <ErrorBoundary onError={() => setHasError(true)}>
            <Dashboard navigateToBetLogger={() => navigate('logger')} />
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="app-container">
      <Header navigate={navigate} activePage={activePage} />
      <main className="main-content">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <SimpleRecoveryDashboard />;
    }

    return this.props.children;
  }
}

export default App; 