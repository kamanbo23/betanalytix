import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>BetAnalytix</h3>
            <p className="text-secondary">Smart Betting Analytics</p>
          </div>
          
          <div className="footer-legal">
            <p className="disclaimer">
              <i className="fas fa-exclamation-triangle"></i> Gambling involves risk. Please gamble responsibly.
            </p>
            <p className="copyright">
              &copy; {currentYear} BetAnalytix. All rights reserved.
            </p>
            <p className="text-tertiary">
              Data is stored locally in your browser. No personal information is collected.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 