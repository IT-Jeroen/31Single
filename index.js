const players = [
    {"id":'012345', "name":'Owen', "location": 'south', 'cards-in-hand':{}, 'wins': 0, 'orientation': '0deg' },
    {"id":'012345', "name":'Ziva', "location": 'west', 'cards-in-hand':{}, 'wins': 0, 'orientation': '90deg'  },
    {"id":'012345', "name":'Dad', "location": 'north', 'cards-in-hand':{}, 'wins': 0, 'orientation': '180deg'  },
    {"id":'012345', "name":'Mum', "location": 'east', 'cards-in-hand':{}, 'wins': 0, 'orientation': '270deg'  }
]


const dealingCards = 3;

const playFieldElem = document.querySelector('#playfield')
const startGame = document.querySelector('#start')
const cardDeck = document.querySelector('#deck');

startGame.addEventListener('click', ()=> {
    dealCards(dealingCards);
})


function dealCard(player, id){
    // create deck card
    const deckElem = createCard(["card","deck-deal", "transition"]);
    addIdToElement(deckElem, id)
    addChildElement(playFieldElem,deckElem);

    // add card to player
    player["cards-in-hand"][id] = {x:0, y:0};

    // calc player card position
    calcCardPositions(player)
    setTimeout(()=>{
        // move deck card to player
        stackToPlayer(player)},10)
}

function dealCards(num){
    let id = 0;

    for (let i = 0; i < num; i++){
        players.forEach((player,index)=>{
            dealCard(player, id);
            id += 1;
        })
    }
    console.log(players)
}


let fieldSize = 1000;
let cardWidth = fieldSize / 10;
let cardHeight = cardWidth * 1.3;
let stackOffset = 25;
let center = fieldSize / 2;
let southTop = center - (cardHeight /2);
let westTop = -1 * (center - (cardHeight /2));
let northTop = -1 * (center - (cardHeight /2));
let eastTop = center - (cardHeight /2);
let deckOriginX = center - (cardWidth /2);
let deckOriginY = center - (cardHeight /2);

function stackToPlayer(player){

    let cardsInHand = player['cards-in-hand']

    Object.keys(cardsInHand).forEach(key =>{
        const cardPos = cardsInHand[key];
        const cardElem = document.getElementById(`${key}`);
        cardElem.style.transform = `translate(${cardPos.x}px, ${cardPos.y}px) rotate(${player.orientation})`;
    })
}


function calcCardPositions(player, stacked=true){
    let cardsInHand = player['cards-in-hand'];
    let handWidth = 0;

    if (stacked){
        handWidth = cardWidth + ((Object.keys(cardsInHand).length -1) * stackOffset);
    }
    else{
        handWidth = cardWidth * cardsInHand.length;
    }
    
    let emptySpace = center - deckOriginX - (handWidth /2)

    if (player.location == 'south'){
        Object.keys(cardsInHand).forEach((key, index) => {
            player['cards-in-hand'][key].y = southTop;
            player['cards-in-hand'][key].x = emptySpace + (index * stackOffset);
        })
    }

    if (player.location == 'west'){
        Object.keys(cardsInHand).forEach((key, index) => {
            player['cards-in-hand'][key].x = westTop;
            player['cards-in-hand'][key].y = emptySpace + (index * stackOffset);
        })

    }

    if (player.location == 'north'){
        Object.keys(cardsInHand).forEach((key, index) => {
            player['cards-in-hand'][key].y = northTop;
            player['cards-in-hand'][key].x = emptySpace + (index * stackOffset);
        })

    }
    if (player.location == 'east'){
        Object.keys(cardsInHand).forEach((key, index) => {
            player['cards-in-hand'][key].x = eastTop;
            player['cards-in-hand'][key].y = emptySpace + (index * stackOffset);
        })

    }


    return cardsInHand
}


function createCard(classNames){
    const cardElem = createElement('div');

    for(let item of classNames){
        addClassToElement(cardElem, item);
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