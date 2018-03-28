/*
 * set up all variables
*/

const cardDeck = document.querySelector('.deck');

 // list that holds all of your cards
let card = document.getElementsByClassName('card');
let cards = Array.from(card);
let openedCards = [];

let moves = 0;
let counter = document.querySelector('.moves');

const scorePanel = document.querySelector('.stars');
let stars = scorePanel.querySelectorAll('li');

let clock = document.querySelector('#clock');
let seconds = 0;
let minutes = 0;
let time = 0;

/*
 * game logic
*/

// shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

// function to start game
document.body.onload = newGame();

function newGame(){
   // shuffle
   cards = shuffle(cards);
   // reset moves
   moves = 0;
   counter.innerHTML = moves; 
   // reset stars
   for (star of stars) {
      star.classList.remove('hidden');
   }
   //reset timer
   stopTimer();
   seconds = 0;
   minutes = 0;
   clock.innerHTML = "0:00";
   // loop to remove all exisiting classes from each card
   for (let card of cards) {
       card.classList.remove('show', 'open', 'match', 'disabled');
       // append the shuffled cards back to the DOM   
       cardDeck.appendChild(card);
    }
};

// function that toggle classes to show cards
let showCard = function showCard(evt){
   let randomCard = evt.target;
   if (randomCard.tagName === 'LI'){
      if (openedCards.length < 2) { //limit number of opened cards
        randomCard.classList.toggle('open')
        randomCard.classList.toggle('show')
        randomCard.classList.toggle('disabled')
        openedCards.push(randomCard);
      } 
      evt.stopPropagation();
    }

    // for 2 opened cards
    if (openedCards.length === 2){
       moves++;
       counter.innerHTML = moves;
       hideStars();
       if (moves === 1) timer();

      // check whether the cards match or not 
      if (openedCards[0].isEqualNode(openedCards[1])){ //from https://www.w3schools.com/jsref/met_node_isequalnode.asp
         matched();
      } else {
         unmatched();
      }
    }

  // if cards match
  function matched() {
     openedCards[0].classList.toggle('match');
     openedCards[1].classList.toggle('match');
     openedCards[0].classList.remove('show', 'open');
     openedCards[1].classList.remove('show', 'open');
     openedCards = [];
  }

  // if cards don't match
  function unmatched() {
     // allows to see 2nd card before it's closed
     setTimeout(function() {
       openedCards[0].classList.remove('show', 'open', 'disabled');
       openedCards[1].classList.remove('show', 'open', 'disabled');
       openedCards = [];
     }, 1000);
  }
};

function hideStars() {
    if (moves === 11) {
      scorePanel.lastElementChild.classList.add('hidden');
    } else if (moves === 21) {
      scorePanel.lastElementChild.previousElementSibling.classList.add('hidden');
    } else if (moves === 30) {
      scorePanel.firstElementChild.classList.add('hidden');
    }
};

function timer() {
   time = setInterval(function() {
     seconds++;
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      clock.innerHTML = minutes + ":" + seconds;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
  }, 1000);
};      

function stopTimer() {
   clearInterval(time);
};

/*
 * Event Listeners
 */

// deck listener delegated in showCard function to cards 
cardDeck.addEventListener('click', showCard);
// restart button
const restart = document.querySelector('.restart');
restart.addEventListener('click', newGame);