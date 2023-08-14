const players = [
    {"id":'012345', "name":'Owen', "location": 'south', 'cards-in-hand':[], 'wins': 0, 'orientation': '0deg' },
    {"id":'012345', "name":'Ziva', "location": 'west', 'cards-in-hand':[], 'wins': 0, 'orientation': '90deg'  },
    {"id":'012345', "name":'Dad', "location": 'north', 'cards-in-hand':[], 'wins': 0, 'orientation': '180deg'  },
    {"id":'012345', "name":'Mum', "location": 'east', 'cards-in-hand':[], 'wins': 0, 'orientation': '270deg'  }
]

const dealingCards = 3;

const playFieldElem = document.querySelector('#playfield')
const startGame = document.querySelector('#start')
const cardDeck = document.querySelector('#deck');
// const topDeckCard = cardDeck.lastElementChild

startGame.addEventListener('click', ()=> {
    // createPlayers(players);
    dealCards(dealingCards);
})

/* Build playfield dynamicaly and query viewport dimensions
Set playfield dimensions according to smallest value
*/

// function dealCards(num){
//     for (let i = 0; i < num; i++){
//         players.forEach((player,index)=>{
//             const playerHand = document.querySelector(`#${player.name}`);
//             const playerCardHolder = createCardHolder(['card-holder',`offset-${i}`]);
//             const playerCard = createCard(["card"])
//             addChildElement(playerHand, playerCardHolder);

//             const deckElem = createCard(["card","deck-3"]);
//             addChildElement(cardDeck,deckElem);

//             repositionStarElem(deckElem, playerCardHolder, player.location);

//             setTimeout(() => {
//                 addChildElement(playerCardHolder,playerCard);
//                 // deckElem.remove();
//               }, 600);
//         })
//     }
//     console.log(players)
// }

function dealCards(num){
    for (let i = 0; i < num; i++){
        players.forEach((player,index)=>{
            // create deck card
            const deckElem = createCard(["card","deck-3"]);
            addChildElement(playFieldElem,deckElem);

            // calc player card position
            let cardPosition = calcCardPosition(0, player.location);

            // move deck card to player
            stackToPlayer(deckElem,cardPosition, player.orientation);

            // add card to player
            player["cards-in-hand"].push(deckElem);
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

function stackToPlayer(cardElem,cardPos, orientation){
    cardElem.style.transform = `translate(${cardPos.x}px, ${cardPos.y}px) rotate(${orientation})`;
}


function calcCardPosition(cardsInHand, location, stacked=true){
    const calculatedPosition = {x:0, y:0};

    if (location == 'south'){
        // calculatedPosition.x = center;
        calculatedPosition.y = southTop;
    }

    if (location == 'west'){
        calculatedPosition.x = westTop;
        // calculatedPosition.y = center;
    }

    if (location == 'north'){
        // calculatedPosition.x = center;
        calculatedPosition.y = northTop;
    }
    if (location == 'east'){
        calculatedPosition.x = eastTop;
        // calculatedPosition.y = center;
    }

    return calculatedPosition
}




function playerToStack(player){

}

// function repositionStarElem(startElem, endElem, location=''){

//     console.log(location)
//     var rectStart = startElem.getBoundingClientRect();
//     console.log('Start',rectStart.x, rectStart.y, rectStart.height);
//     var rectEnd = endElem.getBoundingClientRect();
//     console.log('End',rectEnd.x, rectEnd.y);
//     console.log('Delta', rectEnd.x - rectStart.x, rectEnd.y - rectStart.y)

//     let fieldSize = 1000;
//     let cardWidth = fieldSize / 10;
//     let cardHeight = cardWidth * 1.3;
//     let offset = ((cardHeight - cardWidth)/ 2);
//     let center = fieldSize / 2;
//     let southTop = fieldSize - cardHeight;
//     let westTop = 0 + cardHeight;
//     let northTop = 0 + cardHeight;
//     let eastTop = fieldSize - cardHeight;
//     // startElem.style.transform = `translate(${rectEnd.left - rectStart.left}px, ${rectEnd.top - rectStart.top}px)`;

//     if (location == 'south'){
//         startElem.style.transform = `translate(${rectEnd.x - rectStart.x}px, ${rectEnd.y- rectStart.y}px)`;
//     }
//     if (location == 'west'){
//         // startElem.style.transform = `translate(${rectEnd.x - rectStart.x - rectStart.width - offset}px, ${rectEnd.y - rectStart.y - offset}px) rotate(90deg)`;
//         startElem.style.transform = `translate(${rectEnd.x - rectStart.x}px, ${rectEnd.y - rectStart.y}px)`;
//     }
//     if (location == 'north'){
//         // startElem.style.transform = `translate(${rectEnd.x - rectStart.x - rectStart.width}px, ${rectEnd.y - rectStart.y - rectStart.height}px) rotate(180deg)`;
//         startElem.style.transform = `translate(${rectEnd.x - rectStart.x}px, ${rectEnd.y - rectStart.y}px)`;
//     }
//     if (location == 'east'){
//         // startElem.style.transform = `translate(${rectEnd.x - rectStart.x + offset}px, ${rectEnd.y - rectStart.y - rectStart.width -offset}px) rotate(270deg)`;
//         startElem.style.transform = `translate(${rectEnd.x - rectStart.x}px, ${rectEnd.y - rectStart.y}px)`;
//     }
// }


function createPlayers(players){
    players.forEach((player,index)=>{
        createHand(player);
    })
}

function createHand(player){
    const handElem = createElement('div');
    addIdToElement(handElem, player.name);
    addClassToElement(handElem, 'start-pos');
    addClassToElement(handElem, player.location);
    addChildElement(playFieldElem, handElem);
}

function createCard(classNames){
    const cardElem = createElement('div');

    for(let item of classNames){
        addClassToElement(cardElem, item);
    }
    // addClassToElement(cardElem, "card");
    // addClassToElement(cardElem, className);

    return cardElem;
}

function createCardHolder(classNames){
    const cardHolderElem = createElement('div')

    for(let item of classNames){
        addClassToElement(cardHolderElem, item);
    }
    // addClassToElement(cardHolderElem, 'card-holder');
    // addClassToElement(cardHolderElem, classLocation);

    return cardHolderElem;
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