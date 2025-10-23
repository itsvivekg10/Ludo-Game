import './WinnerPage.css'

const WinnerPage = ({ winner, onRestart }) => {
  return (
    <div className="winner-page">
      <div className="winner-card">
        <h1>🎉 Congratulations! 🎉</h1>
        <div className="winner-info">
          <div className="winner-symbol">{winner?.symbol}</div>
          <h2 className="winner-name">{winner?.name}</h2>
          <p className="winner-message">is the Winner!</p>
        </div>
        <button className="play-again-button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default WinnerPage