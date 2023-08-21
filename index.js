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


// Keep players key a string or a number //
// Will be better to keep string if players becomes a json object //
const players = {
    '0': {"name":'Local Player', "location": 'south', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0},
    '1': {"name":'Ziva', "location": 'west', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix90},
    '2': {"name":'Dad', "location": 'north', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix180},
    '3': {"name":'Mum', "location": 'east', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix270},
    '4': {"name":'Bank', "location": 'center', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0},
}

// cardID = "Clubs-8": Object { elem: div.card, x: 425, y: 870 } //
const charValues = {'A':11, 'K':10, 'Q':10, 'J': 10};
const cardsDB = {};


const numPlayersCards = 5;
const cardsInGame = (Object.keys(players).length) * numPlayersCards;

const playFieldElem = document.querySelector('#playfield')
const startGame = document.querySelector('#start')

let fieldSize = 1000;
let cardWidth = fieldSize / 10;
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


startGame.addEventListener('click', ()=> {
    createDeck(cardsInGame, matrix0, deckPos);
    dealCards(players);
})


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



function mouseOverEvent(elem, allowHoverUp=true, allowHoverDown=true){

    elem.addEventListener(
        "mouseenter",
        (event) => {
            // event.target.style = cardHoverEffect(event.target);
            if (allowHoverUp){
                event.target.style = cardHoverEffect(event.target);
            }
        },
        false,
      );

      elem.addEventListener(
        "mouseleave",
        (event) => {
            // event.target.style = cardHoverEffect(event.target, reverse=true);
            if (allowHoverDown){
                event.target.style = cardHoverEffect(event.target, reverse=true);
            }
        },
        false,
      );
}

// Every Cards going out the other players needs to have a mouseEvent removed
function removeMouseOverEvent(elem){

}



function pickedCardEffect(pickedElem, unpick=false){
    // hover effect in place

    // block hover down effect


}

function swapCards(elemBank,elemPlayer){
    const player = players['0'];
    const bank = players['4'];
    let playerCardID = '';
    let bankCardID = '';
    let timing = 500;

    for (const [id, card] of Object.entries(player['cards-in-hand'])) {
        if (elemPlayer == card.elem ){
            playerCardID = id;
        }     
    }

      for (const [id, card] of Object.entries(bank['cards-in-hand'])) {
        if (elemBank == card.elem ){
            bankCardID = id; 
        }  
    }

    if (playerCardID){
        players['0']['cards-in-hand'][bankCardID] = players['4']['cards-in-hand'][bankCardID];
        delete players['4']['cards-in-hand'][bankCardID];
    }

    if (bankCardID){
        players['4']['cards-in-hand'][playerCardID] = players['0']['cards-in-hand'][playerCardID];
        delete players['0']['cards-in-hand'][playerCardID]; 
    }

    setTimeout(()=>{
        calcCardPositions(players['0']);
        calcCardPositions(players['4'], stacked=false);
    },500);
    
    cardPickedBank.pop();
    cardPickPlayer.pop();

    setTimeout(()=>{
        repositionCards(['0', '4']);
    },timing)

} 


function cardClickEvent(elem){
    const bankY = deckPos.y;
    const southY = southTop;

    elem.addEventListener('click', (event)=>{
        const targetElem = event.target
        const stringMatrix = targetElem.getAttribute('style');
        let matrixArray = stringMatrix.split(/\s/);
        matrixArray = matrixArray.map(item => item.replace(',',''));
        const targetY = Number(matrixArray[14]);

        if (targetY + hoverOffsetY - bankY < clickCardOffset && targetY + hoverOffsetY - bankY > -1 * clickCardOffset){
            if (cardPickedBank.length == 0){
                cardPickedBank.push(targetElem);
            }else{
                const unPickBankElem = cardPickedBank.pop();
                cardPickedBank.push(targetElem);
            }
        }
        if (targetY + hoverOffsetY - southY < clickCardOffset && targetY + hoverOffsetY - southY > -1 * clickCardOffset){
            if (cardPickPlayer.length == 0){
                cardPickPlayer.push(targetElem);
            }else{
                const unPickPlayerElem = cardPickPlayer.pop();
                cardPickPlayer.push(targetElem);
            }

        }

        if (cardPickedBank.length == 1 && cardPickPlayer.length == 1){
            swapCards(cardPickedBank[0], cardPickPlayer[0]);
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

function addToCardDB(cardID, cardElem){
    let splitID = cardID.split('-');
    let cardSymbol = splitID[0];
    let cardIcon = splitID[1];
    let cardValue = Number(cardIcon);

    if (!cardValue){
        cardValue = charValues[cardIcon];
    }
    
    cardsDB[cardID] = {'elem': cardElem, 'picked':false, 'access':false, 'value':cardValue,'symbol':cardSymbol, 'icon':cardIcon};
    // return {cardID:{'elem': elem, 'picked':false, 'access':false, 'value':cardValue,'symbol':cardSymbol, 'icon':cardIcon}};
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
        players[`${playerID}`]['cards-in-hand'][cardId] = {'elem': cardElem, 'x':0, 'y':0};

        if (players[`${playerID}`].name == 'Bank'){
            // add hover mouse event //
            mouseOverEvent(cardElem);
            // add click card event //
            cardClickEvent(cardElem);
            // calc cardPosition //
            calcCardPositions(players[`${playerID}`], stacked=false);
            // give player acces to card //
            cardsDB[cardId].access = true;
        }else{
            if (players[`${playerID}`].location == 'south'){
                // add hover mouse event //
                mouseOverEvent(cardElem);
                // add click card event //
                cardClickEvent(cardElem);
                // give player acces to card //
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

    console.log(cardsDB);

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
            let card = players[id]['cards-in-hand'][cardID]
            card.elem.style = `transform: matrix3d(
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
        // cardID = "Clubs-8": Object { elem: div.card, x: 425, y: 870 } //
        const cardId = cardIds[cardIndex];
        const card = player['cards-in-hand'][cardId];
        const orientation = player.orientation;

        // TEMP ELEMENT
        const text = document.createTextNode(cardId);
        addChildElement(card.elem, text);   

        // card.elem.style.transform = `matrix3d(
        //     ${orientation[0]},
        //     ${orientation[1]},
        //     ${orientation[2]},
        //     0,
        //     ${orientation[3]},
        //     ${orientation[4]},
        //     0,
        //     0,
        //     ${orientation[5]},
        //     0,
        //     ${orientation[6]},
        //     0,
        //     ${card.x},
        //     ${card.y},
        //     0,
        //     1
        //     )`; 

        card.elem.style = `transform: matrix3d(
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
