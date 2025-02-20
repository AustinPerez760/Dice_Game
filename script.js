'use strict';

// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const rolls0El = document.getElementById('rolls--0');
const rolls1El = document.getElementById('rolls--1');
const player1WinsEl = document.getElementById('player1-wins');
const player2WinsEl = document.getElementById('player2-wins');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const confettiContainer = document.getElementById('confetti-container');

// Game state
let scores, currentScore, activePlayer, playing, rollsLeft;

// Initialize game
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  rollsLeft = [6, 6];

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  rolls0El.textContent = rollsLeft[0];
  rolls1El.textContent = rollsLeft[1];

  diceEl.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');

  // Show buttons
  btnRoll.style.display = 'block';
  btnHold.style.display = 'block';

  // Enable buttons
  btnRoll.disabled = false;
  btnHold.disabled = false;
  btnRoll.classList.remove('btn--disabled');
  btnHold.classList.remove('btn--disabled');
};

// Function to create confetti
const createConfetti = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const confettiCount = 150;

  confettiContainer.innerHTML = ''; // Clear any existing confetti

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'; // Random duration between 2-4s
    confetti.style.opacity = Math.random();
    confetti.style.transform = `scale(${Math.random() * 0.5 + 0.5})`; // Random size
    confettiContainer.appendChild(confetti);
  }

  // Remove confetti after animation
  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, 4000);
};

// Blackjack game logic
const checkBlackjack = (score) => score === 21;
const isBust = (score) => score > 21;

const determineWinner = () => {
  const player1Total = scores[0];
  const player2Total = scores[1];
  
  // Check for blackjack (21)
  const player1Blackjack = checkBlackjack(player1Total);
  const player2Blackjack = checkBlackjack(player2Total);
  
  // Check for busts
  const player1Bust = isBust(player1Total);
  const player2Bust = isBust(player2Total);
  
  let winner = null;
  let message = '';
  let reason = '';
  
  // Determine winner based on blackjack rules
  if (player1Blackjack && player2Blackjack) {
    message = "It's a Tie!";
    reason = "Both players hit 21!";
  } else if (player1Blackjack) {
    winner = 0;
    message = "Player 1 Wins!";
    reason = "Blackjack! Perfect 21!";
  } else if (player2Blackjack) {
    winner = 1;
    message = "Player 2 Wins!";
    reason = "Blackjack! Perfect 21!";
  } else if (player1Bust && player2Bust) {
    message = "Both Bust!";
    reason = "Both players went over 21";
  } else if (player1Bust) {
    winner = 1;
    message = "Player 2 Wins!";
    reason = "Player 1 went bust!";
  } else if (player2Bust) {
    winner = 0;
    message = "Player 1 Wins!";
    reason = "Player 2 went bust!";
  } else {
    // Neither bust, closest to 21 wins
    const player1Diff = 21 - player1Total;
    const player2Diff = 21 - player2Total;
    
    if (player1Diff < player2Diff) {
      winner = 0;
      message = "Player 1 Wins!";
      reason = "Closer to 21";
    } else if (player2Diff < player1Diff) {
      winner = 1;
      message = "Player 2 Wins!";
      reason = "Closer to 21";
    } else {
      message = "It's a Tie!";
      reason = "Equal distance from 21";
    }
  }
  
  return { winner, message, reason };
};

const showWinnerBanner = () => {
  const { winner, message, reason } = determineWinner();
  
  // Create banner
  const banner = document.createElement('div');
  banner.className = 'winner-banner';
  
  banner.innerHTML = `
    <h2>${message}</h2>
    <div class="result">${reason}</div>
    <div class="scores">
      <div class="score-card ${winner === 0 ? 'winner' : ''} ${isBust(scores[0]) ? 'bust' : ''}">
        <h3>Player 1</h3>
        <div class="score">${scores[0]}</div>
        <div class="difference">
          ${isBust(scores[0]) ? 'BUST!' : 
            checkBlackjack(scores[0]) ? 'BLACKJACK!' : 
            `${Math.abs(21 - scores[0])} away from 21`}
        </div>
      </div>
      <div class="score-card ${winner === 1 ? 'winner' : ''} ${isBust(scores[1]) ? 'bust' : ''}">
        <h3>Player 2</h3>
        <div class="score">${scores[1]}</div>
        <div class="difference">
          ${isBust(scores[1]) ? 'BUST!' : 
            checkBlackjack(scores[1]) ? 'BLACKJACK!' : 
            `${Math.abs(21 - scores[1])} away from 21`}
        </div>
      </div>
    </div>
    <button class="play-again">Play Again</button>
  `;

  document.body.appendChild(banner);

  // Add event listener to play again button
  banner.querySelector('.play-again').addEventListener('click', () => {
    banner.remove();
    init();
  });

  // Update win counter if there's a winner
  if (winner !== null) {
    if (winner === 0) {
      player1WinsEl.textContent = Number(player1WinsEl.textContent) + 1;
    } else {
      player2WinsEl.textContent = Number(player2WinsEl.textContent) + 1;
    }
    document.querySelector(`.player--${winner}`).classList.add('player--winner');
  }

  // Trigger confetti for winner or blackjack
  if (winner !== null || checkBlackjack(scores[0]) || checkBlackjack(scores[1])) {
    createConfetti();
  }
};

// Rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing && rollsLeft[activePlayer] > 0) {
    // 1. Generate a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2. Display dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;
    diceEl.classList.add('rolling');
    
    setTimeout(() => {
      diceEl.classList.remove('rolling');
    }, 600);

    // 3. Decrement rolls left
    rollsLeft[activePlayer]--;
    document.getElementById(`rolls--${activePlayer}`).textContent = rollsLeft[activePlayer];

    // 4. Add dice to current score
    currentScore += dice;
    document.getElementById(`current--${activePlayer}`).textContent = currentScore;

    // 5. Check for blackjack or bust
    const totalScore = scores[activePlayer] + currentScore;
    
    if (checkBlackjack(totalScore)) {
      // Automatic win on 21
      scores[activePlayer] = totalScore;
      document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
      rollsLeft[activePlayer] = 0;
      document.getElementById(`rolls--${activePlayer}`).textContent = 0;
      
      if (activePlayer === 0) {
        // If player 1 hits 21, player 2 still gets a chance
        btnHold.click();
      } else {
        // If player 2 hits 21, game ends
        playing = false;
        showWinnerBanner();
      }
    } else if (isBust(totalScore)) {
      // Automatic hold on bust
      scores[activePlayer] = totalScore;
      document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
      btnHold.click();
    } else if (rollsLeft[activePlayer] === 0) {
      // Automatic hold when out of rolls
      btnHold.click();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing && currentScore >= 0) {
    // Add current score to total score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
    
    // Reset current score
    currentScore = 0;
    document.getElementById(`current--${activePlayer}`).textContent = 0;

    // Set remaining rolls to 0 to indicate turn is over
    rollsLeft[activePlayer] = 0;
    document.getElementById(`rolls--${activePlayer}`).textContent = 0;

    // Check if both players have finished
    if (rollsLeft[0] === 0 && rollsLeft[1] === 0) {
      // End game and show winner
      playing = false;
      diceEl.classList.add('hidden');
      showWinnerBanner();
    } else {
      // Switch to next player and reset their rolls if needed
      activePlayer = activePlayer === 0 ? 1 : 0;
      if (rollsLeft[activePlayer] === 0) {
        rollsLeft[activePlayer] = 6;
        document.getElementById(`rolls--${activePlayer}`).textContent = 6;
      }
      
      // Update UI
      player0El.classList.toggle('player--active');
      player1El.classList.toggle('player--active');
    }
  }
});

// New game button
btnNew.addEventListener('click', init);

// Initialize game
init();
