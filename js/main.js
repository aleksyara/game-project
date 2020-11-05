/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// Build a 'master' deck of 'card' objects used to create shuffled decks
const masterDeck = buildMasterDeck();
//renderDeckInContainer(masterDeck, document.getElementById('master-deck-container'));


let user = {
 userTotal: 0,
 userCards: [],
 userBank: 0,
 userName: ''
};

let dealer = {
    dealerTotal: 0,
    dealerCards: []
};

/*----- app's state (variables) -----*/

// let shuffledDeck;
// let winner;
// gameStatisitcs = {
//     handsPlayed: null,
//     playerWins: null,
//     playerLoses: null, 
//     winnigIndex: null
// }


/*----- cached element references -----*/
const elRefShuffledDeckContainer = document.getElementById('shuffled-deck-container');
const elRefDealersCards = document.getElementById('dealers-cards');
const elRefUsersCards = document.getElementById('users-cards');
const elRefUserScore = document.getElementById('user-score');
//const elRefUserBank = document.getElementsById('update-user-bank');
const elRefUserName = document.getElementById('update-user-name');


/*----- event listeners -----*/
document.querySelector('.hit').addEventListener('click', hitHandler);
document.querySelector('.stand').addEventListener('click', standHandler);
document.querySelector('.start').addEventListener('click', startNewGame);
//document.getElementById('update-user-name').addEventListener('onclick', nameHandeler);




/*----- functions -----*/
init(); 

// initialize our state when the app loads in the browser


/////////////////////

function init () {
    console.log('game firing');
    renderShuffledDeck();
    dealTwoCardsToUserAndDealer();
    renderDealersCards();
    renderUsersCards();
    countAndRenderUsersScore();
}

///
function startNewGame() {
    console.log('start new game');
    nameHandeler();
    // show money and user name in user object
    //renderUsersBank();
    console.log('user: ', user);
}
//Submitting initial data
//Name
const btn = document.querySelector('button');
btn.addEventListener('click', function(){
    //console.log('button is workiing')
    //create elemnt that we pass later
    const li = document.createElement('li');
    //getting value from input
    document.getElementById('name').value;
    const input = document.querySelector('input');
    console.log(input.value);

    li.innerText = input.value;
    elRefUserName.innerHTML = input.value;
})

//Bank
const btn2 = document.getElementById('button2');
btn2.addEventListener('click', function(){
    //console.log('button 2 is workiing')
    //create elemnt that we pass later
    const li = document.createElement('p');
    // //getting value from input
    document.getElementById('cash').value;
    const input2 = document.querySelector('input');
    console.log(input2.value);
    p.innerText = input2.value;
    elRefUserBank.innerHTML = input.value;
})

/////

function hitHandler() {
    console.log('hit button click');
    user.userCards.push(shuffledDeck.shift());
    console.log('user: ', user);
    renderUsersCards();
    countAndRenderUsersScore();
    setTimeout(function() {
        checkForWinningOrLoosingHand();
    }, 200);
}

function standHandler() {
    console.log('stand button click');
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

    console.log('dealerScore: ', dealerScore);
    renderDealersCards();

    let userScore = 0;
    user.userCards.forEach(function(elem) {
        userScore += elem.value
    });

    setTimeout(function() {
        if (userScore === dealerScore) {
            alert('Its a draw!');
        } else if (dealerScore > userScore && dealerScore < 22) {
            alert('Dealer won!');
        } else if (dealerScore < userScore && dealerScore < 22) {
            alert('User won!');
        } else {
            alert('User won!');
        }
    }, 500);
    console.log('dealer: ', dealer);

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
    } else if (userScore > 21) {
        alert('You have lost your bet!');
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
  
renderShuffledDeck();


// take our state (which our the variables we initialized in our init function)
// and update the dom with those values
function render(){
};