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


// cardID = "Clubs-8": Object { elem: div.card, x: 425, y: 870 } //
// Keep elem cards-in-hand as well for quicker search ??? (cards-in-hand.length vs cards-in cardsDB.length) //
const players = {
    0: {"name":'Local Player', "location": 'south', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0, 'pass': false, 'active':false, 'auto':false},
    1: {"name":'Ziva', "location": 'west', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix90, 'pass': false, 'active':false, 'auto':true},
    2: {"name":'Dad', "location": 'north', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix180, 'pass': false, 'active':false, 'auto':true},
    3: {"name":'Mum', "location": 'east', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix270, 'pass': false, 'active':false, 'auto':true},
    4: {"name":'Bank', "location": 'center', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0, 'pass': true, 'active':false, 'auto':false},
}

const charValues = {'A':11, 'K':10, 'Q':10, 'J': 10};
// cardID = "Clubs-8": Object { elem: div.card, picked:false, access:true, value:8, symbol:'Clubs', icon:'8'} //
const cardsDB = {}; // Generated in dealCards() with addToCardDB()


const numPlayersCards = 3;
const cardsInGame = (Object.keys(players).length) * numPlayersCards;

const playFieldElem = document.querySelector('#playfield')
// const startGame = document.querySelector('#start')

let fieldSize = 1000;
let cardWidth = fieldSize / 8;
let cardHeight = cardWidth * 1.3;
let stackOffset = 25;
let hoverOffsetX = 5;
let hoverOffsetY = 25
let center = fieldSize / 2;
let southTop = fieldSize - cardHeight;
let westTop = (cardHeight - cardWidth) /2;
let northTop = 0;
let eastTop = fieldSize - cardHeight + ((cardHeight - cardWidth) /2);
const deckPos = {'x': center - (cardWidth /2), 'y':center - (cardHeight /2)};
const clickCardOffset = 5;
const cardPickedBank = [];
const cardPickPlayer = [];

function loadGame(){
    const playerName = document.getElementById('player-name').value;
    const playerEntry = document.getElementById('player-entry');
    
    

    players[0].name = playerName;
    players[0].auto = false;
    // console.log(players[0]);

    // remove element
    setTimeout(()=>{
        playerEntry.remove();
    }, 500);
    
    // deal cards
    setTimeout(()=>{
        createDeck(cardsInGame, matrix0, deckPos);
        dealCards(players);
    }, 1000);

    // only after cards are dealt should player be active
    players[0].active = true;
    
}

// function shiftArray(arr, index){
//     const firstPart = arr.slice(index);
//     const secondPart = arr.slice(0, index);
//     const shiftedArray = firstPart.concat(secondPart);
//     return shiftedArray;
// }

// first pass than activateDeactivate //
function activateDeactivatePlayer(){
    let activePlayer = null;
    let nextActivePlayer = null;
    
    Object.entries(players).forEach(([k,v])=>{
        if (v.active){
            if (k == 3){
                activePlayer = players[k];
                nextActivePlayer = players[0];
            }
            if (k < 3){
                activePlayer = players[k];
                nextActivePlayer = players[Number(k)+1];
            }
        }
    })
    
    activePlayer.active = false;
    nextActivePlayer.active = true;
    // console.log(activePlayer, nextActivePlayer);

    // return [activePlayer, nextActivePlayer]
}

function gameContinues(){
    const nonPassPlayers = filterPlayers('pass', [false], filterOut=false);

    if(JSON.stringify(nonPassPlayers) === '{}'){
        // stopGame()
        return false;
    }
    return true;
}


function runAutoPlayer(){
    const activePlayer = filterPlayers('active', [true], filterOut=false);
    if (Object.values(activePlayer)[0].auto){
        // Do automatic things //

        setTimeout(()=>{
            activateDeactivatePlayer();
            if(gameContinues()){
                runAutoPlayer();
            }
            
        }, 3000);
    }

}

function playCards(){
    if (cardPickedBank.length == 1 && cardPickPlayer.length == 1){
        swapCards(cardPickedBank[0], cardPickPlayer[0]);
        enableDisablePlayCardsBtn('hidden');
        activateDeactivatePlayer();
        if (gameContinues()){
            runAutoPlayer();
        }
        
    }
}

function enableDisablePlayCardsBtn(trigger){
    const playCardsBtn = document.getElementById('play-cards-btn');
    const triggerCondition = playCardsBtn.getAttribute('class'); // 'hidden' 'visible'

    if (triggerCondition != trigger){
        if (trigger == 'hidden'){
            removeClassFromElement(playCardsBtn, 'visible');
            addClassToElement(playCardsBtn, 'hidden');
        }
        if (trigger == 'visible'){
            removeClassFromElement(playCardsBtn, 'hidden');
            addClassToElement(playCardsBtn, 'visible');
        }
    }  
}

function addToCardDB(cardID, cardElem){
    let splitID = cardID.split('-');
    let cardSymbol = splitID[0];
    let cardIcon = splitID[1];
    let cardValue = Number(cardIcon);

    if (!cardValue){
        cardValue = charValues[cardIcon];
    }
    
    cardsDB[cardID] = {'elem': cardElem, 'picked':false, 'access':false, 'value':cardValue,'symbol':cardSymbol, 'icon':cardIcon, 'location':''};
    // return {cardID:{'elem': elem, 'picked':false, 'access':false, 'value':cardValue,'symbol':cardSymbol, 'icon':cardIcon}};
}


function findCardID(cardElem){

    return returnID = Object.keys(cardsDB).filter(cardID => cardsDB[cardID].elem == cardElem)[0]
        
}

function filterPlayers(field, valuesArr, filterOut=true){
    // Conversion to lower Case ??? //

    if (field == 'key'){
        if (filterOut){
            return Object.fromEntries(Object.entries(players).filter(([k,v]) => !valuesArr.includes(k)));
        }
        else{
            return Object.fromEntries(Object.entries(players).filter(([k,v]) => valuesArr.includes(k)));
        }
    }
    
    if (filterOut){
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => !valuesArr.includes(v[field])));
    } else {
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => valuesArr.includes(v[field])));
    }
}


function cardHoverEffect(hoverElem, reverse=false){
    let matrixStr = ''
    let targetStyle = hoverElem.getAttribute('style').split(/\s/);
    targetStyle = targetStyle.map(item => item.replace(',',''));
    const transform = targetStyle[0];
    const matrix3D = targetStyle.slice(1, targetStyle.length-2);
    const zIndex = targetStyle.slice(targetStyle.length -2);

    let hoverX = hoverOffsetX;
    let hoverY = hoverOffsetY

    if (reverse){
        hoverX = -1 * hoverX;
        hoverY = -1 * hoverY;
    }

    matrix3D[12] = Number(matrix3D[12]) - hoverX;
    matrix3D[13] = Number(matrix3D[13]) - hoverY;

    matrixStr = `${transform} ${matrix3D.toString()} ${zIndex.toString().replace(',', '')}}`;
    
    return matrixStr;
}



function mouseOverEvent(elem){

    elem.addEventListener(
        "mouseenter",
        (event) => {
            // Hover UP //
            const cardID = findCardID(elem);
            if (cardsDB[cardID].access && !cardsDB[cardID].picked){
                event.target.style = cardHoverEffect(event.target);
            }
        },
        false,
      );

      elem.addEventListener(
        "mouseleave",
        (event) => {
            // Hover DOWN //
            const cardID = findCardID(elem);
            if (cardsDB[cardID].access && !cardsDB[cardID].picked){
                event.target.style = cardHoverEffect(event.target, reverse=true);
            }
        },
        false,
      );
}


function swapCards(bankCardID,playerCardID){
    const timingRepos = 700;
    const timingCalc = 500;
    const bankLocation = cardsDB[bankCardID].location;
    const bank = filterPlayers('location', bankLocation, filterOut=false);
    const bankID = Object.keys(bank)[0];
    const playerLocation = cardsDB[playerCardID].location;
    const player = filterPlayers('location', playerLocation, filterOut=false);
    const playerID = Object.keys(player)[0];

    

    // add bankCardID to Player
    players[playerID]['cards-in-hand'][bankCardID] = players[bankID]['cards-in-hand'][bankCardID];
    // players[playerID]['cards-in-hand'][bankCardID] = {'x': 0, 'y': 0};
    // reset location //
    cardsDB[bankCardID].location = playerLocation;

    // add playerCardID to Bank
    players[bankID]['cards-in-hand'][playerCardID] = players[playerID]['cards-in-hand'][playerCardID];
    // players[bankID]['cards-in-hand'][playerCardID] = {'x': 0, 'y': 0};
    // reset location //
    cardsDB[playerCardID].location = bankLocation;

    // remove bankCardID from Bank
    delete players[bankID]['cards-in-hand'][bankCardID];
    // reset pick //
    cardsDB[playerCardID].picked = false;

    // remove playerCardID from Player
    delete players[playerID]['cards-in-hand'][playerCardID]
    // reset pick //
    cardsDB[bankCardID].picked = false;

    setTimeout(()=>{
        calcCardPositions(players[playerID]);
        calcCardPositions(players[bankID], stacked=false);
    },timingCalc);

    cardPickedBank.pop();
    cardPickPlayer.pop();


    setTimeout(()=>{
        repositionCards([playerID, bankID]);
    },timingRepos);
    
}

function pickCardEvent(pickedElem){
    const cardID = findCardID(pickedElem);
    const location = cardsDB[cardID].location;

    if (location == 'center'){
        // Bank [4]
        if (cardPickedBank.length == 0){
            cardPickedBank.push(cardID); // cardPickedBank.push(pickedElem);
            cardsDB[cardID].picked = true;
        }else{
            if (cardID == cardPickedBank[0]){
                const unPickSameBankID = cardPickedBank.pop();
                cardsDB[unPickSameBankID].picked = false;
            }else{
                const unPickBankID = cardPickedBank.pop();
                cardsDB[unPickBankID].picked = false;
                cardPickedBank.push(cardID); // cardPickedBank.push(pickedElem);
                cardsDB[cardID].picked = true;
                triggerLeaveEffect(cardsDB[unPickBankID].elem);
            }

        }
    }
    if (location == 'south'){
        // Local Player [0]
        if (cardPickPlayer.length == 0){
            cardPickPlayer.push(cardID); // cardPickPlayer.push(pickedElem);
            cardsDB[cardID].picked = true;
        }else{
            if (cardID == cardPickPlayer[0]){
                const unPickSamePlayerID = cardPickPlayer.pop();
                cardsDB[unPickSamePlayerID].picked = false;
            }else{
                const unPickPlayerID = cardPickPlayer.pop();
                cardsDB[unPickPlayerID].picked = false;
                cardPickPlayer.push(cardID); // cardPickPlayer.push(pickedElem);
                cardsDB[cardID].picked = true;
                triggerLeaveEffect(cardsDB[unPickPlayerID].elem);
            }
            
        }
    }
    // console.log(cardsDB);
}

function triggerLeaveEffect(elem){
    const hoverDown = new Event("mouseleave");
    elem.dispatchEvent(hoverDown);
}

function cardClickEvent(elem){

    elem.addEventListener('click', (event)=>{
        const cardID = findCardID(event.target);
        // if (cardsDB[cardID].access){
        if (cardsDB[cardID].access && players[0].active){
            pickCardEvent(event.target);
        }

        if (cardPickedBank.length == 1 && cardPickPlayer.length == 1){
            enableDisablePlayCardsBtn('visible');
            // setTimeout(()=>{
            //     swapCards(cardPickedBank[0], cardPickPlayer[0]);
            // },100);
        }else{
            enableDisablePlayCardsBtn('hidden');
        }


    })
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
    const cardSymbols = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

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
        // add card to DB //
        addToCardDB(cardId, cardElem);
        // add card to player hand //
        // players[`${playerID}`]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};
        players[`${playerID}`]['cards-in-hand'][cardId] = {'x':0, 'y':0};
        cardsDB[cardId].location = players[`${playerID}`].location;
        // add hover mouse event //
        mouseOverEvent(cardElem);
        // add click card event //
        cardClickEvent(cardElem);

        if (players[`${playerID}`].name == 'Bank'){
            calcCardPositions(players[`${playerID}`], stacked=false);
            // give player acces to card //
            cardsDB[cardId].access = true;
        }else{
            if (players[`${playerID}`].location == 'south'){
                cardsDB[cardId].access = true;
            }
            // calc cardPosition //
            calcCardPositions(players[`${playerID}`]);
        }
        
        playerID += 1;

        if (playerID == Number(playersID[playersID.length-1])+1){
            playerID = 0;
        }

    })

    // position cards
    const bank = filterPlayers('name', ['Bank'], filterOut=false);
    const nonBankPlayers = filterPlayers('name', ['Bank']);

    dealingCards(nonBankPlayers, timing);
    setTimeout(()=>{
        dealingCards(bank, timing);
    },(allCards.length + 1)*timing);
    
}


function repositionCards(playersID){
    let zIndex = 1;

    playersID.forEach(id => {
        const orientation = players[id].orientation;
        const cardsID = Object.keys(players[id]['cards-in-hand'])

        cardsID.forEach(cardID =>{
            const cardElem = cardsDB[cardID].elem;
            const cardPos = players[id]['cards-in-hand'][cardID];
            cardElem.style = `transform: matrix3d(
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
                ${cardPos.x},
                ${cardPos.y},
                0,
                1
                ); z-index: ${zIndex};`;
            
            zIndex += 1;
        });
    })
}


function dealingCards(players, timing){
    let i = 0;
    const playersID = Object.keys(players)
    let playerIndex = 0;
    let zIndex = 1;
    let cardIndex = 0;
    let numCardsToDeal = 0;
    

    playersID.forEach(id => {
        numCardsToDeal += Object.keys(players[id]['cards-in-hand']).length;
    })

    const intervalID = setInterval(()=>{
        if (i == numCardsToDeal -1){
            clearInterval(intervalID);
        }
        
        let player = players[`${playersID[playerIndex]}`];
        const cardIds = Object.keys(player['cards-in-hand']);
        // cardID = "Clubs-8": Object {x: 425, y: 870 } // 
        const cardId = cardIds[cardIndex];
        const card = player['cards-in-hand'][cardId];
        const orientation = player.orientation;

        // TEMP ELEMENT
        const text = document.createTextNode(cardId);
        const cardElem = cardsDB[cardId].elem;
        addChildElement(cardElem, text);

        cardElem.style = `transform: matrix3d(
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
            ); z-index: ${zIndex};`;
        
        zIndex += 1;
        playerIndex += 1;

        if (playerIndex == playersID.length){
            cardIndex += 1;
            playerIndex = 0;
        }

        i += 1;
    }, timing);
}
  

function calcCardPositions(player, stacked=true){
     // let playerCardObj = {cardId:{'x':cardX, 'y':cardY}};
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
