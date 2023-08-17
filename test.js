function squareFn(id){
  // create new element
  const newSquare = document.createElement('div');
  // add classes to new element
  newSquare.classList.add('new-square');
  newSquare.classList.add('transition');
  newSquare.id = id;

  // add new element to playfield div
  playfield.appendChild(newSquare);
  
}

function moveSquareFn(id, tx, ty){
  // const newSquares = document.querySelectorAll('.new-square');
  // newSquares[newSquares.length -1].style.transform = "translate(-40vw, -40vh)";
  const newSquare = document.getElementById(id);
  newSquare.style.transform = `translate(${tx}vw, ${ty}vh)`;
}

function interValCards(maxLoop, timing, offsetTiming=10){

  let timingA = timing;
  let timingB = timing + offsetTiming;
  let counterA = 0;
  let counterB = 0;

  const aId = setInterval(()=>{
  
      if (counterA == maxLoop){
          clearInterval(aId);
      } else{
          squareFn(counterA);
      }

      counterA += 1;
      }, timingA);

  const bId = setInterval(()=>{
  
      if (counterB == maxLoop){
          clearInterval(bId);
      } else{
          if(counterB == 0){
              moveSquareFn(counterB, 0, 20);
          }
          if(counterB == 1){
              moveSquareFn(counterB, -20, 0);
          }
          if(counterB == 2){
              moveSquareFn(counterB, 0, -20);
          }
          if(counterB == 3){
              moveSquareFn(counterB, 20, 0);
          }
          
      }

      counterB += 1;
      }, timingB);
};


function moveSquares(elem, tx, ty){
  elem.style.transform = `translate(${tx}, ${ty})`;
  }


function dealCards(timing){
  const allSquares = document.querySelectorAll('.new-square');
  let i = 0;
  let cardsInHand = 0;
  const numPlayers = 4;

  const intervalID = setInterval(()=>{
      if (i == allSquares.length){
      clearInterval(intervalID);
      }
      else{
          if (i - (cardsInHand * numPlayers) == 0){
              // south
              moveSquares(allSquares[i], "0px", "200px");
          }
          if (i - (cardsInHand * numPlayers) == 1){
              // west
              moveSquares(allSquares[i], "-200px", "0px");
          }
          if (i - (cardsInHand * numPlayers) == 2){
              // north
              moveSquares(allSquares[i], "0px", "-200px");
          }
          if (i - (cardsInHand * numPlayers) == 3){
              // east
              moveSquares(allSquares[i], "200px", "0px");
          }

          i += 1;
          if (i % numPlayers == 0){
              cardsInHand += 1;
          }
      }
  }, timing);
}


function dealPlayerCards(players,timing){
  const allSquares = document.querySelectorAll('.new-square');
  let i = 0;
  let cardsInHand = 0;
  const numPlayers = players.length;

  const intervalID = setInterval(()=>{
      if (i == allSquares.length){
      clearInterval(intervalID);
      }
      else{
          if (i - (cardsInHand * numPlayers) == 0){
              // south
              players[i - (cardsInHand * numPlayers)]['cards-in-hand'][i] = allSquares[i];
              calcCardPositions();
              moveCardsInHand();
              moveCard(allSquares[i], "0px", "200px");
          }
          if (i - (cardsInHand * numPlayers) == 1){
              // west
              moveSquares(allSquares[i], "-200px", "0px");
          }
          if (i - (cardsInHand * numPlayers) == 2){
              // north
              moveSquares(allSquares[i], "0px", "-200px");
          }
          if (i - (cardsInHand * numPlayers) == 3){
              // east
              moveSquares(allSquares[i], "200px", "0px");
          }

          i += 1;
          if (i % numPlayers == 0){
              cardsInHand += 1;
          }
      }
  }, timing);
}

function createDeckCards(numCards, minValue, maxValue='A'){
    const cardValues = ['2','3','4','5','6','7','8','9','10','J', 'Q', 'K', 'A'];
    const cardSymbols = ['Clubs', 'Diamonds', 'Hearths', 'Spades'];

    const min = cardValues.indexOf(minValue);
    const max = cardValues.indexOf(maxValue)+1;
    const cardRange = cardValues.slice(min, max);

    let cardsInGame = [];
    const cardsInDeck = [];

    cardRange.forEach(value => {
        cardSymbols.forEach(symbol => {
            cardsInGame.push(`${symbol}-${value}`);
        })
    })

    console.log(cardRange);
    console.log(cardsInGame.length);

    for (let i= 0; i < numCards; i++){
        let pickIndex = Math.floor(Math.random() * (cardsInGame.length - i))
        cardsInDeck.push(cardsInGame[pickIndex]);
        cardsInGame.splice(pickIndex, 1);

    }

    console.log(cardsInGame.length);
    console.log(cardsInDeck);
}

// createDeckCards(15, '7');
// ['Diamonds-7', 'Hearths-8', 'Clubs-J', 'Diamonds-10', 'Clubs-10', 'Hearths-Q', 'Hearths-7', 'Hearths-J', 'Clubs-7', 'Hearths-9', 'Diamonds-9', 'Clubs-9', 'Hearths-10', 'Spades-8', 'Diamonds-8']

let str = 'abcd'
console.log(str.slice(0,str.length))