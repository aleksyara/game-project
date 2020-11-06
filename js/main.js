/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// Build a 'master' deck of 'card' objects used to create shuffled decks
const masterDeck = buildMasterDeck();
//renderDeckInContainer(masterDeck, document.getElementById('master-deck-container'));


let user = {
    bet: null,
    userTotal: 0,
    userCards: [],
    userBank: 0,
    userName: null
};

let dealer = {
    dealerTotal: 0,
    dealerCards: []
};

/*----- app's state (variables) -----*/

let shuffledDeck;
gameStatisitcs = {
    handsPlayed: 0,
    playerWins: 0,
    playerLoses: 0, 
    winnigIndex: 0
};


/*----- cached element references -----*/
// const elRefShuffledDeckContainer = document.getElementById('shuffled-deck-container');
const elRefDealersCards = document.getElementById('dealers-cards');
const elRefUsersCards = document.getElementById('users-cards');
const elRefUserScore = document.getElementById('user-score');
const elRefDealerScore = document.getElementById('dealer-score');
const elRefNameInput = document.getElementById('name-input');
const elRefCashInput = document.getElementById('cash-input');
const elRefBetInput = document.getElementById('bet-input');

const elRefUserBank = document.getElementById('update-user-bank');
const elRefUserName = document.getElementById('update-user-name');

const elRefMainArea = document.getElementById('main-area');
const elRefNewGameArea = document.getElementById('new-game-area');
const elRefHitStandButtons = document.getElementById('hit-stand-buttons');
const elRefBetButton = document.getElementById('bet-button');

const elRefHandsPlayed = document.getElementById('hands-played');
const elRefPlayerWins = document.getElementById('player-wins');
const elRefPlayerLoses = document.getElementById('player-loses');
const elRefWinning = document.getElementById('winning');


/*----- event listeners -----*/
document.querySelector('.hit').addEventListener('click', hitHandler);
document.querySelector('.stand').addEventListener('click', standHandler);
document.querySelector('.name-bank-submit-button').addEventListener('click', nameBankSubmitButtonClickHandeler);
document.querySelector('.bet').addEventListener('click', betHandler);


/*----- functions -----*/
init(); 

// initialize our state when the app loads in the browser

function init () {
    console.log('game firing');
    functionShuffleDeckOfCards();
    elRefMainArea.classList.add('hidden-area');
    elRefNewGameArea.classList.remove('hidden-area');
    user.userBank = null;
    user.userName = null;
    renderStats();
}

function nameBankSubmitButtonClickHandeler(){
   let name = elRefNameInput.value;
   let cashString = elRefCashInput.value;
   let cash;
   if (cashString ){
    cash = parseInt(cashString, 10);
   } else {
    cash = 100;
   } 
   
   if (!name){
       name = 'Anonymous';
   }

   user.userName = name;
   user.userBank = cash;
   elRefUserName.innerHTML = 'Player\'s name: ' + name;
   elRefUserBank.innerHTML = 'Bank: ' + cash;
   elRefMainArea.classList.remove('hidden-area');
   elRefNewGameArea.classList.add('hidden-area');
};

function betHandler() {
    let bet;
    let betString = elRefBetInput.value;
    if (betString){
        bet = parseInt(betString, 10);
       } else {
        bet = 5;
       } 

    if (bet >= user.userBank){
        bet = user.userBank;
    } 

    user.bet = bet;
    console.log('bet amount: ', user.bet);
    elRefHitStandButtons.classList.remove('hidden-area');
    elRefBetButton.classList.add('hidden-area');

    user.userBank = user.userBank - bet;
    elRefUserBank.innerHTML = 'Bank: ' + user.userBank;

    dealTwoCardsToUserAndDealer();
    renderDealersCards();
    renderUsersCards();
    countAndRenderUsersScore();

    }


function hitHandler() {
    user.userCards.push(shuffledDeck.shift());
    renderUsersCards();
    countAndRenderUsersScore();
    setTimeout(function() {
        checkForWinningOrLoosingHand();
    }, 200);

}

function standHandler() {
    let dealerScore = dealer.dealerCards[0].value + dealer.dealerCards[1].value;
    let minScore = 17;
    
    let ctr = 0;
    while (dealerScore <= minScore) {
        let tempCard = shuffledDeck.shift();
        dealer.dealerCards.push(tempCard);
        dealerScore += tempCard.value;
        
        console.log('ctr: ', ctr);
        
        ctr++;
    }

    let userScore = 0;
    user.userCards.forEach(function(elem) {
        userScore += elem.value
    });

    setTimeout(function() {
        if (userScore === dealerScore) {
            alert('Its a draw!');
            handleDrawSituation ();
        } else if (dealerScore > userScore && dealerScore < 22) {
            alert('Dealer won!');
            handleLoosingSituation();
        } else if (dealerScore < userScore && dealerScore < 22) {
            alert('User won!');
            handleWinningSituation();
        } else {
            alert('User won!');
            handleWinningSituation();
        }
    }, 500);
    console.log('dealer: ', dealer);

    renderDealersCards();
    elRefDealerScore.innerHTML = 'Score: ' + dealerScore;

}

function handleWinningSituation (){
    user.userBank = (user.bet * 2) + user.userBank;
    user.bet = null;
    elRefUserBank.innerHTML = "Bank: " + user.userBank;
    user.userCards = [];
    dealer.dealerCards = [];
    elRefHitStandButtons.classList.add('hidden-area');
    elRefBetButton.classList.remove('hidden-area');
    renderDeckInContainer([], elRefDealersCards);
    renderDeckInContainer([], elRefUsersCards);
    countAndRenderUsersScore();
    elRefDealerScore.innerHTML = 'Score: ';

    gameStatisitcs.handsPlayed++;
    gameStatisitcs.playerWins++;
    renderStats();
}

function handleDrawSituation (){
    user.userBank = user.bet + user.userBank;
    user.bet = null;
    user.userCards = [];
    dealer.dealerCards = [];
    elRefUserBank.innerHTML = "Bank: " + user.userBank;
    elRefHitStandButtons.classList.add('hidden-area');
    elRefBetButton.classList.remove('hidden-area');
    renderDeckInContainer([], elRefDealersCards);
    renderDeckInContainer([], elRefUsersCards);
    countAndRenderUsersScore();
    elRefDealerScore.innerHTML = 'Score: ';

    gameStatisitcs.handsPlayed++;
    renderStats();
}

function handleLoosingSituation() {
    user.bet = null;
    elRefUserBank.innerHTML = "Bank: " + user.userBank;
    user.userCards = [];
    dealer.dealerCards = [];
    if (user.userBank === 0) {
        if (confirm('You ran out of money! Start new game?')) {
            init();
        } else {
            console.log('You pressed Cancel!');
        }
    }
    elRefHitStandButtons.classList.add('hidden-area');
    elRefBetButton.classList.remove('hidden-area');
    renderDeckInContainer([], elRefDealersCards);
    renderDeckInContainer([], elRefUsersCards);
    countAndRenderUsersScore();
    elRefDealerScore.innerHTML = 'Score: ';

    gameStatisitcs.handsPlayed++;
    gameStatisitcs.playerLoses++;
    renderStats();
}

function checkForWinningOrLoosingHand() {
    let userScore = 0;
    let dealerScore = 0;
    user.userCards.forEach(function(elem) {
        userScore += elem.value
    });
    dealer.dealerCards.forEach(function(elem) {
        dealerScore += elem.value
    });
    if (userScore === 21) {
        alert('Black Jack, You won!');
        handleWinningSituation();
    } else if (userScore > 21) {
        alert('You BUST! Try again!');
        handleLoosingSituation();
    }
}

function countAndRenderUsersScore() {
    let sum = 0;
    user.userCards.forEach(function(elem) {
        sum += elem.value
    });
    elRefUserScore.innerHTML = 'Score: ' + sum;
}

function renderDealersCards() {
    renderDeckInContainer(dealer.dealerCards, elRefDealersCards);
}

function renderUsersCards() {
    renderDeckInContainer(user.userCards, elRefUsersCards);
}

function dealTwoCardsToUserAndDealer() {
    //deler cards
    dealer.dealerCards.push(shuffledDeck.shift());
    dealer.dealerCards.push(shuffledDeck.shift());    
    console.log('dealer: ', dealer);
        
    //user cards
    user.userCards.push(shuffledDeck.shift());
    user.userCards.push(shuffledDeck.shift());
    console.log('user: ', user);
}

function functionShuffleDeckOfCards() {
    const tempDeck = [...masterDeck];
    shuffledDeck = [];
    while (tempDeck.length) {
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
      shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
}

function renderShuffledDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    const tempDeck = [...masterDeck];
    shuffledDeck = [];
    while (tempDeck.length) {
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
      shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    renderDeckInContainer(shuffledDeck, elRefShuffledDeckContainer);
  }
  
function renderDeckInContainer(deck, container) {
    container.innerHTML = '';
    // Let's build the cards as a string of HTML
    // Use reduce when you want to 'reduce' the array into a single thing - in this case a string of HTML markup 
    const cardsHtml = deck.reduce(function(html, card) {
      return html + `<div class="card ${card.face}"></div>`;
    }, '');
    container.innerHTML = cardsHtml;
}
  
  function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for game of blackjack, not war
          value: Number(rank) || (rank === 'A' ? 11 : 10)
        });
      });
    });
    return deck;
  }
  
// renderShuffledDeck();


// take our state (which our the variables we initialized in our init function)
// and update the dom with those values
function renderStats() {
    elRefHandsPlayed.innerHTML = gameStatisitcs.handsPlayed;
    elRefPlayerWins.innerHTML = gameStatisitcs.playerWins;
    elRefPlayerLoses.innerHTML = gameStatisitcs.playerLoses;
    elRefWinning.innerHTML = calculateWinningIndex(gameStatisitcs.handsPlayed, gameStatisitcs.playerWins);
};

function calculateWinningIndex(totalGames, winningGames){
    console.log('winning games ', winningGames);
    console.log('total games ', totalGames);
    console.log('total ', winningGames/totalGames);
    console.log('total ', (winningGames/totalGames)*100);
    
    if (totalGames === 0) {
    return 0;
    } else { 
    return Math.floor((winningGames / totalGames) * 100);
    } 
}

//To do next....
// function renderEverythingElse() {
//     elRefDealerScore.innerHTML = dealer.dealerTotal;
//     elRefUserBank.innerHTML = "Bank: " + user.userBank;
// }

// function render() {
//     // all trendering goes here, stats, user, dealer
// }