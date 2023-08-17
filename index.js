// https://ramlmn.github.io/visualizing-matrix3d/
// https://meyerweb.com/eric/tools/matrix/


// 0 DEGREE Y-AXIS //
let matrix0 = [1,0,0,0,1,0,1]; // 0 degree z axis
let matrix90 = [0,1,0,-1,0,0,1]; // 90 degree z axis
let matrix180 = [-1,0,0,0,-1,0,1]; // 180 degree z axis
let matrix270 = [0,-1,0,1,0,0,1]; // 270 degree z axis

// 180 DEGREE Y-AXIS //
let matrix0Flipped = [-1,0,0,0,1,0,-1]; // 0 degree z axis
let matrix90Flipped = [0,-1,0,-1,0,0,1]; // 90 degree z axis
let matrix180Flipped = [1,0,0,0,-1,0,-1]; // 180 degree z axis
let matrix270Flipped = [0,1,0,1,0,0,-1]; // 270 degree z axis


const players = [
    {"id":'012345', "name":'Owen', "location": 'south', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0},
    {"id":'012345', "name":'Ziva', "location": 'west', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix90},
    {"id":'012345', "name":'Dad', "location": 'north', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix180},
    {"id":'012345', "name":'Mum', "location": 'east', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix270}
]

const playerBank = {"id":'012345', "name":'Bank', "location": 'center', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0};

const numPlayersCards = 5;
const cardsInGame = (players.length + 1) * numPlayersCards;

const playFieldElem = document.querySelector('#playfield')
const startGame = document.querySelector('#start')

let fieldSize = 1000;
let cardWidth = fieldSize / 10;
let cardHeight = cardWidth * 1.3;
let stackOffset = 25;
let center = fieldSize / 2;
let southTop = fieldSize - cardHeight;
let westTop = (cardHeight - cardWidth) /2;
let northTop = 0;
let eastTop = fieldSize - cardHeight + ((cardHeight - cardWidth) /2);
const deckPos = {'x': center - (cardWidth /2), 'y':center - (cardHeight /2)};


startGame.addEventListener('click', ()=> {
    createDeck(cardsInGame, matrix0, deckPos);

    let groupPlayers = [...players];
    groupPlayers.push(playerBank);
    dealCards(groupPlayers);
})


// Create Deck Elements //
function createDeck(numDeck, orientation, postion){

    for (let i = 0; i < numDeck; i++){
        const cardElem = createCard(["card"]);
        
        cardElem.style.transform = `matrix3d(
            ${orientation[0]},
            ${orientation[1]},
            ${orientation[2]},
            0,
            ${orientation[3]},
            ${orientation[4]},
            0,
            0,
            ${orientation[5]},
            0,
            ${orientation[6]},
            0,
            ${postion.x},
            ${postion.y},
            0,
            1
            )`; 

        addChildElement(playFieldElem, cardElem);
    }
}


// Create Deck Card Values //
function createDeckCards(numCards, minValue='2', maxValue='A'){
    const cardValues = ['2','3','4','5','6','7','8','9','10','J', 'Q', 'K', 'A'];
    const cardSymbols = ['Clubs', 'Diamonds', 'Hearths', 'Spades'];

    const min = cardValues.indexOf(minValue);
    const max = cardValues.indexOf(maxValue)+1;
    const cardRange = cardValues.slice(min, max);

    // Can be miss-aligned //
    if (cardRange.length > numCards){
        console.log('Card Value Range not inline with Number of Playing Cards per Player')
    }

    let cardsInGame = [];
    const cardsInDeck = [];

    cardRange.forEach(value => {
        cardSymbols.forEach(symbol => {
            cardsInGame.push(`${symbol}-${value}`);
        })
    })

    // Randomize cards //
    for (let i= 0; i < numCards; i++){
        let pickIndex = Math.floor(Math.random() * (cardsInGame.length))
        cardsInDeck.push(cardsInGame[pickIndex]);
        cardsInGame.splice(pickIndex, 1);

    }

    return cardsInDeck;
}



function dealCards(players){
    // Query all card elements
    const allCards = document.querySelectorAll('.card');
    // Create card values and id's
    const deckCardValues = createDeckCards(allCards.length, '7');
    let timing = 300;
    let playerCount = 0;

    allCards.forEach((cardElem, index) =>{
        // pick a card //
        let cardId = deckCardValues[index];

        if (playerCount == 0){
            // add card to player hand //
            players[0]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};
            // calc cardPosition //
            calcCardPositions(players[0]);
        }
        if (playerCount == 1){
            // add card to player hand //
            players[1]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};
            // calc cardPosition //
            calcCardPositions(players[1]);
        }
        if (playerCount == 2){
            // add card to player hand //
            players[2]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};
            // calc cardPosition //
            calcCardPositions(players[2]);
        }
        if (playerCount == 3){
            // add card to player hand //
            players[3]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};
            // calc cardPosition //
            calcCardPositions(players[3]);
        }
        if (playerCount == 4){
            // // add card to player bank  //
            players[4]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};
            // // calc cardPosition //
            calcCardPositions(players[4], stacked=false);
        }

        playerCount += 1;

        if (playerCount == 5){
            playerCount = 0;
        }

    })
    // position cards
    let bank = players.splice(-1)
    dealingCards(players, timing);
    setTimeout(()=>{
        dealingCards(bank, 300);
    },(allCards.length + 1)*timing);
    

    console.log(players)
    console.log(playerBank)
}

function dealingCards(players, timing){
    let i = 0;
    let playerIndex = 0;
    let cardIndex = 0;
    let cardsToDeal = 0;
    
    players.forEach(player =>{
        cardsToDeal +=  Object.keys(player['cards-in-hand']).length;
    })

    const intervalID = setInterval(()=>{
        if (i == cardsToDeal -1){
            clearInterval(intervalID);
        }
        
        const cardIds = Object.keys(players[playerIndex]['cards-in-hand']);
        const card = players[playerIndex]['cards-in-hand'][cardIds[cardIndex]];

        const cardElem = card.elem
        const orientation = players[playerIndex].orientation

        const text = document.createTextNode(cardIds[cardIndex]);

        addChildElement(cardElem, text);    
        
        cardElem.style.transform = `matrix3d(
            ${orientation[0]},
            ${orientation[1]},
            ${orientation[2]},
            0,
            ${orientation[3]},
            ${orientation[4]},
            0,
            0,
            ${orientation[5]},
            0,
            ${orientation[6]},
            0,
            ${card.x},
            ${card.y},
            0,
            1
            )`; 



        playerIndex += 1;
        
        if (playerIndex == players.length){
            cardIndex += 1;
            playerIndex = 0;
        }
        i += 1;
    }, timing);

    
  }
  

function calcCardPositions(player, stacked=true){
     // let playerCardObj = {cardId:{'elem': cardElem, 'x:':cardX, 'y':cardY}};
    let cardsInHand = player['cards-in-hand'];
    let handWidth = 0;
    let cardOffSet = 0;

    if (stacked){
        handWidth = cardWidth + ((Object.keys(cardsInHand).length -1) * stackOffset);
        cardOffSet = stackOffset;

    }
    else{
        handWidth = cardWidth * Object.keys(cardsInHand).length;
        cardOffSet = cardWidth;
    }
    
    let emptySpace = (fieldSize - handWidth) / 2;

    if (player.location == 'south'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].y = southTop;
            player['cards-in-hand'][cardId].x = emptySpace + (index * cardOffSet);
        })
    }

    if (player.location == 'west'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].x = westTop;
            player['cards-in-hand'][cardId].y = emptySpace + (index * cardOffSet);
        })

    }

    if (player.location == 'north'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].y = northTop;
            player['cards-in-hand'][cardId].x = emptySpace + (index * cardOffSet);
        })

    }
    if (player.location == 'east'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].x = eastTop;
            player['cards-in-hand'][cardId].y = emptySpace + (index * cardOffSet);
        })

    }

    if (player.location == 'center'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].x = emptySpace + (index * cardOffSet);
            player['cards-in-hand'][cardId].y = deckPos.y;
        })

    }


    // return cardsInHand
}


function createCard(classNames){
    const cardElem = createElement('div');

    for(let className of classNames){
        addClassToElement(cardElem, className);
    }

    return cardElem;
}

function createElement(elemType){
    return document.createElement(elemType);
}

function addClassToElement(elem, className){
    elem.classList.add(className);
    
}

function removeClassFromElement(elem, className){
    elem.classList.remove(className);
}

function addIdToElement(elem, idName){
    elem.id = idName;
}

function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem);
}
