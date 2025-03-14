import React, { useState, useEffect } from 'react';

// Simplified BetLogger component compatible with React
const BetLogger = () => {
  const [formData, setFormData] = useState({
    sport: '',
    league: '',
    team: '',
    opponent: '',
    betType: 'moneyline',
    odds: '',
    stake: '',
    selectedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [bets, setBets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeView, setActiveView] = useState('form');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Load saved bets from localStorage
  useEffect(() => {
    const savedBets = localStorage.getItem('bets');
    if (savedBets) {
      try {
        setBets(JSON.parse(savedBets));
      } catch (e) {
        console.error('Error loading saved bets:', e);
      }
    }
  }, []);
  
  // Save bets to localStorage when they change
  useEffect(() => {
    localStorage.setItem('bets', JSON.stringify(bets));
  }, [bets]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing bet
      setBets(bets.map(bet => 
        bet.id === editingId ? { ...formData, id: editingId } : bet
      ));
      setEditingId(null);
    } else {
      // Add new bet
      const newBet = {
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      setBets([newBet, ...bets]);
    }
    
    // Reset form
    setFormData({
      sport: '',
      league: '',
      team: '',
      opponent: '',
      betType: 'moneyline',
      odds: '',
      stake: '',
      selectedDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };
  
  const handleEdit = (bet) => {
    setFormData(bet);
    setEditingId(bet.id);
    setActiveView('form');
  };
  
  const confirmDelete = (id) => {
    setDeleteConfirmId(id);
  };
  
  const handleDelete = (id) => {
    setBets(bets.filter(bet => bet.id !== id));
    setDeleteConfirmId(null);
  };
  
  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };
  
  const toggleView = () => {
    setActiveView(activeView === 'form' ? 'history' : 'form');
    // Clear any pending delete confirmation when switching views
    setDeleteConfirmId(null);
  };
  
  return (
    <div className="bet-logger-container" style={{ position: 'relative', zIndex: 5 }}>
      <div className="bet-logger-header">
        <h2>Bet Logger</h2>
        <button className="toggle-view-btn" onClick={toggleView}>
          {activeView === 'form' ? 'View History' : 'Log New Bet'}
        </button>
      </div>
      
      {activeView === 'form' ? (
        <div className="bet-form-container card" style={{ position: 'relative', zIndex: 10 }}>
          <h3>{editingId ? 'Edit Bet' : 'Log New Bet'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sport">Sport</label>
                <select 
                  id="sport" 
                  name="sport" 
                  value={formData.sport} 
                  onChange={handleInputChange}
                  required
                  style={{ position: 'relative', zIndex: 15, background: 'rgba(30, 30, 30, 0.9)' }}
                >
                  <option value="">Select Sport</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Football">Football</option>
                  <option value="Baseball">Baseball</option>
                  <option value="Hockey">Hockey</option>
                  <option value="Soccer">Soccer</option>
                  <option value="MMA/Boxing">MMA/Boxing</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Golf">Golf</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="league">League</label>
                <input 
                  type="text" 
                  id="league" 
                  name="league" 
                  value={formData.league} 
                  onChange={handleInputChange}
                  placeholder="NBA, NFL, etc."
                  style={{ position: 'relative', zIndex: 15 }}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="team">Team/Player</label>
                <input 
                  type="text" 
                  id="team" 
                  name="team" 
                  value={formData.team} 
                  onChange={handleInputChange}
                  required
                  placeholder="Your pick"
                  style={{ position: 'relative', zIndex: 15 }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="opponent">Opponent</label>
                <input 
                  type="text" 
                  id="opponent" 
                  name="opponent" 
                  value={formData.opponent} 
                  onChange={handleInputChange}
                  placeholder="Opposing team/player"
                  style={{ position: 'relative', zIndex: 15 }}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="betType">Bet Type</label>
                <select 
                  id="betType" 
                  name="betType" 
                  value={formData.betType} 
                  onChange={handleInputChange}
                  required
                  style={{ position: 'relative', zIndex: 15, background: 'rgba(30, 30, 30, 0.9)' }}
                >
                  <option value="moneyline">Moneyline</option>
                  <option value="spread">Spread</option>
                  <option value="total">Over/Under</option>
                  <option value="prop">Prop</option>
                  <option value="parlay">Parlay</option>
                  <option value="future">Future</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="odds">Odds</label>
                <input 
                  type="text" 
                  id="odds" 
                  name="odds" 
                  value={formData.odds} 
                  onChange={handleInputChange}
                  placeholder="+150, -110, etc."
                  required
                  style={{ position: 'relative', zIndex: 15 }}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stake">Stake Amount</label>
                <input 
                  type="number" 
                  id="stake" 
                  name="stake" 
                  value={formData.stake} 
                  onChange={handleInputChange}
                  placeholder="Amount wagered"
                  required
                  style={{ position: 'relative', zIndex: 15 }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="selectedDate">Date</label>
                <input 
                  type="date" 
                  id="selectedDate" 
                  name="selectedDate" 
                  value={formData.selectedDate} 
                  onChange={handleInputChange}
                  required
                  style={{ position: 'relative', zIndex: 15 }}
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="notes">Notes</label>
              <textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange}
                placeholder="Additional details, reasoning, etc."
                style={{ position: 'relative', zIndex: 15 }}
              />
            </div>
            
            <div className="form-actions">
              {editingId && (
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      sport: '',
                      league: '',
                      team: '',
                      opponent: '',
                      betType: 'moneyline',
                      odds: '',
                      stake: '',
                      selectedDate: new Date().toISOString().split('T')[0],
                      notes: ''
                    });
                  }}
                  style={{ position: 'relative', zIndex: 15 }}
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="submit-button" style={{ position: 'relative', zIndex: 15 }}>
                {editingId ? 'Update Bet' : 'Save Bet'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bet-history">
          <h3>Betting History</h3>
          
          <div className="history-instructions">
            <p>View your logged bets below. Click <strong>Edit</strong> to modify a bet or <strong>Delete</strong> to remove it completely.</p>
          </div>
          
          {bets.length === 0 ? (
            <div className="empty-history">
              <p>No bets logged yet. Start logging your bets to see them here.</p>
            </div>
          ) : (
            <div className="bet-cards">
              {bets.map(bet => (
                <div key={bet.id} className="bet-card card">
                  <div className="bet-header">
                    <h4>{bet.team} vs {bet.opponent}</h4>
                    <div className="bet-actions">
                      {deleteConfirmId === bet.id ? (
                        <div className="delete-confirmation">
                          <span>Delete this bet?</span>
                          <button 
                            className="confirm-delete-button" 
                            onClick={() => handleDelete(bet.id)}
                          >
                            Yes
                          </button>
                          <button 
                            className="cancel-delete-button" 
                            onClick={cancelDelete}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            className="edit-button" 
                            onClick={() => handleEdit(bet)}
                          >
                            <span className="action-icon">✏️</span> Edit
                          </button>
                          <button 
                            className="delete-button" 
                            onClick={() => confirmDelete(bet.id)}
                            style={{ color: '#fff', backgroundColor: '#f44336', fontWeight: 'bold' }}
                          >
                            <span className="action-icon">🗑️</span> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="bet-details">
                    <div className="bet-detail">
                      <span className="label">Sport:</span>
                      <span className="value">{bet.sport} {bet.league ? `(${bet.league})` : ''}</span>
                    </div>
                    <div className="bet-detail">
                      <span className="label">Bet Type:</span>
                      <span className="value">{bet.betType}</span>
                    </div>
                    <div className="bet-detail">
                      <span className="label">Odds:</span>
                      <span className="value">{bet.odds}</span>
                    </div>
                    <div className="bet-detail">
                      <span className="label">Stake:</span>
                      <span className="value">${bet.stake}</span>
                    </div>
                    <div className="bet-detail">
                      <span className="label">Date:</span>
                      <span className="value">{bet.selectedDate}</span>
                    </div>
                  </div>
                  {bet.notes && (
                    <div className="bet-notes">
                      <p>{bet.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BetLogger; 