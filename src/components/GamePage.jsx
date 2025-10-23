import { useState, useEffect } from 'react'
import LudoBoard from './LudoBoard'
import './GamePage.css'

const GamePage = ({ gameConfig, onEndGame, onRestart }) => {
  const { players } = gameConfig
  const [gameState, setGameState] = useState({
    currentPlayer: 0,
    diceValue: 0,
    hasRolled: false,
    canMove: false,
    sixCount: 0
  })

  const [pieces, setPieces] = useState({})
  const [winner, setWinner] = useState(null)

  // Initialize pieces
  useEffect(() => {
    const initialPieces = {}
    players.forEach((player, playerIndex) => {
      initialPieces[playerIndex] = Array(4).fill().map((_, pieceIndex) => ({
        id: pieceIndex,
        position: -1, // -1 means in home yard
        completed: false
      }))
    })
    setPieces(initialPieces)
  }, [players])

  const rollDice = () => {
    if (gameState.hasRolled && gameState.diceValue !== 6) return

    const value = Math.floor(Math.random() * 6) + 1
    const newSixCount = value === 6 ? gameState.sixCount + 1 : 0
    
    setGameState({
      currentPlayer: gameState.currentPlayer,
      diceValue: value,
      hasRolled: true,
      canMove: true,
      sixCount: newSixCount
    })
  }

  const movePiece = (playerIndex, pieceIndex) => {
    if (!gameState.canMove || playerIndex !== gameState.currentPlayer) return

    const playerPieces = [...pieces[playerIndex]]
    const piece = playerPieces[pieceIndex]
    
    if (piece.completed) return

    let newPosition
    if (piece.position === -1) {
      // Piece is in home yard, can only move if dice is 6
      if (gameState.diceValue === 6) {
        newPosition = getStartPosition(playerIndex)
      } else {
        return
      }
    } else {
      newPosition = (piece.position + gameState.diceValue) % 52
    }

    // Check if piece can complete
    if (isInFinalPath(playerIndex, piece.position, gameState.diceValue)) {
      const finalPosition = piece.position + gameState.diceValue
      if (finalPosition >= 57) { // 52 main + 5 final path
        playerPieces[pieceIndex] = { ...piece, completed: true }
        
        // Check if player won
        if (playerPieces.every(p => p.completed)) {
          setWinner(players[playerIndex])
          onEndGame(players[playerIndex])
          return
        }
      } else {
        playerPieces[pieceIndex] = { ...piece, position: finalPosition }
      }
    } else {
      playerPieces[pieceIndex] = { ...piece, position: newPosition }
      
      // Check for captures
      checkCapture(playerIndex, newPosition)
    }

    const newPieces = { ...pieces, [playerIndex]: playerPieces }
    setPieces(newPieces)

    // Move to next player if dice wasn't 6
    const nextPlayer = gameState.diceValue === 6 ? gameState.currentPlayer : (gameState.currentPlayer + 1) % players.length
    
    setGameState({
      currentPlayer: nextPlayer,
      diceValue: 0,
      hasRolled: false,
      canMove: false,
      sixCount: gameState.diceValue === 6 ? gameState.sixCount : 0
    })
  }

  const getStartPosition = (playerIndex) => {
    return playerIndex * 13
  }

  const isInFinalPath = (playerIndex, currentPosition, diceValue) => {
    const startFinalPath = 51
    const playerFinalStart = (startFinalPath + playerIndex * 6) % 52
    return currentPosition >= playerFinalStart && currentPosition < playerFinalStart + 6
  }

  const checkCapture = (currentPlayerIndex, newPosition) => {
    Object.entries(pieces).forEach(([playerIndex, playerPieces]) => {
      if (parseInt(playerIndex) === currentPlayerIndex) return
      
      playerPieces.forEach((piece, pieceIndex) => {
        if (piece.position === newPosition && piece.position !== -1 && !piece.completed) {
          // Capture this piece
          const updatedPieces = { ...pieces }
          updatedPieces[playerIndex][pieceIndex] = { ...piece, position: -1 }
          setPieces(updatedPieces)
        }
      })
    })
  }

  const getMovablePieces = () => {
    const currentPlayerPieces = pieces[gameState.currentPlayer] || []
    return currentPlayerPieces.filter(piece => {
      if (piece.completed) return false
      if (piece.position === -1) return gameState.diceValue === 6
      return true
    })
  }

  const movablePieces = getMovablePieces()

  return (
    <div className="game-page">
      <div className="game-header">
        <h1>Ludo Game</h1>
        <button className="restart-button" onClick={onRestart}>
          Restart Game
        </button>
      </div>

      <div className="game-container">
        <LudoBoard 
          players={players}
          pieces={pieces}
          currentPlayer={gameState.currentPlayer}
          onPieceClick={movePiece}
          movablePieces={movablePieces}
        />

        <div className="game-controls">
          <div className="dice-section">
            <div className={`dice ${!gameState.hasRolled ? 'rollable' : ''}`} onClick={rollDice}>
              {gameState.diceValue || '?'}
            </div>
            <p>{!gameState.hasRolled ? 'Click to roll dice' : 'Select a piece to move'}</p>
          </div>

          <div className="game-info">
            <h3>Current Turn:</h3>
            <div className="current-player-info">
              <span 
                className="player-color" 
                style={{ backgroundColor: players[gameState.currentPlayer]?.color }}
              ></span>
              <span>{players[gameState.currentPlayer]?.name}</span>
              <span>{players[gameState.currentPlayer]?.symbol}</span>
            </div>
            
            {movablePieces.length === 0 && gameState.hasRolled && (
              <p className="no-moves">No moves available. Next player's turn.</p>
            )}
          </div>
        </div>
      </div>

      {winner && (
        <div className="winner-overlay">
          <div className="winner-message">
            <h2>🎉 {winner.name} Wins! 🎉</h2>
            <button onClick={() => onEndGame(winner)}>Continue</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GamePage