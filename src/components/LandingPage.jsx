import { useState } from 'react'
import './LandingPage.css'

const LandingPage = ({ onStartGame }) => {
  const [numPlayers, setNumPlayers] = useState(2)
  const [players, setPlayers] = useState([
    { name: 'Player 1', color: 'red', symbol: '🔴' },
    { name: 'Player 2', color: 'blue', symbol: '🔵' },
    { name: 'Player 3', color: 'green', symbol: '🟢' },
    { name: 'Player 4', color: 'yellow', symbol: '🟡' }
  ])

  const handlePlayerNameChange = (index, name) => {
    const updatedPlayers = [...players]
    updatedPlayers[index].name = name
    setPlayers(updatedPlayers)
  }

  const handleStartGame = () => {
    const selectedPlayers = players.slice(0, numPlayers)
    onStartGame({ players: selectedPlayers })
  }

  return (
    <div className="landing-page">
      <h1>🎲 Ludo Game 🎲</h1>
      
      <div className="config-section">
        <h2>Game Setup</h2>
        
        <div className="player-count">
          <label>Number of Players: </label>
          <select 
            value={numPlayers} 
            onChange={(e) => setNumPlayers(parseInt(e.target.value))}
          >
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>
        </div>

        <div className="player-selection">
          <h3>Player Details:</h3>
          {players.slice(0, numPlayers).map((player, index) => (
            <div key={index} className="player-input">
              <span className="player-symbol">{player.symbol}</span>
              <input
                type="text"
                value={player.name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1} Name`}
              />
              <span 
                className="color-indicator" 
                style={{ backgroundColor: player.color }}
              ></span>
            </div>
          ))}
        </div>

        <button className="start-button" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  )
}

export default LandingPage