import React, { useState, useEffect } from 'react';

const Header = ({ navigate, activePage }) => {
  // Default values if no props provided
  const nav = navigate || (() => console.log("Navigation not implemented"));
  const active = activePage || 'dashboard';
  
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for header transparency based on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll events to update header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle navigation and close mobile menu
  const handleNavigation = (page) => {
    nav(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container flex space-between align-center">
        <div className="logo">
          <h1>BetAnalytix</h1>
          <p className="tagline">Transform Raw Bets into Winning Strategies</p>
        </div>
        
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        
        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list flex">
            <li className={`nav-item ${active === 'dashboard' ? 'active' : ''}`}>
              <button onClick={() => handleNavigation('dashboard')} className="nav-link">
                <i className="fas fa-chart-line"></i>
                <span>Dashboard</span>
              </button>
            </li>
            <li className={`nav-item ${active === 'logger' ? 'active' : ''}`}>
              <button onClick={() => handleNavigation('logger')} className="nav-link">
                <i className="fas fa-book"></i>
                <span>Bet Logger</span>
              </button>
            </li>
            <li className={`nav-item ${active === 'assistant' ? 'active' : ''}`}>
              <button onClick={() => handleNavigation('assistant')} className="nav-link">
                <i className="fas fa-robot"></i>
                <span>AI Assistant</span>
              </button>
            </li>
            <li className={`nav-item ${active === 'tools' ? 'active' : ''}`}>
              <button onClick={() => handleNavigation('tools')} className="nav-link">
                <i className="fas fa-calculator"></i>
                <span>Tools</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 