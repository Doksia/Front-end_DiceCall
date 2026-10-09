import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import './DashboardDM.css';

export const DashboardDM = () => {
  const { user } = useContext(AuthContext);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [error, setError] = useState('');
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [editGameSystem, setEditGameSystem] = useState('');
  const [editFormat, setEditFormat] = useState('Online');
  const [editShortDescription, setEditShortDescription] = useState('');
  const [editCurrentPlayers, setEditCurrentPlayers] = useState(0);
  const [editMaxPlayers, setEditMaxPlayers] = useState(1);
  const [editLookingFor, setEditLookingFor] = useState('All');
  const [editCampaignLevel, setEditCampaignLevel] = useState(1);

  useEffect(() => {
    const fetchDMCampaigns = async () => {
      try {
        setLoadingCampaigns(true);
        const data = await apiRequest('/api/api/campaigns', 'GET');
        const campaignsList = Array.isArray(data) ? data : data.campaigns || [];
        const currentUserId = user?.id || user?._id;
        const filtered = campaignsList.filter(c => (c.dm?._id || c.dm) === currentUserId);
        setMyCampaigns(filtered);
      } catch (err) {
        setError('Error to load your campaigns.');
      } finally {
        setLoadingCampaigns(false);
      }
    };
    if (user?.id || user?._id) fetchDMCampaigns();
  }, [user]);

  const handleSelectCampaign = async (campaign) => {
    setSelectedCampaign(campaign);
    setIsEditingCampaign(false); 
    try {
      setLoadingRequests(true);
      setError('');
      
      const data = await apiRequest(`/api/requests/campaign/${campaign._id}`, 'GET');
      const finalRequestsList = Array.isArray(data) 
        ? data 
        : (data.requests || data.savedRequest || []);
        
      setRequests(finalRequestsList);
    } catch (err) {
      setError('Requests for this campaign could not be obtained.');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to disolve this campaign?')) return;
    try {
      await apiRequest(`/api/api/campaigns/${campaignId}`, 'DELETE');
      setMyCampaigns(prev => prev.filter(c => c._id !== campaignId));
      setSelectedCampaign(null);
      alert('Campaign successfully deleted.');
    } catch (err) {
      alert(err.message || 'Error disolving the campaign.');
    }
  };

   const handleSaveCampaignEdit = async () => {
    try {
      const updatedData = {
        game_system: editGameSystem,
        format: editFormat,
        short_description: editShortDescription,
        looking_for: editLookingFor,
        current_players: Number(editCurrentPlayers),
        currentPlayers: Number(editCurrentPlayers), 
        max_players: Number(editMaxPlayers),
        maxPlayers: Number(editMaxPlayers), 
        campaign_level: Number(editCampaignLevel)
      };

      const responseData = await apiRequest(`/api/api/campaigns/${selectedCampaign._id}`, 'PUT', updatedData);
      const mergedCampaign = { ...selectedCampaign, ...responseData };
      
      setSelectedCampaign(mergedCampaign);
      setMyCampaigns(prev => prev.map(c => c._id === mergedCampaign._id ? mergedCampaign : c));
      setIsEditingCampaign(false);
      alert('Campaign updated!');
    } catch (err) {
      alert(err.message || 'Error updating campaign configuration.');
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const updatedData = { 
        status: newStatus.toLowerCase() 
      };

      await apiRequest(`/api/requests/${requestId}`, 'POST', updatedData);
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: newStatus, request_status: newStatus } : req
      ));
      
      alert(`Request processed successfully.`);
    } catch (err) {
      alert(err.message || 'Error to process the status of the request.');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dungeon Master Screen</h1>
        <p>Manage your campaigns and players requests</p>
      </header>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="dashboard-layout">
        <aside className="campaigns-sidebar">
          <h3>My Campaigns</h3>
          {loadingCampaigns && <p className="loading-text">Searching campaigns...</p>}
          {!loadingCampaigns && myCampaigns.length === 0 && <p className="no-data-text">No campaigns found.</p>}
          <ul className="campaign-list">
            {myCampaigns.map(campaign => (
              <li 
                key={campaign._id}
                className={`campaign-item ${selectedCampaign?._id === campaign._id ? 'active' : ''}`}
                onClick={() => handleSelectCampaign(campaign)}
              >
                <strong>{campaign.title || `Campaign ${campaign.game_system}`}</strong>
                <span>{campaign.game_system} ({campaign.format})</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="requests-main">
          {!selectedCampaign ? (
            <div className="empty-state">
              <p>🔮 Select a campaign from the sidebar to inspect requests.</p>
            </div>
          ) : (
            <div className="campaign-detail-box">
              <div className="campaign-detail-header-row">
                <h2>Managing: {selectedCampaign.title || `Campaign ${selectedCampaign.game_system}`}</h2>
                <button type="button" className="btn-crud-delete-campaign" onClick={() => handleDeleteCampaign(selectedCampaign._id)}>
                  🗑️ Disolve Campaign
                </button>
              </div>

              {isEditingCampaign ? (
                <div className="campaign-edit-box">
                  <h3>Modify Campaign Options</h3>
                  <div className="form-group">
                    <label>Game System:</label>
                    <input type="text" value={editGameSystem} onChange={(e) => setEditGameSystem(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Format:</label>
                    <select value={editFormat} onChange={(e) => setEditFormat(e.target.value)}>
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <input type="text" value={editShortDescription} onChange={(e) => setEditShortDescription(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Current players:</label>
                    <input type="number" value={editCurrentPlayers} onChange={(e) => setEditCurrentPlayers(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Max players:</label>
                    <input type="number" min="1" value={editMaxPlayers} onChange={(e) => setEditMaxPlayers(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Campaign Level:</label>
                    <input type="number" min="1" value={editCampaignLevel} onChange={(e) => setEditCampaignLevel(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Looking for roles:</label>
                    <select value={editLookingFor} onChange={(e) => setEditLookingFor(e.target.value)}>
                      <option value="All">All</option>
                      <option value="Healer">Healer</option>
                      <option value="Tank">Tank</option>
                      <option value="Dps">Dps</option>
                      <option value="Healer and Tank">Healer and Tank</option>
                      <option value="Healer and Dps">Healer and Dps</option>
                      <option value="Tank and Dps">Tank and Dps</option>
                    </select>
                  </div>
                  <div className="crud-actions-row">
                    <button type="button" className="btn-crud-cancel" onClick={() => setIsEditingCampaign(false)}>Cancel</button>
                    <button type="button" className="btn-crud-save" onClick={handleSaveCampaignEdit}>Save Changes</button>
                  </div>
                </div>
              ) : (
                <div className="campaign-info-box">
                  <p>System: <strong>{selectedCampaign.game_system}</strong> | Format: <strong>{selectedCampaign.format}</strong></p>
                  <p>Description: <strong>{selectedCampaign.short_description || "No description provided."}</strong></p>
                  <p>Campaign Level: <strong>Lvl {selectedCampaign.campaign_level || 1}</strong></p>
                  <p>Players: <strong>{selectedCampaign.current_players} / {selectedCampaign.max_players}</strong></p>
                  <p>Looking for: <strong>{selectedCampaign.looking_for}</strong></p>
                  <button type="button" className="btn-crud-edit-campaign" onClick={() => {
                    setEditGameSystem(selectedCampaign.game_system || '');
                    setEditFormat(selectedCampaign.format || 'Online');
                    setEditShortDescription(selectedCampaign.short_description || '');
                    setEditCurrentPlayers(selectedCampaign.current_players || 0);
                    setEditMaxPlayers(selectedCampaign.max_players || 1);
                    setEditLookingFor(selectedCampaign.looking_for || 'All');
                    setEditCampaignLevel(selectedCampaign.campaign_level || 1);
                    setIsEditingCampaign(true);
                  }}>
                    📝 Edit Table Configuration
                  </button>
                </div>
              )}

              <h3 className="section-divider-title">Campaign Applications</h3>
              {loadingRequests && <p className="loading-text">Reading requests...</p>}
              {!loadingRequests && requests.length === 0 && <p className="no-data-text">No applications yet.</p>}
              
             <div className="requests-list">
                {requests.map(req => (
                  <div key={req._id} className="request-row-card">
                    <div className="applicant-info">
                      <h4>{req.character?.name || 'Anonymous Adventurer'}</h4>
                      <p>👤 <strong>Player:</strong> {req.applicant?.name || 'Hidden'}</p>
                      <p>⚔️ <strong>Sheet:</strong> {req.character?.race} {req.character?.class} (Level {req.character?.level})</p>
                    </div>
                      <div className="request-actions">
                      {(req.status?.toLowerCase() === 'pending' || req.request_status?.toLowerCase() === 'pending') ? (
                        <>
                          <button type="button" className="btn-action-reject" onClick={() => handleStatusChange(req._id, 'Rejected')}>Reject</button>
                          <button type="button" className="btn-action-accept" onClick={() => handleStatusChange(req._id, 'Accepted')}>Accept</button>
                        </>
                      ) : (
                        <span className={`status-badge ${(req.status || req.request_status)?.toLowerCase() || 'pending'}`}>
                          {req.status || req.request_status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};