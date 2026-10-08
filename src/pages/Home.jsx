import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { GameCard } from '../components/GameCard/GameCard';
import { JoinModal } from '../components/JoinModal/JoinModal';
import './Home.css';

export const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchSystem, setSearchSystem] = useState('');
  const [filterFormat, setFilterFormat] = useState('All');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/api/campaigns', 'GET');
        
        const campaignsList = Array.isArray(data) ? data : data.campaigns || [];
        setCampaigns(campaignsList);
        setFilteredCampaigns(campaignsList);
      } catch (err) {
        setError(err.message || "Couldn't find any campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    let result = campaigns;

    if (searchSystem) {
      result = result.filter(c => 
        c.game_system.toLowerCase().includes(searchSystem.toLowerCase())
      );
    }

    if (filterFormat !== 'All') {
      result = result.filter(c => c.format === filterFormat);
    }

    setFilteredCampaigns(result);
  }, [searchSystem, filterFormat, campaigns]);

 const handleJoinCampaign = (campaignId) => {
  setActiveCampaignId(campaignId);
  setShowModal(true);
};
const handleRequestSuccess = (message) => {
  alert(message);
  setShowModal(false);
  setActiveCampaignId(null);
};

  if (loading) return <div className="loading-screen">📜 Looking for the dices (Loading)...</div>;

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Campaigns</h1>
        <p>Create your own campaign or join one that already exist</p>
      </header>

      <div className="filter-bar">
        <input 
          type="text" 
          placeholder="🔍 Search by Game_system (Ex: dnd, pathfinder)..."
          value={searchSystem}
          onChange={(e) => setSearchSystem(e.target.value)}
          className="filter-input"
        />
        
        <select 
          value={filterFormat} 
          onChange={(e) => setFilterFormat(e.target.value)}
          className="filter-select"
        >
          <option value="All">All the formats</option>
          <option value="Online">Online</option>
          <option value="In-person">In-person</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {/* Grid de Campañas */}
      {filteredCampaigns.length === 0 ? (
        <p className="no-games">There aren't any campaigns with those filters, try other ones.</p>
      ) : (
        <div className="campaigns-grid">
          {filteredCampaigns.map((campaign) => (
            <GameCard 
              key={campaign._id} 
              campaign={campaign} 
              onJoin={handleJoinCampaign} 
            />
             ))}
        </div> 
        )} {showModal && (
  <JoinModal 
    campaignId={activeCampaignId} 
    onClose={() => setShowModal(false)} 
    onSuccess={handleRequestSuccess}
  />
)}
    </div>
  );
};