/** set up variables **/

const cardDeck = document.querySelector('.deck');
const matchedCards = cardDeck.getElementsByClassName("match");

 // list that holds all of cards
let card = document.getElementsByClassName('card');
let cards = Array.from(card);
let openedCards = [];

let moves = 0;
let pairs = 0;
let counter = document.querySelector('.moves');

let scorePanel = document.querySelector('.stars');
let stars = scorePanel.querySelectorAll('li');

let clock = document.querySelector('#clock');
let seconds = 0;
let minutes = 0;
let time = 0;

let modal = document.getElementById('modal');
const close = document.querySelector("#close");
const restartBtn =document.querySelector('#restart-btn'); 

/** GAME **/

// shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

//  function to start game
document.body.onload = newGame();

function newGame(){
    // shuffle
    cards = shuffle(cards);
    // reset moves
    moves = 0;
    pairs = 0;
    counter.innerHTML = moves;
    //reset timer
    stopTimer();
    seconds = 0;
    minutes = 0;
    clock.innerHTML = "0:00";
    // resets list of opened cards
    openedCards = [];
    // loop to remove all exisiting classes from each card
    for (let card of cards) {
       card.classList.remove('show', 'open', 'match', 'disabled','jello-horizontal');
    // append the shuffled cards back to the DOM   
       cardDeck.appendChild(card);
    }
    //reset stars
    for (star of stars) {
       star.classList.remove('hidden');
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
      //start count time
      moves++
      if (moves === 1) timer();
    }
  
    //check whether 2 cards match or not
    if (openedCards.length === 2){
       //start move counter
        pairs++;
        counter.innerHTML = pairs;
        hideStars();
      // prevents from double click and count moves
        cardDeck.removeEventListener('click', showCard);
        setTimeout(function () {
          cardDeck.addEventListener('click', showCard);
        }, 1000);
      
      
      if(openedCards[0].isEqualNode(openedCards[1])){ //from https://www.w3schools.com/jsref/met_node_isequalnode.asp
          matched();
        if (matchedCards.length == 16) {  
        endGame();}
      } else {
          unmatched();
      }
    };

  //if cards match
  function matched() {
    openedCards[0].classList.add('match','jello-horizontal');
    openedCards[1].classList.add('match','jello-horizontal');
    openedCards[0].classList.remove('show', 'open');
    openedCards[1].classList.remove('show', 'open');
    openedCards = [];
  };

  //if cards don't match
  function unmatched() {
    //allows to see 2nd card before is closed
    setTimeout(function() {
      openedCards[0].classList.remove('show', 'open', 'disabled');
      openedCards[1].classList.remove('show', 'open', 'disabled');
      openedCards = [];
    }, 1000);
  };
};

function hideStars() {
   if (pairs === 16) {
     scorePanel.lastElementChild.classList.add('hidden');
    } else if (pairs === 26) {
      scorePanel.lastElementChild.previousElementSibling.classList.add('hidden');
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

function endGame() {
   stopTimer();
   finalTime = clock.innerHTML;
   // set modal visible
   modal.style.display = 'block';   
   // declare star rating variable
   let finalStars = document.querySelector(".stars").innerHTML;
   //showing move, rating, time on modal
   document.getElementById('final-stars').innerHTML = finalStars;
   document.getElementById('final-time').innerHTML = finalTime;
   document.getElementById('final-moves').innerHTML = pairs;
   // function buttons
   playAgain();
   closeModal();
};

function closeModal(e){
    close.addEventListener("click", function(){
        modal.style.display = "none";
    });
};

function playAgain(e){
   restartBtn.addEventListener("click", function(){
     modal.style.display = "none";
     newGame();
  });
};

/** Event Listeners **/

window.addEventListener('load', newGame);
// deck listener delegated in showCard function to cards 
cardDeck.addEventListener('click', showCard);
// restart button
const restart = document.querySelector('.restart');
restart.addEventListener('click', newGame);
