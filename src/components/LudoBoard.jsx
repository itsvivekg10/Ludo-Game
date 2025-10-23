import './LudoBoard.css'

const LudoBoard = ({ players, pieces, currentPlayer, onPieceClick, movablePieces }) => {
  const boardSize = 600
  const cellSize = boardSize / 15

  // Board coordinates and paths
  const homeBases = [
    { x: 1, y: 1, color: 'red' },      // Player 0 - Top-left
    { x: 11, y: 1, color: 'blue' },    // Player 1 - Top-right
    { x: 11, y: 11, color: 'green' },  // Player 2 - Bottom-right
    { x: 1, y: 11, color: 'yellow' }   // Player 3 - Bottom-left
  ]

  const startPositions = [51, 12, 25, 38] // Starting positions for each player

  const getCellPosition = (position) => {
    if (position === -1) return null // Piece in home yard

    const path = [
      // Main path coordinates (simplified)
      { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 }, { x: 10, y: 1 },
      { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 },
      { x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 },
      { x: 5, y: 6 }, { x: 5, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 2 },
      { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
      { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 2, y: 7 }, { x: 3, y: 7 },
      { x: 4, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 },
      { x: 6, y: 11 }, { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 },
      { x: 11, y: 10 }, { x: 11, y: 9 }, { x: 11, y: 8 }, { x: 10, y: 7 }, { x: 9, y: 7 },
      { x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 }, { x: 8, y: 7 },
      { x: 9, y: 7 }, { x: 10, y: 7 }, { x: 11, y: 6 }
    ]

    return path[position % path.length]
  }

  const getHomePosition = (playerIndex, pieceIndex) => {
    const base = homeBases[playerIndex]
    const positions = [
      { x: base.x + 1, y: base.y + 1 },
      { x: base.x + 2, y: base.y + 1 },
      { x: base.x + 1, y: base.y + 2 },
      { x: base.x + 2, y: base.y + 2 }
    ]
    return positions[pieceIndex]
  }

  const isPieceMovable = (playerIndex, pieceId) => {
    return movablePieces.some(piece => piece.id === pieceId && pieces[playerIndex]?.[pieceId]?.position === piece.position)
  }

  return (
    <div className="ludo-board" style={{ width: boardSize, height: boardSize }}>
      {/* Board Background */}
      <div className="board-background">
        {/* Center */}
        <div className="center-area"></div>
        
        {/* Home bases */}
        {homeBases.map((base, index) => (
          <div
            key={index}
            className="home-base"
            style={{
              left: base.x * cellSize,
              top: base.y * cellSize,
              width: 3 * cellSize,
              height: 3 * cellSize,
              backgroundColor: base.color
            }}
          ></div>
        ))}

        {/* Path cells */}
        {Array.from({ length: 15 }, (_, x) =>
          Array.from({ length: 15 }, (_, y) => {
            if ((x >= 6 && x <= 8 && y >= 6 && y <= 8) || 
                (x < 6 && y < 6) || (x > 8 && y < 6) || 
                (x > 8 && y > 8) || (x < 6 && y > 8)) {
              return null
            }
            return (
              <div
                key={`${x}-${y}`}
                className="path-cell"
                style={{
                  left: x * cellSize,
                  top: y * cellSize,
                  width: cellSize,
                  height: cellSize
                }}
              ></div>
            )
          })
        )}
      </div>

      {/* Game Pieces */}
      {Object.entries(pieces).map(([playerIndex, playerPieces]) =>
        playerPieces.map((piece, pieceIndex) => {
          let position
          if (piece.position === -1) {
            // Piece in home yard
            position = getHomePosition(parseInt(playerIndex), pieceIndex)
          } else {
            // Piece on board
            const boardPos = getCellPosition(piece.position)
            if (!boardPos) return null
            position = boardPos
          }

          const isMovable = isPieceMovable(parseInt(playerIndex), pieceIndex)
          const isCurrentPlayer = parseInt(playerIndex) === currentPlayer

          return (
            <div
              key={`${playerIndex}-${pieceIndex}`}
              className={`game-piece ${isMovable ? 'movable' : ''} ${isCurrentPlayer ? 'current-player' : ''}`}
              style={{
                left: position.x * cellSize + cellSize / 4,
                top: position.y * cellSize + cellSize / 4,
                width: cellSize / 2,
                height: cellSize / 2,
                backgroundColor: players[playerIndex]?.color,
                cursor: isMovable ? 'pointer' : 'default'
              }}
              onClick={() => isMovable && onPieceClick(parseInt(playerIndex), pieceIndex)}
            >
              <span className="piece-symbol">{players[playerIndex]?.symbol}</span>
            </div>
          )
        })
      )}

      {/* Start positions */}
      {startPositions.map((pos, index) => {
        const position = getCellPosition(pos)
        if (!position) return null
        return (
          <div
            key={`start-${index}`}
            className="start-position"
            style={{
              left: position.x * cellSize,
              top: position.y * cellSize,
              width: cellSize,
              height: cellSize,
              backgroundColor: homeBases[index].color,
              opacity: 0.5
            }}
          ></div>
        )
      })}
    </div>
  )
}

export default LudoBoard