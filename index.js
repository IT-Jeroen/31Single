// https://ramlmn.github.io/visualizing-matrix3d/
// https://meyerweb.com/eric/tools/matrix/

// 0 DEGREE Y-AXIS //
const matrix0 = [1,0,0,0,1,0,1]; // 0 degree z axis
const matrix90 = [0,1,0,-1,0,0,1]; // 90 degree z axis
const matrix180 = [-1,0,0,0,-1,0,1]; // 180 degree z axis
const matrix270 = [0,-1,0,1,0,0,1]; // 270 degree z axis

// 180 DEGREE Y-AXIS //
const matrix0Flipped = [-1,0,0,0,1,0,-1]; // 0 degree z axis
const matrix90Flipped = [0,-1,0,1,0,0,-1]; // 90 degree z axis
const matrix180Flipped = [1,0,0,0,-1,0,-1]; // 180 degree z axis
const matrix270Flipped = [0,1,0,-1,0,0,-1]; // 270 degree z axis

// Cards In Hand Object = "Clubs-8" :{ x: 425, y: 870 }} //
// Keep elem cards-in-hand as well for quicker search ??? (cards-in-hand.length vs cards-in cardsDB.length) //
const players = {
    0: {"name":'Local Player', "location": 'south', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0, 'pass': false, 'active':false, 'auto':false},
    1: {"name":'Ziva', "location": 'west', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix90Flipped, 'pass': false, 'active':false, 'auto':true},
    2: {"name":'Dad', "location": 'north', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix180Flipped, 'pass': false, 'active':false, 'auto':true},
    3: {"name":'Mum', "location": 'east', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix270Flipped, 'pass': false, 'active':false, 'auto':true},
    4: {"name":'Bank', "location": 'center', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0, 'pass': true, 'active':false, 'auto':false},
}

// const charValues = {'A':11, 'K':10, 'Q':10, 'J': 10};
const charValues = {'ace':11, 'king':10, 'queen':10, 'jack': 10};
// Card in CardsDB = "Clubs-8": Object { elem: div.card, picked:false, access:true, value:8, symbol:'Clubs', icon:'8'} //
const cardsDB = {}; // Generated in dealCards() with addToCardDB()
const numPlayersCards = 3;
const cardsInGame = (Object.keys(players).length) * numPlayersCards;

const backgroundElem = document.getElementById('background');
const playFieldElem = document.getElementById('playfield');
let playCardsBtn = document.getElementById('play-cards-btn');
let holdCardsBtn = document.getElementById('hold-cards-btn');
let swapBankBtn = document.getElementById('swap-bank-btn');

const viewPortDimension = {'width': window.innerWidth, 'height': window.innerHeight};
const viewPortScale = {'scale': 1, 'x': 1, 'y': 1};
console.log('Load File ViewPort', viewPortDimension);
console.log('Load File Scale', viewPortScale);

const imageDimensions = {'width': 169, 'height': 244};
const cssViewPort = {'width': 0.98, 'height': 0.98};

const cardDimensions = {'width': imageDimensions.width * viewPortScale.scale, 'height': imageDimensions.height * viewPortScale.scale};
const offset = {'stacked':40 * viewPortScale.scale, 'hoverx':5, 'hovery':40 * viewPortScale.scale};
const handWidth = {'stacked': (cardDimensions.width + ((numPlayersCards -1) * offset.stacked)), 'unstacked': (numPlayersCards * cardDimensions.width)};
const btnDimensions = {'width': handWidth.stacked, 'height': null};
const centerPos = {'x': (cssViewPort.width * viewPortDimension.width) / 2,'y': (cssViewPort.height * viewPortDimension.height) / 2};
const deckPos = {'x': centerPos.x - (cardDimensions.width / 2), 'y': centerPos.y - (cardDimensions.height /2)};
const zonesPos = {
    'south': (cssViewPort.height * viewPortDimension.height) - cardDimensions.height,
    'west': (cardDimensions.height - cardDimensions.width) /2,
    'north': 0,
    'east': (cssViewPort.height * viewPortDimension.width - cardDimensions.height + ((cardDimensions.height - cardDimensions.width) /2))
}



// Added width and height to cardElem, Now different (irregular different) outcomes //
// const deckPos = {'x': centerPos.x + (cardDimensions.width / 2), 'y': centerPos.y - (cardDimensions.height /2)};
// const zonesPos = {
//     'south': (cssViewPort.height * viewPortDimension.height) - cardDimensions.height,
//     'west': 0,
//     'north': cardDimensions.height,
//     'east': (cssViewPort.height * viewPortDimension.width)
// }

const minViewPortDimensions = {'width': ((numPlayersCards -1) * cardDimensions.height) + (numPlayersCards * cardDimensions.width) + 80, 'height': (3 * cardDimensions.height) + 80};

// // let fieldSize = 1000;
// // let cardWidth = fieldSize / 8;
// // let cardHeight = cardWidth * 1.3;
// const cssViewHeight = 0.98;
// const cssViewWidth = 0.98;
// const cardWidth = cardDimensions.width * viewPortScale.scale;
// const cardHeight = cardDimensions.height * viewPortScale.scale;
// const imageWidht = cardDimensions.width * viewPortScale.scale;
// const imageHeight = cardDimensions.height * viewPortScale.scale;
// const stackOffset = 40 * viewPortScale.scale;
// const hoverOffsetX = 5;
// const hoverOffsetY = 40 * viewPortScale.scale;
// const stackedHandWidth = (cardWidth + ((numPlayersCards -1) * stackOffset)) * viewPortScale.scale; 
// const btnHeight = 0;
// const btnWidth = stackedHandWidth;
// const minViewPortDimensions = {'width': ((numPlayersCards -1) * cardHeight) + (numPlayersCards * cardWidth) + 80, 'height': (3 * cardHeight) + 80};
// // const minViewPortWidth = (2 * cardHeight) + (3 * cardWidth) + 80;
// // const minViewPortHeight = (3 * cardHeight) + 80;
// // let center = fieldSize / 2;
// // let southTop = fieldSize - cardHeight;
// // let westTop = (cardHeight - cardWidth) /2;
// // let northTop = 0;
// // let eastTop = fieldSize - cardHeight + ((cardHeight - cardWidth) /2);
// // const deckPos = {'x': center - (cardWidth /2), 'y':center - (cardHeight /2)};
// const centerHeight = (cssViewHeight * viewPortDimension.height) / 2;
// const centerWidth = (cssViewWidth * viewPortDimension.width) / 2;
// const southTop = (cssViewHeight * viewPortDimension.height) - cardHeight;
// const westTop = (cardHeight - cardWidth) /2;
// const northTop = (cardDimensions.height * viewPortScale.scale) - cardDimensions.height;
// const eastTop = (cssViewWidth * viewPortDimension.width - cardHeight + ((cardHeight - cardWidth) /2));
// // const deckPos = {'x': centerWidth - (cardWidth /2), 'y':centerHeight - (cardHeight /2)};
// const deckPos = {'x': centerWidth - (cardWidth / 2), 'y': centerHeight - (cardHeight /2)};

// const clickCardOffset = 5;
const cardPickedBank = [];
const cardPickedPlayer = [];


// SCALE DISTORTED TRANSLATE //
function calculateVariables(){
    viewPortScale.scale = 1;
    viewPortDimension.width = window.innerWidth;
    viewPortDimension.height = window.innerHeight;
    console.log('Calc Var ViewPort [0]', viewPortDimension);
    console.log('Calc Var Scale [0]', viewPortScale);
    
    const widthScale  = viewPortDimension.width / minViewPortDimensions.width;
    const heightScale = viewPortDimension.height / minViewPortDimensions.height;

    viewPortScale.x = widthScale;
    viewPortScale.y = heightScale;
 
    if (heightScale < 1 || widthScale < 1){
        if (heightScale < widthScale){
            viewPortScale.scale = heightScale;
            viewPortScale.x = widthScale;
            viewPortScale.y = heightScale;
            // console.log(viewPortScale);
        }else{
            viewPortScale.scale = widthScale;
            viewPortScale.x = widthScale;
            viewPortScale.y = heightScale;
            // console.log(viewPortScale);
        }
    }


    cardDimensions.width = imageDimensions.width * viewPortScale.scale;
    cardDimensions.height = imageDimensions.height * viewPortScale.scale
    offset.stacked = 40 * viewPortScale.scale;
    offset.hovery = 40 * viewPortScale.scale

    handWidth.stacked = (cardDimensions.width + ((numPlayersCards -1) * offset.stacked));
    handWidth.unstacked = (numPlayersCards * cardDimensions.width)
    btnDimensions.width = handWidth.stacked;

    zonesPos.south = (cssViewPort.height * viewPortDimension.height) - cardDimensions.height;
    zonesPos.west = (cardDimensions.height - cardDimensions.width) /2;
    // zonesPos.north = (cardDimensions.height - imageDimensions.height);
    zonesPos.east = (cssViewPort.height * viewPortDimension.width - cardDimensions.height + ((cardDimensions.height - cardDimensions.width) /2));

    centerPos.x = (cssViewPort.width * viewPortDimension.width) / 2;
    centerPos.y = (cssViewPort.height * viewPortDimension.height) / 2;

    deckPos.x = centerPos.x - (cardDimensions.width / 2);
    deckPos.y = centerPos.y - (cardDimensions.height / 2);
}


/////////////////////////// GAME MECHANICS //////////////////////////////////


function loadGame(){
    console.log('ID:',players[0].name)
    console.log('Load Game ViewPort', viewPortDimension);
    console.log('Load Game Scale', viewPortScale);
    console.log('Zones[0]', zonesPos);
    console.log('Center Pos [0]', centerPos);
    
    calculateVariables();

    setTimeout(()=>{
        console.log('Calc Var ViewPort [1]', viewPortDimension);
        console.log('Calc Var Scale [1]', viewPortScale);
        console.log('Zones[1]', zonesPos);
        console.log('Center Pos [1]', centerPos);
    },500);

    

    const playerName = document.getElementById('player-name');
    const playerEntry = document.getElementById('player-entry');
    const winnerDisplay = document.getElementById('winner-display');

    // Display Elements //
    setTimeout(()=>{
        if (playerEntry){
            players[0].name = playerName.value;
            players[0].auto = false;
            playerEntry.remove();
        }
        if (winnerDisplay){
            winnerDisplay.remove();
        }
        
    }, 500);

    // playCardsBtn = createPlayCardsBtn(((cssViewWidth * viewPortDimension.width) / 2 - (stackedHandWidth * 2)), southTop + 0.5 * cardHeight);
    // holdCardsBtn = createHoldCardsBtn(((cssViewWidth * viewPortDimension.width) / 2 - (stackedHandWidth * 2)), southTop + 0.5 * cardHeight);
    // swapBankBtn = createSwapBankBtn(((cssViewWidth * viewPortDimension.width) / 2 + stackedHandWidth), southTop + 0.5 * cardHeight);

    playCardsBtn = createPlayCardsBtn(((cssViewPort.width * viewPortDimension.width) / 2 - (handWidth.stacked * 2)), zonesPos.south + 0.5 * cardDimensions.height);
    holdCardsBtn = createHoldCardsBtn(((cssViewPort.width * viewPortDimension.width) / 2 - (handWidth.stacked * 2)), zonesPos.south + 0.5 * cardDimensions.height);
    swapBankBtn = createSwapBankBtn(((cssViewPort.width * viewPortDimension.width) / 2 + handWidth.stacked), zonesPos.south + 0.5 * cardDimensions.height);

    // Deal Cards //
    setTimeout(()=>{
        // setCursor('passive');
        dealDeckCards(300);
    }, 1000);

    // only after cards are dealt 
    setTimeout(()=>{
        players[0].active = true;
        enableDisablePlayHoldBtn(holdCardsBtn, 'visible');
        enableDisablePlayHoldBtn(swapBankBtn, 'visible');
        // setCursor('active');
    }, 6000);  
}


function resetGame(){
    // Remove All Cards From Play Field //
    document.querySelectorAll('.card').forEach(card => card.remove());
    // Reset PLayer Settings to default //
    Object.entries(players).forEach(([k,v])=>{
        
        if (players[k].name == 'Bank'){
            players[k].pass = true;
            players[k].active = false;
            players[k]['cards-in-hand'] = {};
        }else{
            players[k].pass = false;
            players[k].active = false;
            players[k]['cards-in-hand'] = {};
        }
    });

    // Reset cardsDB //

    loadGame();

}


function gameContinues(){
    const nonPassPlayers = filterPlayers('pass', [false], false);

    if(JSON.stringify(nonPassPlayers) === '{}'){
        return false;
    }
    return true;
}

function playerHold(){
    const activePlayer = filterPlayers('active', [true], false);
    Object.values(activePlayer)[0].pass = true;
    nextPlayer();
    enableDisablePlayHoldBtn(holdCardsBtn, 'hidden');
    enableDisablePlayHoldBtn(swapBankBtn, 'hidden');
}


function nextPlayer(winner=''){
    activateDeactivatePlayer();
    const activePlayer = filterPlayers('active', [true], false);
    
    if (!Object.values(activePlayer)[0].pass){
        if (Object.values(activePlayer)[0].auto){
            console.log('AUTOPLAYER !!!');
            // Do automatic things //
    
            setTimeout(()=>{
               nextPlayer();
                
            }, 3000);
        } else{
            enableDisablePlayHoldBtn(holdCardsBtn, 'visible');
            enableDisablePlayHoldBtn(swapBankBtn, 'visible');
        }
    }else{
        if(gameContinues()){
            // All players get one last move if winner is declared //
            if (winner){
                Object.values(activePlayer)[0].pass = true;
                nextPlayer(winner);
            }else{
                nextPlayer();
            }
        }else{
            // All Player Hold or Game has a Winner//
            // stopGame(winner);
            
            // TEMP WINNER //
            stopGame('Daddy');
        }
    }
    
}


// Manual Break nextPLayer Loop //
function stopLoop(){
    Object.entries(players).forEach(([k,v])=>{
        players[k].pass = true;
    })
}


function stopGame(winner=''){
    let topScore = 0;

    if (!winner){
        Object.entries(players).forEach(([k,v])=>{
            if (players[k].name != 'Bank'){
                const playerScore = calculateHand(players[k]['cards-in-hand']);
                if (playerScore > topScore){
                    topScore = playerScore;
                    winner = players[k].name;
                }
            }
        })
    }else{
        topScore = 31;
    }


    displayGameResults(winner, topScore);

    // show all cards //
    flipAllCards();

}

function playCards(){
    if (cardPickedBank.length == 1 && cardPickedPlayer.length == 1){
        swapCards(cardPickedBank[0], cardPickedPlayer[0]);
        enableDisablePlayHoldBtn(playCardsBtn, 'hidden');
        enableDisablePlayHoldBtn(swapBankBtn, 'hidden');
        nextPlayer();    
    }
}


// Swap Hand with Bank //
function swapBank(hold=true){
    const bank = Object.values(filterPlayers('name', ['Bank'], false))[0];
    const player = Object.values(filterPlayers('active', [true], false))[0];
    const playerHand = Object.keys(player['cards-in-hand']);
    const bankHand = Object.keys(bank['cards-in-hand']);
    
    playerHand.forEach((cardID, index)=>{
        swapCards(bankHand[index], cardID);
    })

    if (hold){
        player.pass = true;
    }

    enableDisablePlayHoldBtn(swapBankBtn, 'hidden');
    enableDisablePlayHoldBtn(holdCardsBtn, 'hidden');
    nextPlayer();
    
}


function swapCards(bankCardID,playerCardID){
    const timingRepos = 700;
    const timingCalc = 500;

    const playerLocation = cardsDB[playerCardID].location;
    const player = filterPlayers('location', playerLocation, filterOut=false);
    const playerID = Object.keys(player)[0];

    // const bankID = 4; //
    const bankLocation = cardsDB[bankCardID].location;
    const bank = filterPlayers('location', bankLocation, filterOut=false);
    const bankID = Object.keys(bank)[0];

    // ADD CARD//
    players[playerID]['cards-in-hand'][bankCardID] = players[bankID]['cards-in-hand'][bankCardID];
    players[bankID]['cards-in-hand'][playerCardID] = players[playerID]['cards-in-hand'][playerCardID];

    // REMOVE CARD //
    delete players[playerID]['cards-in-hand'][playerCardID]
    delete players[bankID]['cards-in-hand'][bankCardID];

    // RESET //
    cardsDB[bankCardID].location = playerLocation;
    cardsDB[playerCardID].location = bankLocation;
    cardsDB[playerCardID].picked = false;
    cardsDB[bankCardID].picked = false;
    cardPickedBank.pop();
    cardPickedPlayer.pop();

    setTimeout(()=>{
        calcCardPositions(players[playerID]);
        calcCardPositions(players[bankID], stacked=false);
    },timingCalc);

    
    setTimeout(()=>{
        repositionCards([playerID, bankID]);
    },timingRepos);
    
}


function handOutDeckCards(players, timing){
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
        const cardId = cardIds[cardIndex];
        const card = player['cards-in-hand'][cardId];
        const orientation = player.orientation;

        const cardElem = cardsDB[cardId].elem;
        // const frontElem = cardElem.getElementsByClassName('front');
        // const frontImg = frontElem[0].children[0];
        // frontImg.src = `./src/img/${cardId}.png`;
        // const backElem = cardElem.getElementsByClassName('back');
        // const backImg = backElem[0].children[0];
        // backImg.src = './src/img/back-blue.png';

        // cardElem.style = `transform: matrix3d(
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
        //     ); z-index: ${zIndex};`;

        // Scaling to keep images crisp //
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
            1.001
            ); width: ${cardDimensions.width}px; height: ${cardDimensions.height}px; z-index: ${zIndex};`;
        
        zIndex += 1;
        playerIndex += 1;

        if (playerIndex == playersID.length){
            cardIndex += 1;
            playerIndex = 0;
        }

        i += 1;
    }, timing);
}


function addDeckCardsToPlayers(){
    // players = Global Variable //
    // cardsInGame = Global Variable //
    // matrix0Flipped = Global Variable //
    // deckPos = Global Variable //
    const allCardElems = createDeckElements(cardsInGame, matrix0Flipped, deckPos);

    // Create card values and id's
    const deckCardValues = createRandomDeckValues(allCardElems.length, '7');
    let playersID = Object.keys(players)
    let playerID = 0;

    allCardElems.forEach((cardElem, index) =>{
        // pick a card //
        let cardId = deckCardValues[index];

        // Add Correct Card Images to image Elements //
        // const cardElem = cardsDB[cardId].elem;
        const frontElem = cardElem.getElementsByClassName('front');
        const frontImg = frontElem[0].children[0];
        frontImg.src = `./src/img/${cardId}.png`;
        const backElem = cardElem.getElementsByClassName('back');
        const backImg = backElem[0].children[0];
        backImg.src = './src/img/back-blue.png';
        
        // add card to DB //
        addCardToCardDB(cardId, cardElem);
        
        // add card to player hand //
        players[`${playerID}`]['cards-in-hand'][cardId] = {'x':0, 'y':0};
        cardsDB[cardId].location = players[`${playerID}`].location;
        
        if (players[`${playerID}`].name == 'Bank' || players[`${playerID}`].location == 'south'){
            cardsDB[cardId].access = true;
        }
        
        playerID += 1;

        if (playerID == Number(playersID[playersID.length-1])+1){
            playerID = 0;
        }
    })  
}

function dealDeckCards(timing){
    // players = Global Variable //
    // cardsInGame = Global Variable //
    const bankPlayer = filterPlayers('name', ['Bank'], false);
    const nonBankPlayers = filterPlayers('name', ['Bank']);
    
    addDeckCardsToPlayers(players);

    // Calculate Card Positions //
    Object.keys(players).forEach(playerID =>{
        if (players[playerID].name == 'Bank'){
            calcCardPositions(players[playerID], stacked=false);
        }else{
            calcCardPositions(players[playerID]);
        }  
    })
    

    handOutDeckCards(nonBankPlayers, timing);
    setTimeout(()=>{
        handOutDeckCards(bankPlayer, timing);
    },(cardsInGame + 1) * timing);
}


////////////////////////// GAME SUPPORT //////////////////////////////////

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
}

function flipAllCards(){
    Object.entries(players).forEach(([k,v])=>{
        const location = players[k].location;
        if (location != 'south' && location != 'center'){
        
            let matrixFlipped = []

            if(location == 'west'){
                matrixFlipped = matrix90;
            }

            if(location == 'north'){
                matrixFlipped = matrix180;
            }

            if(location == 'east'){
                matrixFlipped = matrix270;
            }

            const cardsInHand = players[k]['cards-in-hand']
            const cardIDS = Object.keys(cardsInHand);
            calcCardPositions(players[k], stacked=false);
            
            cardIDS.forEach(cardID => {
                const cardElem = cardsDB[cardID].elem;
                const position = cardsInHand[cardID];

                // cardElem.style.transform = `matrix3d(
                //     ${matrixFlipped[0]},
                //     ${matrixFlipped[1]},
                //     ${matrixFlipped[2]},
                //     0,
                //     ${matrixFlipped[3]},
                //     ${matrixFlipped[4]},
                //     0,
                //     0,
                //     ${matrixFlipped[5]},
                //     0,
                //     ${matrixFlipped[6]},
                //     0,
                //     ${position.x},
                //     ${position.y},
                //     0,
                //     1
                //     )`;

                // Scaling to keep imgaes crisp //
                cardElem.style = `transform: matrix3d(
                    ${matrixFlipped[0]},
                    ${matrixFlipped[1]},
                    ${matrixFlipped[2]},
                    0,
                    ${matrixFlipped[3]},
                    ${matrixFlipped[4]},
                    0,
                    0,
                    ${matrixFlipped[5]},
                    0,
                    ${matrixFlipped[6]},
                    0,
                    ${position.x},
                    ${position.y},
                    0,
                    1.001
                    ); width: ${cardDimensions.width}px; height: ${cardDimensions.height}px;`;
            })
        }
        if (location == 'south'){
            calcCardPositions(players[k], stacked=false);
            repositionCards([k]);
        }
    })
}

function enableDisablePlayHoldBtn(elem, state){
    const triggerCondition = elem.getAttribute('class').split(' '); // 'hidden' 'visible'

    if (!triggerCondition.includes(state)){
        if (state == 'hidden'){
            removeClassFromElement(elem, 'visible');
            addClassToElement(elem, 'hidden');
        }
        if (state == 'visible'){
            removeClassFromElement(elem, 'hidden');
            addClassToElement(elem, 'visible');
        }
    } 
}


// Function only used in addDeckCardsToPlayers() //
function addCardToCardDB(cardID, cardElem){
    // let splitID = cardID.split('-');
    let splitID = cardID.split('_');
    let cardSymbol = splitID[0];
    let cardIcon = splitID[1];
    let cardValue = Number(cardIcon);

    // charValues is a Global Variable //
    if (!cardValue){
        cardValue = charValues[cardIcon];
    }
    
    cardsDB[cardID] = {'elem': cardElem, 'picked':false, 'access':false, 'value':cardValue,'symbol':cardSymbol, 'icon':cardIcon, 'location':''};
}


function findCardID(cardElem){
    const returnID = Object.keys(cardsDB).filter(cardID => cardsDB[cardID].elem == cardElem)[0];   
    return returnID;
}


function filterPlayers(field, valuesArr, filterOut=true){
    const fieldValue = field.toLowerCase();

    if (fieldValue == 'key'){
        if (filterOut){
            return Object.fromEntries(Object.entries(players).filter(([k,v]) => !valuesArr.includes(k)));
        }
        else{
            return Object.fromEntries(Object.entries(players).filter(([k,v]) => valuesArr.includes(k)));
        }
    }
    
    if (filterOut){
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => !valuesArr.includes(v[fieldValue])));
    } else {
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => valuesArr.includes(v[fieldValue])));
    }
}

function createRandomDeckValues(numCards, minValue='2', maxValue='ace'){
// function createRandomDeckValues(numCards, minValue='2', maxValue='A'){
    // const cardValues = ['2','3','4','5','6','7','8','9','10','J', 'Q', 'K', 'A'];
    // const cardSymbols = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    const cardValues = ['2','3','4','5','6','7','8','9','10','jack', 'queen', 'king', 'ace'];
    const cardSymbols = ['club', 'diamond', 'heart', 'spade'];

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
            // cardsInGame.push(`${symbol}-${value}`);
            cardsInGame.push(`${symbol}_${value}`);
        })
    })

    // Randomize cards //
    for (let i= 0; i < numCards; i++){
        let pickIndex = Math.floor(Math.random() * (cardsInGame.length));
        cardsInDeck.push(cardsInGame[pickIndex]);
        // Adjust length cardsInGame //
        cardsInGame.splice(pickIndex, 1);
    }

    return cardsInDeck;
}


function repositionCards(playersID){
    let zIndex = 1;

    playersID.forEach(id => {
        const orientation = players[id].orientation;
        const cardsID = Object.keys(players[id]['cards-in-hand'])

        cardsID.forEach(cardID =>{
            const cardElem = cardsDB[cardID].elem;
            const cardPos = players[id]['cards-in-hand'][cardID];
            // cardElem.style = `transform: matrix3d(
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
            //     ${cardPos.x},
            //     ${cardPos.y},
            //     0,
            //     1
            //     ); z-index: ${zIndex};`;

            // Scaling to keep images crisp //
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
                1.001
                ); width: ${cardDimensions.width}px; height: ${cardDimensions.height}px; z-index: ${zIndex};`;
            
            zIndex += 1;
        });
    })
}

function calcCardPositions(player, stacked=true){
    let cardsInHand = player['cards-in-hand'];
    let widthHand = 0;
    let cardOffSet = 0;

    if (stacked){
        // handWidth = cardWidth + ((Object.keys(cardsInHand).length -1) * stackOffset);
        // cardOffSet = stackOffset;

        // widthHand = cardDimensions.width + ((Object.keys(cardsInHand).length -1) * offset.stacked);
        widthHand = handWidth.stacked;
        cardOffSet = offset.stacked;
    }
    else{
        // widthHand = cardWidth * Object.keys(cardsInHand).length;
        widthHand = handWidth.unstacked;
        cardOffSet = cardDimensions.width;
    }
    
    // let emptySpace = (fieldSize - handWidth) / 2;
    let emptySpaceX = ((cssViewPort.width * viewPortDimension.width) - widthHand) / 2;
    let emptySpaceY = ((cssViewPort.height * viewPortDimension.height) - widthHand) / 2 - offset.stacked;
    
    // Added width and height to cardElem, requires new calculations (Ireeregular behaviour)//
    // let emptySpaceY = ((cssViewPort.height * viewPortDimension.height) - widthHand) / 2;

    if (player.location == 'south'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].y = zonesPos.south;
            player['cards-in-hand'][cardId].x = emptySpaceX + (index * cardOffSet);
        })
    }

    if (player.location == 'west'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].x = zonesPos.west;
            player['cards-in-hand'][cardId].y = emptySpaceY + (index * cardOffSet);
            // Added width and height to cardElem, requires new calculations (irregular behaviour)//
            // player['cards-in-hand'][cardId].y = emptySpaceY + (index * cardOffSet) + cardDimensions.width;
        })

    }

    if (player.location == 'north'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].y = zonesPos.north;
            player['cards-in-hand'][cardId].x = emptySpaceX + (index * cardOffSet);
        })

    }
    if (player.location == 'east'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].x = zonesPos.east;
            player['cards-in-hand'][cardId].y = emptySpaceY + (index * cardOffSet);
        })

    }

    if (player.location == 'center'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].x = emptySpaceX + (index * cardOffSet);
            player['cards-in-hand'][cardId].y = deckPos.y;
        })

    }
}

// function calcCardPositions(player, stacked=true){
//     let cardsInHand = player['cards-in-hand'];
//     let handWidth = 0;
//     let cardOffSet = 0;

//     if (stacked){
//         // handWidth = cardWidth + ((Object.keys(cardsInHand).length -1) * stackOffset);
//         // cardOffSet = stackOffset;

//         // handWidth = cardDimensions.width + ((Object.keys(cardsInHand).length -1) * offset.stacked);
//         cardOffSet = offset.stacked;
//     }
//     else{
//         handWidth = cardWidth * Object.keys(cardsInHand).length;
//         cardOffSet = cardWidth;
//     }
    
//     // let emptySpace = (fieldSize - handWidth) / 2;
//     let emptySpaceX = ((cssViewWidth * viewPortDimension.width) - handWidth) / 2;
//     let emptySpaceY = ((cssViewHeight * viewPortDimension.height) - handWidth) / 2 - stackOffset;

//     if (player.location == 'south'){
//         Object.keys(cardsInHand).forEach((cardId, index) => {
//             player['cards-in-hand'][cardId].y = southTop;
//             player['cards-in-hand'][cardId].x = emptySpaceX + (index * cardOffSet);
//         })
//     }

//     if (player.location == 'west'){
//         Object.keys(cardsInHand).forEach((cardId, index) => {
//             player['cards-in-hand'][cardId].x = westTop;
//             player['cards-in-hand'][cardId].y = emptySpaceY + (index * cardOffSet);
//         })

//     }

//     if (player.location == 'north'){
//         Object.keys(cardsInHand).forEach((cardId, index) => {
//             player['cards-in-hand'][cardId].y = northTop;
//             player['cards-in-hand'][cardId].x = emptySpaceX + (index * cardOffSet);
//         })

//     }
//     if (player.location == 'east'){
//         Object.keys(cardsInHand).forEach((cardId, index) => {
//             player['cards-in-hand'][cardId].x = eastTop;
//             player['cards-in-hand'][cardId].y = emptySpaceY + (index * cardOffSet);
//         })

//     }

//     if (player.location == 'center'){
//         Object.keys(cardsInHand).forEach((cardId, index) => {
//             player['cards-in-hand'][cardId].x = emptySpaceX + (index * cardOffSet);
//             player['cards-in-hand'][cardId].y = deckPos.y;
//         })

//     }
// }

/////////////////////////////// ELEMENTS /////////////////////////////////

function displayPlayerEntry(){
    const playerDisplay = createElem('div', ['player-display'], 'player-entry');
    
    const playerLabel = createElem('div', ['player-label', 'full-width'], 'input-label');
    const playerLabelText = document.createTextNode('Enter Your Name');
    addChildElement(playerLabel, playerLabelText);
    
    const playerName = createElem('input', ['player-name', 'full-width'], 'player-name');
    playerName.type = 'text';
    playerName.placeholder = 'Player Name';

    const startGameBtn = createElem('div', ['game-btn'], 'start-game-btn');
    startGameBtn.addEventListener('click', ()=>{
        loadGame();
        });

    const startGameTextElem = createElem('div');
    const startGameText = document.createTextNode('Start Game');
    addChildElement(startGameTextElem, startGameText);
    addChildElement(startGameBtn, startGameTextElem);

    addChildElement(playerDisplay, playerLabel);
    addChildElement(playerDisplay, playerName);
    addChildElement(playerDisplay, startGameBtn);

    addChildElement(backgroundElem, playerDisplay);
}


function displayGameResults(name, score){
    const winnerDisplay = createElem('div', ['player-display'], 'winner-display');
    
    const winnerLabel = createElem('div', ['player-label', 'full-width'], 'winner-label');
    const winnerLabelText = document.createTextNode('The Winner !');
    addChildElement(winnerLabel, winnerLabelText);
    
    const winnerName = createElem('input', ['player-name', 'full-width'], 'winner-name');
    winnerName.type = 'text';
    
    winnerName.value = `${name} with a score of: ${score}`;
    winnerName.readonly = 'true';

    const restartGameBtn = createElem('div', ['game-btn'], 're-start-game-btn');
    
    restartGameBtn.addEventListener('click', ()=>{
        resetGame();
        });

    const newGameTextElem = createElem('div');
    const newGameText = document.createTextNode('New Game');
    addChildElement(newGameTextElem, newGameText);
    addChildElement(restartGameBtn, newGameTextElem);

    addChildElement(winnerDisplay, winnerLabel);
    addChildElement(winnerDisplay, winnerName);
    addChildElement(winnerDisplay, restartGameBtn);

    addChildElement(backgroundElem, winnerDisplay);
}


function createHoldCardsBtn(x,y){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'hold-cards-btn');
    // btnElem.style = `width: ${btnWidth}px; transform: translate(${x}px,${y}px);`;
    btnElem.style = `width: ${btnDimensions.width}px; transform: translate(${x}px,${y}px);`;
    const btnText = document.createTextNode('Hold');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    playerHoldEvent(btnElem);

    return btnElem;
}


function createPlayCardsBtn(x,y){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'play-cards-btn');
    // btnElem.style = `width: ${btnWidth}px; transform: translate(${x}px,${y}px);`;
    btnElem.style = `width: ${btnDimensions.width}px; transform: translate(${x}px,${y}px);`;
    const btnText = document.createTextNode('Play Cards');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    playCardsEvent(btnElem);

    return btnElem;
}


function createSwapBankBtn(x,y){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'swap-bank-btn');
    // btnElem.style = `width: ${btnWidth}px; transform: translate(${x}px,${y}px);`;
    btnElem.style = `width: ${btnDimensions.width}px; transform: translate(${x}px,${y}px);`;
    const btnText = document.createTextNode('Swap Bank');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    swapBankEvent(btnElem, true);
    
    return btnElem;
}


// function introSwapBankBtn(){
//     const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'swap-bank-btn')
//     const btnText = document.createTextNode('Swap Bank');
//     addChildElement(btnElem, btnText);
//     addChildElement(playFieldElem, btnElem);
//     swapBankEvent(btnElem, false);
    
//     return btnElem;
// }


function createElem(elemType, classNames=[], idName){
    const elem = document.createElement(elemType);

    for (let className of classNames){
        addClassToElement(elem, className);
    }
    
    addIdToElement(elem, idName);

    return elem;
}


function createDeckElements(){
    const deckElems = [];
    for (let i = 0; i < cardsInGame; i++){
        const cardElem = createCard();

        // cardElem.style.transform = `matrix3d(
        //     ${matrix0Flipped[0]},
        //     ${matrix0Flipped[1]},
        //     ${matrix0Flipped[2]},
        //     0,
        //     ${matrix0Flipped[3]},
        //     ${matrix0Flipped[4]},
        //     0,
        //     0,
        //     ${matrix0Flipped[5]},
        //     0,
        //     ${matrix0Flipped[6]},
        //     0,
        //     ${deckPos.x},
        //     ${deckPos.y},
        //     0,
        //     1
        //     )`; 

        // Scaling to keep images crisp //
        cardElem.style = `transform: matrix3d(
            ${matrix0Flipped[0]},
            ${matrix0Flipped[1]},
            ${matrix0Flipped[2]},
            0,
            ${matrix0Flipped[3]},
            ${matrix0Flipped[4]},
            0,
            0,
            ${matrix0Flipped[5]},
            0,
            ${matrix0Flipped[6]},
            0,
            ${deckPos.x},
            ${deckPos.y},
            0,
            1.001
            ); width: ${cardDimensions.width}px; heightpx: ${cardDimensions.height};`; 
        
        // add hover mouse event //
        mouseOverEvent(cardElem);
        // add click card event //
        cardClickEvent(cardElem);

        // playFieldElem = Global Variable
        addChildElement(playFieldElem, cardElem);
        deckElems.push(cardElem);
    }
    return deckElems;
}


function createCard(){
    const cardElem = createElement('div');
    addClassToElement(cardElem, 'card');

    const frontElem = createElement('div');
    addClassToElement(frontElem, 'front');
    const frontImg = createElement('img');

    const backElem = createElement('div');
    addClassToElement(backElem, 'back');
    const backImg = createElement('img');

    addChildElement(frontElem,frontImg);
    addChildElement(backElem, backImg);
    addChildElement(cardElem, frontElem);
    addChildElement(cardElem, backElem);

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

//////////////////////////// EVENTS //////////////////////////////////

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


function cardClickEvent(elem){
    elem.addEventListener('click', (event)=>{
        // const cardID = findCardID(event.target.parentElement);
        const cardID = findCardID(event.target.parentElement.parentElement);
    
        if (cardsDB[cardID].access && players[0].active){
            // pickCardEffect(event.target.parentElement);
            pickCardEffect(event.target.parentElement.parentElement);
        }

        if (cardPickedBank.length == 1 && cardPickedPlayer.length == 1){
            enableDisablePlayHoldBtn(holdCardsBtn, 'hidden');
            enableDisablePlayHoldBtn(playCardsBtn, 'visible');
        }else{
            enableDisablePlayHoldBtn(playCardsBtn, 'hidden');
            enableDisablePlayHoldBtn(holdCardsBtn, 'visible');
        }
    })
}

function playCardsEvent(elem){
    elem.addEventListener('click',()=> playCards());
}


function playerHoldEvent(elem){
    elem.addEventListener('click',()=> playerHold());
}


function swapBankEvent(elem, pass){
    elem.addEventListener('click',()=> swapBank(pass));
}


function pickCardEffect(pickedElem){
    const cardID = findCardID(pickedElem);
    const location = cardsDB[cardID].location;
    let pickCardArray = [];

    // cardPickedBank and cardPickedPlayer are global variable //
    if (location == 'center'){
        pickCardArray =  cardPickedBank;
    }

    if (location == 'south'){
        pickCardArray = cardPickedPlayer;
    }

    if (pickCardArray.length == 0){
        pickCardArray.push(cardID);
        cardsDB[cardID].picked = true;
    }else{
        if (cardID == pickCardArray[0]){
            const unPickSameID = pickCardArray.pop();
            cardsDB[unPickSameID].picked = false;
        }else{
            const unPickCardID = pickCardArray.pop();
            cardsDB[unPickCardID].picked = false;
            pickCardArray.push(cardID);
            cardsDB[cardID].picked = true;
            mouseLeaveEffect(cardsDB[unPickCardID].elem);
        }
    }             
}


function cardHoverEffect(hoverElem, reverse=false){
    let matrixStr = ''
    let targetStyle = hoverElem.getAttribute('style').split(/\s/);
    targetStyle = targetStyle.map(item => item.replace(',',''));
    const transform = targetStyle[0];
    // const matrix3D = targetStyle.slice(1, targetStyle.length-2);
    const matrix3D = targetStyle.slice(1, targetStyle.length-6);
    // const zIndex = targetStyle.slice(targetStyle.length -2);
    const trailing = targetStyle.slice(targetStyle.length -6);
    // console.log(targetStyle);
    // hoverOffset is a global variable //
    // let hoverX = hoverOffsetX;
    // let hoverY = hoverOffsetY;

    let hoverX = offset.hoverx;
    let hoverY = offset.hovery;

    if (reverse){
        hoverX = -1 * hoverX;
        hoverY = -1 * hoverY;
    }

    matrix3D[12] = Number(matrix3D[12]) - hoverX;
    matrix3D[13] = Number(matrix3D[13]) - hoverY;

    // matrixStr = `${transform} ${matrix3D.toString()} ${zIndex.toString().replace(',', '')}}`;
    matrixStr = `${transform} ${matrix3D.toString()} ${trailing.toString().replace(/,/g, ' ')}}`;
    // console.log(trailing.toString().replace(/,/g, ' '));
    // console.log(matrixStr);
    
    return matrixStr;
}

// Card Pick Should leave card in Hover UP state //
function mouseLeaveEffect(elem){
    const hoverDown = new Event("mouseleave");
    elem.dispatchEvent(hoverDown);
}


///////////////////////// CREATE START POINT ////////////////////////////////
displayPlayerEntry();