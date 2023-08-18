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


// ID is important reference //
// const players = [
//     {"id":'0', "name":'Local Player', "location": 'south', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0},
//     {"id":'1', "name":'Ziva', "location": 'west', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix90},
//     {"id":'2', "name":'Dad', "location": 'north', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix180},
//     {"id":'3', "name":'Mum', "location": 'east', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix270}
// ]
// const playerBank = {"id":'4', "name":'Bank', "location": 'center', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0};

// Keep players key a string or a number //
// Will be better to keep string if players becomes a json object //
const players = {
    '0': {"name":'Local Player', "location": 'south', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0},
    '1': {"name":'Ziva', "location": 'west', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix90},
    '2': {"name":'Dad', "location": 'north', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix180},
    '3': {"name":'Mum', "location": 'east', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix270},
    '4': {"name":'Bank', "location": 'center', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0},
}

const numPlayersCards = 5;
// const cardsInGame = (players.length + 1) * numPlayersCards;
const cardsInGame = (Object.keys(players).length) * numPlayersCards;

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

    // let groupPlayers = [...players];
    // groupPlayers.push(playerBank);
    // dealCards(groupPlayers);
    dealCards(players);
})

function getPlayerById (id){
    return players[id];
}

function filterPlayers(field, valuesArr, filterOut=true){
    // Conversion to lower Case //
    if (filterOut){
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => !valuesArr.includes(v[field])));
    } else {
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => valuesArr.includes(v[field])));
    }
}

// Needs to be local Client based //
// Every Card going into the bank needs a mouseEvent //
// Every Card going into player South Hands needs a mouseEvent
function mouseOverEvent(elem){
    let oldMatrix = [];
    let newMatrix = [];
    let matrixStr = ''

    elem.addEventListener(
        "mouseenter",
        (event) => {
        const targetElem = event.target
        oldMatrix = targetElem.getAttribute('style').split(/\s/);
        oldMatrix = oldMatrix.map(item => item.replace(',',''));
        console.log(oldMatrix);
        let offsetX = 5;
        let offsetY = 25;

        newMatrix = [...oldMatrix]
        newMatrix[13] = Number(oldMatrix[13]) - offsetX;
        newMatrix[14] = Number(oldMatrix[14]) - offsetY;
            
        console.log(newMatrix.slice(1).toString())
        matrixStr = newMatrix.slice(1).toString()
        targetElem.style.transform = matrixStr.slice(0, matrixStr.length -1);
        },
        false,
      );

      elem.addEventListener(
        "mouseleave",
        (event) => {
        const targetElem = event.target
            matrixStr = oldMatrix.slice(1).toString();
            targetElem.style.transform = matrixStr.slice(0, matrixStr.length -1);
        },
        false,
      );
}

// Every Cards going out the Bank needs to have a mouseEvent removed
function removeMouseOverEvent(elem){

}

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
    let playersID = Object.keys(players)
    let playerID = 0;

    allCards.forEach((cardElem, index) =>{
        // pick a card //
        let cardId = deckCardValues[index];
        
        // add card to player hand //
        players[`${playerID}`]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};
        // calc cardPosition //

        if (players[`${playerID}`].name == 'Bank'){
            // add card to player hand //
            players[`${playerID}`]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};
            // add hover mouse event //
            mouseOverEvent(cardElem);
            // calc cardPosition //
            calcCardPositions(players[`${playerID}`], stacked=false);
        }else{
            if (players[`${playerID}`].location == 'south'){
                // add hover mouse event //
                mouseOverEvent(cardElem);
            }
            // add card to player hand //
            players[`${playerID}`]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};
            // calc cardPosition //
            calcCardPositions(players[`${playerID}`]);
        }
        
        playerID += 1;

        if (playerID == Number(playersID[playersID.length-1])+1){
            playerID = 0;
        }

    })
    // position cards
    // let bank = players.splice(-1)
    const bank = filterPlayers('name', ['Bank'], filterOut=false);
    const nonBankPlayers = filterPlayers('name', ['Bank']);

    dealingCards(nonBankPlayers, timing);
    setTimeout(()=>{
        dealingCards(bank, timing);
    },(allCards.length + 1)*timing);
    

    console.log(players)
    // console.log(playerBank)
}

function dealingCards(players, timing){
    let i = 0;
    const playersID = Object.keys(players)
    // let playerID = 0;
    let playerIndex = 0;
    let cardIndex = 0;
    let cardsToDeal = 0;
    
    for (const [id, player] of Object.entries(players)) {
        cardsToDeal += Object.keys(player['cards-in-hand']).length;
      }

    // players.forEach(player =>{
    //     cardsToDeal +=  Object.keys(player['cards-in-hand']).length;
    // })

    const intervalID = setInterval(()=>{
        if (i == cardsToDeal -1){
            clearInterval(intervalID);
        }
        

        let player = players[`${playersID[playerIndex]}`];
        const cardIds = Object.keys(player['cards-in-hand']);
        // cardID = "Clubs-8": Object { elem: div.card, x: 425, y: 870 } //
        const cardId = cardIds[cardIndex];
        const card = player['cards-in-hand'][cardId];
        const orientation = player.orientation;

        const text = document.createTextNode(cardId);
        addChildElement(card.elem, text);   



        
        // const cardIds = Object.keys(players[playerIndex]['cards-in-hand']);
        // const cardIds = players[playerIndex]['cards-in-hand'];
        // const card = players[playerIndex]['cards-in-hand'][cardIds[cardIndex]];

        // const cardElem = card.elem
        // const orientation = players[playerIndex].orientation

        // const text = document.createTextNode(cardIds[cardIndex]);

        // addChildElement(cardElem, text);    
        
        // cardElem.style.transform = `matrix3d(
        card.elem.style.transform = `matrix3d(
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

        if (playerIndex == playersID.length){
            cardIndex += 1;
            playerIndex = 0;
        }
         
        // if (playerIndex == players.length){
        //     cardIndex += 1;
        //     playerIndex = 0;
        // }

        // playerID += 1;

        // if (playersID[playerIndex] == Number(playersID[playersID.length-1])+1){
        //     playerIndex = 0;
        // }

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
