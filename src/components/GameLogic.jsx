import React, { createContext, useContext, useState, useMemo } from "react";
import {
  playerOrder,
  startMoves,
  moves as MOVES,
  starIndexes,
  colorMap,
} from "../config/constants";

// optional sounds (safe if files missing)
import diceSnd from "../assets/sounds/dice-roll.mp3";
import moveSnd from "../assets/sounds/move.mp3";
import captureSnd from "../assets/sounds/capture.mp3";
import winSnd from "../assets/sounds/win.mp3";

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

/* INITIAL STATES */
const initialCoins = () => {
  const base = {};
  playerOrder.forEach((p) => {
    const prefix = p[0]; // p, y, r, t
    base[p] = {};
    for (let i = 0; i < 4; i++) {
      base[p][`${prefix}${i}`] = { position: "home" };
    }
  });
  return base;
};

const initialBlocks = () => {
  return {};
};

/* Lightweight deep clone helper — avoids lodash dependency */
function clone(obj) {
  if (typeof structuredClone === "function") return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj));
}

/* play sound safely */
function playSound(src) {
  try {
    if (!src) return;
    new Audio(src).play();
  } catch (e) {
    // ignore sound failures
  }
}

export default function GameLogicProvider({ children }) {
  const [playersList, setPlayersList] = useState([...playerOrder]); // default 4 players
  const [currentPlayer, setCurrentPlayer] = useState(playersList[0]);
  const [dice, setDice] = useState({ num: 0, isLocked: false, lastRolledBy: null });
  const [coins, setCoins] = useState(initialCoins());
  const [blocks, setBlocks] = useState(initialBlocks());
  const [winners, setWinners] = useState([]); // finished players
  const [turnLocked, setTurnLocked] = useState(false);

  /* helper: compute next move for a token given dice number */
  const getNextMove = (player, coinKey, diceNum) => {
    if (!player || !coinKey) return null;
    const pos =
      coins[player] && coins[player][coinKey] ? coins[player][coinKey].position : "home";
    const playerMoves = MOVES[player];
    if (!playerMoves) return null;

    if (pos === "home") {
      // only come out when dice is 6
      return diceNum === 6 ? startMoves[player] : null;
    }
    if (typeof pos === "string" && pos.includes("-won")) return null;

    const idx = playerMoves.indexOf(pos);
    if (idx === -1) return null;
    const newIdx = idx + diceNum;
    if (newIdx >= playerMoves.length) return null;
    return playerMoves[newIdx];
  };

  /* can any token of player move with diceNum? */
  const canAnyMove = (player, diceNum) => {
    if (!diceNum) return false;
    const playerCoins = coins[player];
    if (!playerCoins) return false;
    return Object.keys(playerCoins).some((ck) => {
      const next = getNextMove(player, ck, diceNum);
      return next !== null;
    });
  };

  /* Reset a specific token to home (used on capture) */
  const resetToHome = (coinKey) => {
    const color = colorMap[coinKey[0]];
    setCoins((prev) => {
      const cloneCoins = clone(prev);
      if (cloneCoins[color] && cloneCoins[color][coinKey]) {
        cloneCoins[color][coinKey].position = "home";
      }
      return cloneCoins;
    });

    // Also remove this token from any block entries
    setBlocks((prev) => {
      const cloneBlocks = clone(prev);
      Object.keys(cloneBlocks).forEach((k) => {
        cloneBlocks[k] = cloneBlocks[k].filter((t) => t !== coinKey);
        if (cloneBlocks[k].length === 0) delete cloneBlocks[k];
      });
      return cloneBlocks;
    });
  };

  /* Apply a move: update coins and blocks, handle captures and winners */
  const applyMove = (player, coinKey, nextBox, diceNum) => {
    if (!player || !coinKey || !nextBox) return;

    // Update coins (functional set to avoid stale)
    setCoins((prevCoins) => {
      const newCoins = clone(prevCoins);
      if (newCoins[player] && newCoins[player][coinKey]) {
        newCoins[player][coinKey].position = nextBox;
      }
      return newCoins;
    });

    // Update blocks: remove token from any old block(s) and add to the new one
    setBlocks((prevBlocks) => {
      const newBlocks = clone(prevBlocks);

      // remove tokenKey from any block where it appears
      Object.keys(newBlocks).forEach((key) => {
        newBlocks[key] = newBlocks[key].filter((t) => t !== coinKey);
        if (newBlocks[key].length === 0) delete newBlocks[key];
      });

      // add to target block (use Set to avoid duplicates)
      newBlocks[nextBox] = Array.from(new Set([...(newBlocks[nextBox] || []), coinKey]));
      return newBlocks;
    });

    // small delay then check for capture (so blocks state has time to update)
    setTimeout(() => {
      setBlocks((currBlocks) => {
        const cloneBlocks = clone(currBlocks);
        if (!cloneBlocks[nextBox]) return cloneBlocks;

        // if this is a star (safe) full keyed index, skip capture
        if (starIndexes.includes(nextBox)) return cloneBlocks;

        const occupants = cloneBlocks[nextBox] || [];
        const colorsPresent = Array.from(new Set(occupants.map((x) => x[0])));

        if (colorsPresent.length > 1) {
          // tokens not same color as the moving token get sent home
          const killed = occupants.filter((c) => c[0] !== coinKey[0]);
          if (killed.length) {
            playSound(captureSnd);
            killed.forEach(resetToHome);
            // keep only same-color tokens on the square
            cloneBlocks[nextBox] = occupants.filter((c) => c[0] === coinKey[0]);
          }
        }
        return cloneBlocks;
      });
    }, 120);

    // Play move sound
    playSound(moveSnd);

    // Winner handling (if reached -won)
    if (String(nextBox).endsWith("-won")) {
      playSound(winSnd);
      setWinners((prev) => {
        if (prev.includes(player)) return prev;
        return [...prev, player];
      });
    }
  };

  /* End turn — advance to next active (non-winner) player */
  const endTurn = (forceNext = false) => {
    setCurrentPlayer((cur) => {
      if (!playersList || playersList.length === 0) return cur;
      const idx = playersList.indexOf(cur);
      let candidate = playersList[(idx + 1) % playersList.length];
      let tries = 0;
      while (winners.includes(candidate) && tries < playersList.length) {
        tries++;
        candidate = playersList[(playersList.indexOf(candidate) + 1) % playersList.length];
      }
      // reset dice for the next player
      setDice({ num: 0, isLocked: false, lastRolledBy: cur });
      return candidate;
    });
  };

  /* Roll dice: set dice, lock it; if no moves available, auto pass */
  const rollDice = () => {
    if (turnLocked || dice.isLocked) return;
    playSound(diceSnd);
    const value = Math.ceil(Math.random() * 6);
    setDice({ num: value, isLocked: true, lastRolledBy: currentPlayer });

    // If current player cannot make any move with this value, auto pass after short delay
    if (!canAnyMove(currentPlayer, value)) {
      setTimeout(() => {
        setDice({ num: 0, isLocked: false, lastRolledBy: currentPlayer });
        endTurn();
      }, 600);
    }

    return value;
  };

  /* When a token is clicked */
  const onTokenClick = (player, tokenKey) => {
    // only current player's tokens can be moved
    if (player !== currentPlayer) return;
    // ensure dice is rolled and locked (i.e., roll occurred)
    if (!dice.num || !dice.isLocked) return;

    const next = getNextMove(player, tokenKey, dice.num);
    if (!next) {
      // cannot move this token
      return;
    }

    // perform move
    applyMove(player, tokenKey, next, dice.num);

    // if dice was 6 -> same player continues (unlock dice)
    if (dice.num === 6) {
      setTimeout(() => {
        setDice({ num: 0, isLocked: false, lastRolledBy: currentPlayer });
      }, 300);
    } else {
      // otherwise end turn after a short delay
      setTimeout(() => {
        endTurn();
      }, 350);
    }
  };

  /* Reset game for given player count (1..4) */
  const resetGame = (players = 4) => {
    const plist = playerOrder.slice(0, players);
    setPlayersList(plist);
    setCurrentPlayer(plist[0]);
    setCoins(initialCoins());
    setBlocks(initialBlocks());
    setWinners([]);
    setDice({ num: 0, isLocked: false, lastRolledBy: null });
  };

  const value = useMemo(
    () => ({
      playersList,
      setPlayersList,
      currentPlayer,
      setCurrentPlayer,
      dice,
      setDice,
      rollDice,
      coins,
      blocks,
      onTokenClick,
      winners,
      resetGame,
      canAnyMove,
    }),
    [playersList, currentPlayer, dice, coins, blocks, winners]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
