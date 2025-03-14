import React from 'react';

// Ultra-simplified dashboard that should render in any scenario
function SimpleRecoveryDashboard() {
  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      padding: '20px',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Fixed Announcement Banner */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#141414',
        padding: '15px 20px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid #333',
        textAlign: 'center'
      }}>
        <span style={{ color: '#ff4500', marginRight: '10px' }}>🚀</span>
        <strong style={{ color: '#ff7e00', marginRight: '5px' }}>Coming Soon:</strong>
        Enhanced betting analytics with AI predictions
      </div>

      {/* Dashboard content */}
      <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#ff7e00', marginBottom: '30px', fontSize: '28px' }}>
          Emergency Dashboard Recovery
        </h1>
        
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #333'
        }}>
          <h2 style={{ color: '#ff7e00', marginTop: 0, marginBottom: '15px' }}>Dashboard Recovery Mode</h2>
          <p style={{ marginBottom: '15px' }}>
            Your dashboard is now in recovery mode. This simplified version should display correctly.
          </p>
          <p>
            To restore your full dashboard functionality:
          </p>
          <ol style={{ paddingLeft: '25px', lineHeight: '1.6' }}>
            <li>Check browser console for errors</li>
            <li>Verify all JS files are loading correctly</li>
            <li>Make sure API endpoints are accessible</li>
            <li>Check CSS for any overrides that might hide content</li>
          </ol>
        </div>
        
        {/* Basic metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { title: 'Total Bets', value: '245' },
            { title: 'Win Rate', value: '62.4%' },
            { title: 'Wins', value: '153' },
            { title: 'Losses', value: '92' }
          ].map((metric, index) => (
            <div key={index} style={{
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #333'
            }}>
              <div style={{ color: '#b0b0b0', marginBottom: '10px' }}>{metric.title}</div>
              <div style={{ color: '#ff7e00', fontSize: '24px', fontWeight: 'bold' }}>{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SimpleRecoveryDashboard; 