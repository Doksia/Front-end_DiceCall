import './GameCard.css';

export const GameCard = ({ campaign, onJoin }) => {
  const { 
    _id,
    game_system, 
    format, 
    short_description, 
    looking_for, 
    current_players, 
    max_players, 
    campaign_level,
    status 
  } = campaign;

  return (
    <div className={`game-card ${status === 'Full' ? 'card-full' : ''}`}>
      <div className="game-card-header">
        <span className="game-format">{format}</span>
        <span className="game-system">{game_system}</span>
      </div>
      
      <p className="game-level">⚔️ Actual level: <strong>{campaign_level}</strong></p>
      
      <p className="game-desc">
        {short_description || 'The DM needs to write the campaign description'}
      </p>
      
      <div className="game-tags">
        <span className="tag-role">Search: <strong>{looking_for}</strong></span>
      </div>
      
      <div className="game-card-footer">
        <span className="game-slots">
          👥 Adventurers: <strong>{current_players} / {max_players}</strong>
        </span>
        <button 
          className="btn-join" 
          disabled={status === 'Full'}
          onClick={() => onJoin(_id)}
        >
          {status === 'Full' ? 'Party Full' : 'Join the group'}
        </button>
      </div>
    </div>
  );
};