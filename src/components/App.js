import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Header from './Header';
import Dashboard from './Dashboard';
import BetLogger from './BetLogger';
import AIAssistant from './AIAssistant';
import Tools from './Tools';
import Footer from './Footer';

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [bets, setBets] = useState([]);
  
  // Load saved bets on initial load
  useEffect(() => {
    // Load bets from localStorage
    const savedBets = localStorage.getItem('betanalytix-bets');
    if (savedBets) {
      setBets(JSON.parse(savedBets));
    }
    
    // TODO: Load historical data from IndexedDB for bets older than 30 days
  }, []);

  // Save bets when they change
  useEffect(() => {
    localStorage.setItem('betanalytix-bets', JSON.stringify(bets));
    // TODO: Move older bets to IndexedDB
  }, [bets]);

  // Add a new bet
  const addBet = (newBet) => {
    // Add timestamp and unique ID
    const betWithMetadata = {
      ...newBet,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    setBets([...bets, betWithMetadata]);
    // Show a success message or notification
  };

  // Update an existing bet
  const updateBet = (id, updatedBet) => {
    setBets(bets.map(bet => bet.id === id ? { ...bet, ...updatedBet } : bet));
  };

  // Delete a bet
  const deleteBet = (id) => {
    setBets(bets.filter(bet => bet.id !== id));
  };

  // Navigation handler
  const navigate = (page) => {
    setActivePage(page);
  };

  // Render the active page
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard bets={bets} />;
      case 'logger':
        return <BetLogger addBet={addBet} updateBet={updateBet} deleteBet={deleteBet} bets={bets} />;
      case 'assistant':
        return <AIAssistant bets={bets} />;
      case 'tools':
        return <Tools bets={bets} />;
      default:
        return <Dashboard bets={bets} />;
    }
  };

  return (
    <div class="app-container">
      <Header navigate={navigate} activePage={activePage} />
      <main class="container">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App; 