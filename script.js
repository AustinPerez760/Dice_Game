'use strict';

// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.querySelector('#current--0');
const current1El = document.querySelector('#current--1');
const rolls0El = document.getElementById('rolls-0');
const rolls1El = document.getElementById('rolls-1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

// Game state
let activePlayer = 0;
let playing = true;
let rollsLeft = { 0: 6, 1: 6 };
let playerTotals = { 0: 0, 1: 0 };
let currentRolls = [];

// Function to update rolls display
const updateRollsDisplay = () => {
  rolls0El.textContent = rollsLeft[0];
  rolls1El.textContent = rollsLeft[1];
};

// Function to reset the game
const newGame = () => {
  activePlayer = 0;
  playing = true;
  rollsLeft = { 0: 6, 1: 6 };
  playerTotals = { 0: 0, 1: 0 };
  currentRolls = [];

  // Reset display
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 'Ready to roll';
  current1El.textContent = 'Waiting...';
  updateRollsDisplay();
  
  // Reset classes
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.remove('player--bust');
  player1El.classList.remove('player--bust');
  
  // Show buttons
  btnRoll.style.display = 'block';
  btnHold.style.display = 'block';
  
  // Enable buttons
  btnRoll.disabled = false;
  btnHold.disabled = false;
  btnRoll.classList.remove('btn--disabled');
  btnHold.classList.remove('btn--disabled');
  
  // Hide dice
  diceEl.classList.add('hidden');
  
  // Remove winner display if exists
  const winnerDisplay = document.querySelector('.winner-display');
  if (winnerDisplay) {
    winnerDisplay.remove();
  }
};

// Function to check if total is over 21
const isBust = (total) => total > 21;

// Function to switch players
const switchPlayer = () => {
  const total = currentRolls.reduce((sum, roll) => sum + roll, 0);
  playerTotals[activePlayer] = total;
  document.getElementById(`score--${activePlayer}`).textContent = total;
  
  // Check if player went bust
  if (isBust(total)) {
    document.getElementById(`current--${activePlayer}`).textContent = `Bust! (${total})`;
    document.querySelector(`.player--${activePlayer}`).classList.add('player--bust');
  } else {
    document.getElementById(`current--${activePlayer}`).textContent = `Final: ${total}`;
  }
  
  // Switch player
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentRolls = [];
  rollsLeft = { 0: 6, 1: 6 };
  updateRollsDisplay();
  
  // Update UI
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
  
  // Update text
  if (activePlayer === 1) {
    current1El.textContent = 'Ready to roll';
  } else {
    current0El.textContent = 'Ready to roll';
  }
  
  // If both players have rolled, determine winner
  if (playerTotals[0] > 0 && playerTotals[1] > 0) {
    determineWinner();
  }
};

// Function to determine winner
const determineWinner = () => {
  const player1Total = playerTotals[0];
  const player2Total = playerTotals[1];
  
  // Create winner display
  const winnerDisplay = document.createElement('div');
  winnerDisplay.className = 'winner-display';
  
  // Check if either player went bust
  const player1Bust = isBust(player1Total);
  const player2Bust = isBust(player2Total);
  
  if (player1Bust && player2Bust) {
    winnerDisplay.textContent = `Both players bust! No winner.`;
  } else if (player1Bust) {
    winnerDisplay.textContent = `Player 2 wins! Player 1 went bust (${player1Total}). Player 2: ${player2Total}`;
    player1El.classList.add('player--winner');
  } else if (player2Bust) {
    winnerDisplay.textContent = `Player 1 wins! Player 2 went bust (${player2Total}). Player 1: ${player1Total}`;
    player0El.classList.add('player--winner');
  } else {
    // Neither player bust, closest to 21 wins
    const player1Diff = 21 - player1Total;
    const player2Diff = 21 - player2Total;
    
    if (player1Diff < player2Diff) {
      winnerDisplay.textContent = `Player 1 wins! Closer to 21 (${player1Total} vs ${player2Total})`;
      player0El.classList.add('player--winner');
    } else if (player2Diff < player1Diff) {
      winnerDisplay.textContent = `Player 2 wins! Closer to 21 (${player2Total} vs ${player1Total})`;
      player1El.classList.add('player--winner');
    } else {
      winnerDisplay.textContent = `It's a tie! Both players: ${player1Total}`;
    }
  }
  
  document.querySelector('main').appendChild(winnerDisplay);
  btnRoll.disabled = true;
  btnHold.disabled = true;
  btnRoll.classList.add('btn--disabled');
  btnHold.classList.add('btn--disabled');
  playing = false;
};

// Rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing && rollsLeft[activePlayer] > 0) {
    // Generate dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;
    
    // Display dice
    diceEl.classList.remove('hidden');
    diceEl.classList.add('rolling');
    setTimeout(() => {
      diceEl.classList.remove('rolling');
      diceEl.src = `dice-${dice}.png`;
    }, 500);
    
    // Store roll and update rolls left
    currentRolls.push(dice);
    rollsLeft[activePlayer]--;
    updateRollsDisplay();
    
    // Calculate current total
    const currentTotal = currentRolls.reduce((sum, roll) => sum + roll, 0);
    
    // Show "Rolling..." while still rolling, unless bust
    if (isBust(currentTotal)) {
      document.getElementById(`current--${activePlayer}`).textContent = `Bust! (${currentTotal})`;
      setTimeout(() => switchPlayer(), 1500);
    } else if (rollsLeft[activePlayer] > 0) {
      document.getElementById(`current--${activePlayer}`).textContent = `Current: ${currentTotal} (${rollsLeft[activePlayer]} rolls left)`;
    } else {
      document.getElementById(`current--${activePlayer}`).textContent = `Total: ${currentTotal}`;
      setTimeout(() => switchPlayer(), 1500);
    }
  }
});

// Hold button functionality
btnHold.addEventListener('click', function() {
  if (playing && currentRolls.length > 0) {
    switchPlayer();
  }
});

// New game button
btnNew.addEventListener('click', newGame);

// Initialize game
newGame();
