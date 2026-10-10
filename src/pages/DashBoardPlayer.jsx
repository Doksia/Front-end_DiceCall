import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import './DashboardPlayer.css';

export const DashboardPlayer = () => {
  const [characters, setCharacters] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCharId, setEditingCharId] = useState(null);
  
  const [editName, setEditName] = useState('');
  const [editGameSystem, setEditGameSystem] = useState('');
  const [editRace, setEditRace] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editLevel, setEditLevel] = useState(1);
  const [editAlignment, setEditAlignment] = useState('');

   const fetchPlayerData = async () => {
    try {
      setLoading(true);
      setError('');
      const charData = await apiRequest('/api/api/characters/myCharacters', 'GET');
      const charList = Array.isArray(charData) ? charData : charData.characters || [];
      setCharacters(charList);
      const reqData = await apiRequest('/api/requests', 'GET');
      const reqList = Array.isArray(reqData) ? reqData : reqData.requests || [];
      setRequests(reqList);

    } catch (err) {
      setError('Your character data could not be retrieved from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const handleDeleteCharacter = async (charId) => {
    if (!window.confirm('Are you sure you want to permanently delete this character?')) return;
    
    try {
      await apiRequest(`/api/api/characters/${charId}`, 'DELETE');
      setCharacters(prev => prev.filter(char => char._id !== charId));
      alert('Character sheet deleted successfully.');
    } catch (err) {
      alert(err.message || 'Error deleting character sheet.');
    }
  };

  const startEdit = (char) => {
    setEditingCharId(char._id);
    setEditName(char.name);
    setEditGameSystem(char.game_system);
    setEditRace(char.race);
    setEditClass(char.class);
    setEditLevel(char.level);
    setEditAlignment(char.alignment);
  };

  const handleSaveEdit = async (charId) => {
    const originalChar = characters.find(char => char._id === charId);
    if (!originalChar) return;

    try {
      const updatedData = {
        name: editName,
        game_system: editGameSystem,
        race: editRace,
        class: editClass, 
        level: Number(editLevel),
        alignment: editAlignment
      };

      const responseData = await apiRequest(`/api/api/characters/${charId}`, 'PUT', updatedData);
     setCharacters(prev => prev.map(char => 
        char._id === charId ? { ...char, ...responseData } : char
      ));
      
      setEditingCharId(null);
      alert('Character sheet updated!');
    } catch (err) {
      alert(err.message || 'Error updating character sheet.');
    }
  };

  const handleDeleteRequest = async (requestId) => {
  try {
    await apiRequest(`/api/requests/${requestId}`, 'DELETE');
    setRequests(prev => prev.filter(req => req._id !== requestId));
  } catch (err) {
    alert(err.message || 'Error clearing the request.');
  }
};

  if (loading) return <div className="loading-screen">🎒 Checking your characters sheets...</div>;

  return (
    <div className="player-dashboard-container">
      <header className="player-dashboard-header">
        <h1>Adventurers Screen</h1>
        <p>Manage your created characters and your requests of each campaign</p>
      </header>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="player-dashboard-grid">
       
        <section className="player-section">
          <h2>⚔️ My Characters ({characters.length})</h2>
          {characters.length === 0 ? (
            <p className="no-data-text">You haven't created any character sheet yet. Go and create your first character!</p>
          ) : (
            <div className="player-cards-container">
              {characters.map(char => (
                <div key={char._id} className="player-char-card">
                  {editingCharId === char._id ? (
                    <div className="edit-form-inline">
                      <h3>Editing {char.name}</h3>
                      <div className="form-group">
                        <label>Name:</label>
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Game System:</label>
                        <input type="text" value={editGameSystem} onChange={(e) => setEditGameSystem(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Race:</label>
                        <input type="text" value={editRace} onChange={(e) => setEditRace(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Class/Subclass:</label>
                        <input type="text" value={editClass} onChange={(e) => setEditClass(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Level:</label>
                        <input type="number" min="1" value={editLevel} onChange={(e) => setEditLevel(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Alignment:</label>
                        <input type="text" value={editAlignment} onChange={(e) => setEditAlignment(e.target.value)} />
                      </div>
                      <div className="crud-actions-row">
                        <button type="button" className="btn-crud-cancel" onClick={() => setEditingCharId(null)}>Cancel</button>
                        <button type="button" className="btn-crud-save" onClick={() => handleSaveEdit(char._id)}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3>{char.name}</h3>
                      <div className="char-badge-row">
                        <span className="char-system">{char.game_system}</span>
                        <span className="char-level">Level {char.level}</span>
                      </div>
                      <p>👤 <strong>Race:</strong> {char.race}</p>
                      <p>🛡️ <strong>Class:</strong> {char.class}</p>
                      <p>🎭 <strong>Alignment:</strong> {char.alignment}</p>
                      
                      <div className="crud-actions-row">
                        <button type="button" className="btn-crud-edit" onClick={() => startEdit(char)}>📝 Edit</button>
                        <button type="button" className="btn-crud-delete" onClick={() => handleDeleteCharacter(char._id)}>🗑️ Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="player-section">
          <h2>📜 My Applications ({requests.length})</h2>
          {requests.length === 0 ? (
            <p className="no-data-text">You haven't applied for any campaigns yet. Go to the tabern to apply for joining a campaign.</p>
          ) : (
            <div className="player-requests-container">
              {requests.map(req => (
                <div key={req._id} className="player-request-card">
                  <div className="req-header">
                    <h4>{req.campaign?.title || `Campaign of ${req.campaign?.game_system || 'Roleplay'}`}</h4>
                    <span className={`status-tag ${req.request_status?.toLowerCase() || 'pending'}`}>
                      {req.request_status === 'Pending' && '⏳ Pending'}
                      {req.request_status === 'Accepted' && '🛡️ Accepted'}
                      {req.request_status === 'Rejected' && '❌ Rejected'}
                      {req.request_status === 'Not requested' && '⚠️ Not requested'}
                    </span>
                  </div>
                  <p>👤 <strong>Character sent:</strong> {req.character?.name || 'Deleted sheet'}</p>
                  <p>🎙️ <strong>Format:</strong> {req.campaign?.format || 'Online'}</p>
                  <p className="req-date">Sent the: {new Date(req.createdAt).toLocaleDateString()}</p>
                  
                  {req.request_status === 'Accepted' && req.campaign?.communication_link && (
  <div className="join-communication-zone" style={{ marginTop: '15px', padding: '12px', backgroundColor: '#e6f4ea', borderRadius: '6px', border: '1px solid #b7e1cd' }}>
    <p style={{ margin: '0 0 8px 0', color: '#137333', fontWeight: 'bold' }}>🎉 You've been accepted to the party!</p>
    
    {/^(https?:\/\/|www\.)/i.test(req.campaign.communication_link) ? (
      <a 
        href={req.campaign.communication_link.startsWith('www.') ? `https://${req.campaign.communication_link}` : req.campaign.communication_link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="btn-join-table"
        style={{
          display: 'inline-block',
          backgroundColor: '#1b5e20',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '0.9em',
          textAlign: 'center'
        }}
      >
        💬 Join Game Space
      </a>
    ) : (
      <div style={{ backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '4px', border: '1px solid #cce5ff', marginTop: '5px' }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '0.85em', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          📌 DM Contact Info:
        </p>
        <strong style={{ color: '#2b2b2b', fontSize: '1.05em', wordBreak: 'break-word' }}>
          {req.campaign.communication_link}
        </strong>
      </div>
    )}
  </div>
)}

{req.request_status === 'Accepted' && !req.campaign?.communication_link && (
  <div style={{ marginTop: '10px', color: '#666', fontSize: '0.9em', fontStyle: 'italic' }}>
    Waiting for the DM to set up the game link...
  </div>
)}
                 
                  {req.request_status !== 'Pending' && (
                    <div className="req-actions-row" style={{ marginTop: '12px', textAlign: 'right' }}>
                      <button 
                        type="button" 
                        className="btn-clear-request" 
                        onClick={() => handleDeleteRequest(req._id)}
                        style={{ 
                          cursor: 'pointer', 
                          padding: '6px 12px', 
                          borderRadius: '4px', 
                          border: '1px solid #dcdcdc',
                          backgroundColor: '#f9f9f9',
                          fontWeight: '500'
                        }}
                      >
                        🗑️ Clear Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};