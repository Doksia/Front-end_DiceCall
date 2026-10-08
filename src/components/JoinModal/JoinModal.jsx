import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import './JoinModal.css';

export const JoinModal = ({ campaignId, onClose, onSuccess }) => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserCharacters = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/api/characters', 'GET');
        const list = Array.isArray(data) ? data : data.characters || [];
        setCharacters(list);
        if (list.length > 0) setSelectedCharacter(list[0]._id);
      } catch (err) {
        setError('We havent found your characters. Have you created anyone yet?');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCharacters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCharacter) return setError('You must select a character.');

    try {
      setSubmitting(true);
      setError('');
      await apiRequest('/requests', 'POST', {
        campaign: campaignId,
        character: selectedCharacter
      });

      onSuccess('Your request has been sent to the Dungeon Master!');
    } catch (err) {
      setError(err.message || 'Error to sent your request. Maybe this character has already been sent in a previous request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Apply to the campaign</h3>
        <p className="modal-subtitle">Select which character you want to use in this campaign</p>

        {loading && <p className="modal-status">Searching for your character sheets...</p>}

        {!loading && characters.length === 0 && (
          <div className="no-characters-alert">
            <p>⚠️ You haven't created any character for this game system!.</p>
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Close</button>
          </div>
        )}

        {!loading && characters.length > 0 && (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">⚠️ {error}</div>}

            <div className="form-group">
              <label htmlFor="charSelect">Select your Character</label>
              <select 
                id="charSelect" 
                value={selectedCharacter} 
                onChange={(e) => setSelectedCharacter(e.target.value)}
              >
                {characters.map(char => (
                  <option key={char._id} value={char._id}>
                    {char.name} ({char.class} - Level {char.level})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={submitting}>
                Cancelar
              </button>
              <button type="submit" className="btn-modal-submit" disabled={submitting}>
                {submitting ? 'Sending Request...' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};