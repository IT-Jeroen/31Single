// https://ramlmn.github.io/visualizing-matrix3d/
// https://meyerweb.com/eric/tools/matrix/

/////////////////////////////////////// VARIABLES ///////////////////////////////////////////////

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
const players = {
    0: {"name":'Local Player', "location": 'south', 'cards-in-hand':{}, 'last-dropped-cards': [],'wins': 0, 'loses': 0, 'orientation': matrix0, 'pass': false, 'active':false, 'auto':false},
    1: {"name":'Player West', "location": 'west', 'cards-in-hand':{}, 'last-dropped-cards': [], 'wins': 0, 'loses': 0, 'orientation': matrix90Flipped, 'pass': false, 'active':false, 'auto':true},
    2: {"name":'Player North', "location": 'north', 'cards-in-hand':{}, 'last-dropped-cards': [], 'wins': 0, 'loses': 0, 'orientation': matrix180Flipped, 'pass': false, 'active':false, 'auto':true},
    3: {"name":'Player East', "location": 'east', 'cards-in-hand':{}, 'last-dropped-cards': [], 'wins': 0, 'loses': 0, 'orientation': matrix270Flipped, 'pass': false, 'active':false, 'auto':true},
    4: {"name":'Bank', "location": 'center', 'cards-in-hand':{}, 'last-dropped-cards': [], 'wins': 0, 'loses': 0, 'orientation': matrix0, 'pass': true, 'active':false, 'auto':false},
}

// const charValues = {'A':11, 'K':10, 'Q':10, 'J': 10};
const charValues = {'ace':11, 'king':10, 'queen':10, 'jack': 10};
// Card in CardsDB = "Clubs-8": Object { elem: div.card, picked:false, access:true, value:8, symbol:'Clubs', icon:'8'} //
const cardsDB = {}; 
const numPlayersCards = 3;
const cardsInGame = (Object.keys(players).length) * numPlayersCards;

const backgroundElem = document.getElementById('background');
const playFieldElem = document.getElementById('playfield');
let playCardsBtn = document.getElementById('play-cards-btn');
let holdCardsBtn = document.getElementById('hold-cards-btn');
let swapBankBtn = document.getElementById('swap-bank-btn');

const viewPortDimension = {'width': window.innerWidth, 'height': window.innerHeight};
const viewPortScale = {'scale': 1, 'x': 1, 'y': 1};

const imageDimensions = {'width': 169, 'height': 244};
const cssViewPort = {'width': 0.98, 'height': 0.98};
const buttonSpecs = {'width': 250, 'height': null, 'font': 1.5, 'padding': 1};

const winnerBadge = {'width': 160 * viewPortScale.scale, 'height': 160 * viewPortScale.scale, 'line': 160 * viewPortScale.scale, 'font': 500 * viewPortScale.scale,'border': 5};
const infoDisplay = {'width': (viewPortDimension.width * 0.6) * viewPortScale.scale, 'height': (viewPortDimension.height / 5) * viewPortScale.scale, 'padding': 20 * viewPortScale.scale, 'font': 1.5 * viewPortScale.scale,'border': 5};
const displayPos = {'x': (viewPortDimension.width * 0.5) - (infoDisplay.width * 0.5) - infoDisplay.border, 'y': (viewPortDimension.height * 0.5) - (infoDisplay.height * 0.5)};
const cardDimensions = {'width': imageDimensions.width * viewPortScale.scale, 'height': imageDimensions.height * viewPortScale.scale};
const offset = {'stacked':40 * viewPortScale.scale, 'hoverx':5, 'hovery':40 * viewPortScale.scale};
const handWidth = {'stacked': (cardDimensions.width + ((numPlayersCards -1) * offset.stacked)), 'unstacked': (numPlayersCards * cardDimensions.width)};
const btnDimensions = {'width': buttonSpecs.width * viewPortScale.scale, 'height': null, 'font': buttonSpecs.font * viewPortScale.scale, 'padding': buttonSpecs.padding * viewPortScale.scale};
const centerPos = {'x': (cssViewPort.width * viewPortDimension.width) / 2,'y': (cssViewPort.height * viewPortDimension.height) / 2};
const deckPos = {'x': centerPos.x - (cardDimensions.width / 2), 'y': centerPos.y - (cardDimensions.height /2)};
const minViewPortDimensions = {'width': ((numPlayersCards -1) * cardDimensions.height) + (numPlayersCards * cardDimensions.width) + 80, 'height': (3 * cardDimensions.height) + 80};
const zonesPos = {
    'south': (cssViewPort.height * viewPortDimension.height) - cardDimensions.height,
    'west': (cardDimensions.height - cardDimensions.width) /2,
    'north': 0,
    'east': (cssViewPort.height * viewPortDimension.width - cardDimensions.height + ((cardDimensions.height - cardDimensions.width) /2))
}

const cardPickedBank = [];
const cardPickedPlayer = [];
const minBankScore = 28;
const winner = {'name':'None'};
let intro = true;


function calculateVariables(){
    viewPortScale.scale = 1;
    viewPortDimension.width = window.innerWidth;
    viewPortDimension.height = window.innerHeight;
    
    const widthScale  = viewPortDimension.width / minViewPortDimensions.width;
    const heightScale = viewPortDimension.height / minViewPortDimensions.height;

    viewPortScale.x = widthScale;
    viewPortScale.y = heightScale;
 
    if (heightScale < 1 || widthScale < 1){
        if (heightScale < widthScale){
            viewPortScale.scale = heightScale;
            viewPortScale.x = widthScale;
            viewPortScale.y = heightScale;
        }else{
            viewPortScale.scale = widthScale;
            viewPortScale.x = widthScale;
            viewPortScale.y = heightScale;
        }
    }


    cardDimensions.width = imageDimensions.width * viewPortScale.scale;
    cardDimensions.height = imageDimensions.height * viewPortScale.scale
    offset.stacked = 40 * viewPortScale.scale;
    offset.hovery = 40 * viewPortScale.scale

    handWidth.stacked = (cardDimensions.width + ((numPlayersCards -1) * offset.stacked));
    handWidth.unstacked = (numPlayersCards * cardDimensions.width)



    if (viewPortScale.scale <= 0.45){
        let fontScale = 0.7;
        btnDimensions.width = 100;
        btnDimensions.font = btnDimensions.font *  fontScale;
        btnDimensions.padding = btnDimensions.padding * fontScale;
    }else{
        let fontScale = (viewPortScale.scale * 0.55) + (0.45);
        btnDimensions.width = btnDimensions.width * viewPortScale.scale;
        btnDimensions.font = btnDimensions.font *  fontScale;
        btnDimensions.padding = btnDimensions.padding * fontScale;
    }


    infoDisplay.width = (viewPortDimension.width * 0.6);
    infoDisplay.height = (viewPortDimension.height / 5);


    displayPos.x = (viewPortDimension.width * 0.5) - (infoDisplay.width * 0.5) - infoDisplay.padding - infoDisplay.border;
    displayPos.y = (viewPortDimension.height * 0.5) - (infoDisplay.height * 0.5) - infoDisplay.padding - infoDisplay.border;

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
    // Recalculated variables when newgame() //
    calculateVariables();

    intro = true;
    const playerName = document.getElementById('player-name');
    const playerEntry = document.getElementById('player-entry');

    // Display Elements //
    setTimeout(()=>{
        if (playerEntry){
            players[0].name = playerName.value;
            players[0].auto = false;
            playerEntry.remove();
        }   
    }, 500);

    // playCardsBtn = createPlayCardsBtn(((cssViewPort.width * viewPortDimension.width) / 2 - (handWidth.stacked * 2)), zonesPos.south + 0.5 * cardDimensions.height);
    // holdCardsBtn = createHoldCardsBtn(((cssViewPort.width * viewPortDimension.width) / 2 - (handWidth.stacked * 2)), zonesPos.south + 0.5 * cardDimensions.height);
    // swapBankBtn = createSwapBankBtn(((cssViewPort.width * viewPortDimension.width) / 2 + handWidth.stacked), zonesPos.south + 0.5 * cardDimensions.height);

    playCardsBtn = createPlayCardsBtn(((cssViewPort.width * viewPortDimension.width) / 2 - (handWidth.stacked / 2) - btnDimensions.width - 20), zonesPos.south + 0.5 * cardDimensions.height);
    holdCardsBtn = createHoldCardsBtn(((cssViewPort.width * viewPortDimension.width) / 2 - (handWidth.stacked / 2) - btnDimensions.width - 20), zonesPos.south + 0.5 * cardDimensions.height);
    swapBankBtn = createSwapBankBtn(((cssViewPort.width * viewPortDimension.width) / 2 + (handWidth.stacked / 2) + 20), zonesPos.south + 0.5 * cardDimensions.height);

    // Deal Cards //
    setTimeout(()=>{
        
        dealDeckCards(300);
    }, 1000);

    // only after cards are dealt 
    setTimeout(()=>{
        players[0].active = true;
        enableDisablePlayHoldBtn(holdCardsBtn, 'visible');
        enableDisablePlayHoldBtn(swapBankBtn, 'visible');
    }, 8000);  
}


// function activateCards(player){
//     const cardsInHand = Object.keys(player['cards-in-hand'])
//     cardsInHand.forEach(cardID => {
//         cardsDB[cardID].access = true;
//     });
// }


// function resetHoverEffect(){
//     Object.keys(players).forEach(id =>{
//         if (!players[id].auto){
//             if (players[id].name == 'Bank'){
//                 calcCardPositions(players[id]['cards-in-hand'], false);
//             }
//         }else{
//             calcCardPositions(players[id]['cards-in-hand']);
//         }
        
//     })
// }

function resetGame(){
    // Reset Winner //
    winner.name = 'None';
    // Reset Intro //
    intro = true;
    // Clear pickedCards Save fail//
    cardPickedBank.pop();
    cardPickedPlayer.pop();
    // Remove Winner Display //
    document.getElementById('winner-display').remove();
    // Remove Buttons //
    // document.getElementById('hold-cards-btn').remove();
    // document.getElementById('swap-bank-btn').remove();
    // document.getElementById('play-cards-btn').remove();
    // Remove All Cards From Play Field //
    document.querySelectorAll('.card').forEach(card => card.remove());
    // Remove Winner Badge //
    const removeBadge = document.getElementById('winner-badge');
    if (removeBadge){
        removeBadge.remove();
    }

    Object.values(players).forEach((player)=>{
        
        if (player.name == 'Bank'){
            player.pass = true;
            player.active = false;
            player['cards-in-hand'] = {};
        }else{
            player.pass = false;
            player.active = false;
            player['cards-in-hand'] = {};
        }
    });

    // Reset cardsDB //
    Object.keys(cardsDB).forEach(cardID =>{
        delete cardsDB[cardID];
    })

    btnDimensions.width = buttonSpecs.width * viewPortScale.scale;
    btnDimensions.height = null;
    btnDimensions.font = buttonSpecs.font * viewPortScale.scale;
    btnDimensions.padding = buttonSpecs.padding * viewPortScale.scale;

    loadGame();

}


function gameContinues(){
    const nonPassPlayers = filterPlayers('pass', [false], false);

    if(JSON.stringify(nonPassPlayers) === '{}'){
        return false;
    }
    return true;
}


function holdVisual(cardsInHand){
    Object.keys(cardsInHand).forEach((cardID)=>{
        addClassToElement(cardsDB[cardID].elem, 'hold')
    })
}


function activeVisual(cardsInHand, active){
    Object.keys(cardsInHand).forEach((cardID)=>{
        if (active){
            
            addClassToElement(cardsDB[cardID].elem, 'active');
        }
        if (!active){
            removeClassFromElement(cardsDB[cardID].elem, 'active');
        }
    });
}



function displayWinnerBadge(player){
    const badgeElem = createWinnerBadgeElem();
    const badgePos = calcWinnerBadgePos(player)
    badgeElem.style = `width: ${winnerBadge.width}px; height: ${winnerBadge.height}px; line-height:${winnerBadge.line}px; font-size: ${winnerBadge.font}%; transform: translate(${badgePos[0]}px,${badgePos[1]}px);` 
}


function nextPlayer(){
    ///
    const previousPlayer = Object.values(filterPlayers('active', [true], false))[0];
    activeVisual(previousPlayer['cards-in-hand'], false);

    if (intro){
        intro = false;
    }

    const score = calculateHand(previousPlayer['cards-in-hand']);
    console.log(previousPlayer.name,score);
    if (score == 31){
        if (winner.name == 'None'){
            winner.name = previousPlayer.name;
            displayWinnerBadge(previousPlayer);
        }
    }

    // Set all previous players to pass when a winner is found //
    if(winner.name != 'None'){
        previousPlayer.pass = true;
    }

    activateDeactivatePlayer();
    const activePlayer = Object.values(filterPlayers('active', [true], false))[0];
    
    if (!activePlayer.pass){
            if (activePlayer.auto){
            activeVisual(activePlayer['cards-in-hand'], true);

            const bank = Object.values(filterPlayers('name', ['Bank'], false))[0];
            const autoPlayerCardsInHand = activePlayer['cards-in-hand'];
            const cardsInBank = bank['cards-in-hand'];
            const autoPickedCards = autoPickACard(autoPlayerCardsInHand, cardsInBank);
            const autoPickedBankCard = infiniteLoopCheck(activePlayer, autoPickedCards[0]);
            const autoPickedPlayerCard = autoPickedCards[1];

            if (Object.keys(filterPlayers('pass', [true], false)).length > 3){
                activePlayer.pass = true;
            }

            if (autoPickedBankCard != 'Take Bank' && autoPickedBankCard != 'Player Pass'){
                swapCards(autoPickedBankCard,autoPickedPlayerCard);
                setTimeout(()=>{
                    nextPlayer();
                     
                 }, 2000);
            }else{
                if (autoPickedBankCard == 'Take Bank'){
                    swapBank();
                    setTimeout(()=>{
                        nextPlayer();
                         
                     }, 2000);
                }
                if (autoPickedBankCard == 'Player Pass'){
                    playerHold();
                    setTimeout(()=>{
                        nextPlayer();
                         
                     }, 500);
                }
            }


        } else{
            enableDisablePlayHoldBtn(holdCardsBtn, 'visible');
            enableDisablePlayHoldBtn(swapBankBtn, 'visible');
        }

    // IF PLAYER PASS //   
    }else{
        if(gameContinues()){
            nextPlayer();
        }else{
            stopGame();
        }
    }
    
}


// Manual Break nextPLayer Loop //
function stopLoop(){
    Object.values(players).forEach((player)=>{
        player.pass = true;
    })
}

function infiniteLoopCheck(player, pickedCard){

    if(player['last-dropped-cards'].some(cardID => cardID == pickedCard)){
        console.log("INFINITE LOOP STOP", player.name);
        return 'Player Pass';
    }

    player['last-dropped-cards'].push(pickedCard);

    // Still an infinite loop in a cycle of 3 cards//
    // if (player['last-dropped-cards'].length == 3){
    //     player['last-dropped-cards'].shift()
    // }

    if (player['last-dropped-cards'].length == 4){
        player['last-dropped-cards'].shift()
    }

    return pickedCard;

}

function winnersAndLosers(){
    let topScore = 0;
    let lowestScore = 30.5;
    let loserNames = [];
    let winnerNames = [];

    Object.values(players).forEach((player)=>{
        if (player.name != 'Bank'){
            const playerScore = calculateHand(player['cards-in-hand']);
            // console.log(players[k].name, playerScore);
            if (playerScore == topScore){
                winnerNames.push(player.name);
            }
            if (playerScore > topScore){
                winnerNames = [player.name]
                topScore = playerScore;
                
            }
            if (playerScore == lowestScore){
                loserNames.push(player.name);
            }
            if(playerScore < lowestScore){
                loserNames = [player.name];
                lowestScore = playerScore;
            }
        }
    })

    if (winner.name != 'None'){
        winnerNames = [winner.name]
        topScore = 31
    }

    return {'winners': winnerNames, 'top-score': topScore, 'losers': loserNames, 'lowest-score': lowestScore}
}

function stopGame(){
    const gameResult = winnersAndLosers();
    displayGameResults(gameResult.winners, gameResult["top-score"]);
    // show all cards //
    flipAllCards();
}


function playerAction(action){
    let timing = 0;

    if (action == 'playCards'){
        playCards();
        timing = 2000;
    }
    if (action == 'playerHold'){
        playerHold();
        timing = 250;
    }
    if (action == 'swapBank'){
        swapBank();
        timing = 2000;
    }
    setTimeout(()=>{
            nextPlayer(); 
    },timing); 
}


function playCards(){
    if (cardPickedBank.length == 1 && cardPickedPlayer.length == 1){
        console.log('LOCAL PLAYER Picked Bank:',cardPickedBank[0], 'Picked Hand:', cardPickedPlayer[0])
        swapCards(cardPickedBank[0], cardPickedPlayer[0]);
        enableDisablePlayHoldBtn(playCardsBtn, 'hidden');
        enableDisablePlayHoldBtn(swapBankBtn, 'hidden');
    }
}


function playerHold(){
    const activePlayer = Object.values(filterPlayers('active', [true], false))[0];
    activePlayer.pass = true;
    holdVisual(activePlayer['cards-in-hand']);
    console.log('PLAYER PASS:', activePlayer.name);

    if (!activePlayer.auto){
        enableDisablePlayHoldBtn(holdCardsBtn, 'hidden');
        enableDisablePlayHoldBtn(swapBankBtn, 'hidden');
    }  
}


// Swap Hand with Bank //
function swapBank(){
    const bank = Object.values(filterPlayers('name', ['Bank'], false))[0];
    const player = Object.values(filterPlayers('active', [true], false))[0];
    const playerHand = Object.keys(player['cards-in-hand']);
    const bankHand = Object.keys(bank['cards-in-hand']);

    // console.log('SWAP BANK:', player.name);

    playerHand.forEach((cardID, index)=>{
        swapCards(bankHand[index], cardID);
    })

    if (!intro){
        player.pass = true;
    }

    enableDisablePlayHoldBtn(swapBankBtn, 'hidden');
    enableDisablePlayHoldBtn(holdCardsBtn, 'hidden');
}


function swapCards(bankCardID,playerCardID){
    const timingRepos = 700;
    const timingCalc = 500;

    const playerLocation = cardsDB[playerCardID].location;
    const player = Object.values(filterPlayers('location', playerLocation, filterOut=false))[0];

    // const bankID = 4; //
    const bankLocation = cardsDB[bankCardID].location;
    const bank = Object.values(filterPlayers('location', bankLocation, filterOut=false))[0];
    // const bankID = Object.keys(bank)[0];

    // ADD CARD//
    player['cards-in-hand'][bankCardID] = bank['cards-in-hand'][bankCardID];
    bank['cards-in-hand'][playerCardID] = player['cards-in-hand'][playerCardID];

    // REMOVE CARD //
    delete player['cards-in-hand'][playerCardID]
    delete bank['cards-in-hand'][bankCardID];

    // SET CARD ACCESS //
    cardsDB[playerCardID].access = true;
    cardsDB[bankCardID].access = false;

    if(playerLocation == 'south'){
        cardsDB[bankCardID].access = true;
    }

    // RESET //
    cardsDB[bankCardID].location = playerLocation;
    cardsDB[playerCardID].location = bankLocation;
    cardsDB[playerCardID].picked = false;
    cardsDB[bankCardID].picked = false;
    cardPickedBank.pop();
    cardPickedPlayer.pop();

    setTimeout(()=>{
        calcCardPositions(player);
        calcCardPositions(bank, stacked=false);
    },timingCalc);

    setTimeout(()=>{
        repositionCards([player, bank]);
        // RESET ACTIVE VISUAL EFFECT //
        if (player.auto){
            activeVisual(player['cards-in-hand'], true);
        }
        
        activeVisual(bank['cards-in-hand'], false);
    },timingRepos);
}


function handOutDeckCards(playersArr=[], timing=0){
    let i = 0;
    let playerIndex = 0;
    let zIndex = 1;
    let cardIndex = 0;
    let numCardsToDeal = 0;
    
    playersArr.forEach(player => {
        numCardsToDeal += Object.keys(player['cards-in-hand']).length;
    })

    const intervalID = setInterval(()=>{
        if (i == numCardsToDeal -1){
            clearInterval(intervalID);
        }
        
        let player = playersArr[playerIndex];
        const cardIds = Object.keys(player['cards-in-hand']);
        const cardID = cardIds[cardIndex];
        const card = player['cards-in-hand'][cardID];
        const orientation = player.orientation;

        const cardElem = cardsDB[cardID].elem;

        // Scaling 1.001 to keep images crisp //
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

        if (playerIndex == playersArr.length){
            cardIndex += 1;
            playerIndex = 0;
        }

        i += 1;
    }, timing);
}


function addDeckCardsToPlayers(){
    const allCardElems = createDeckElements(cardsInGame, matrix0Flipped, deckPos);
    // Create card values and id's
    const deckCardValues = createRandomDeckValues(allCardElems.length, '7');
    // let playersID = Object.keys(players)
    let playersArr = Object.values(players); 
    let playerIndex = 0;

    allCardElems.forEach((cardElem, index) =>{
        // pick a card //
        let cardID = deckCardValues[index];

        // Add Correct Card Images to image Elements //
        const frontElem = cardElem.getElementsByClassName('front');
        const frontImg = frontElem[0].children[0];
        frontImg.src = `./src/img/${cardID}.png`;
        const backElem = cardElem.getElementsByClassName('back');
        const backImg = backElem[0].children[0];
        backImg.src = './src/img/back-blue.png';
        
        // add card to DB //
        addCardToCardDB(cardID, cardElem);
        
        // add card to player hand //
        playersArr[playerIndex]['cards-in-hand'][cardID] = {'x':deckPos.x, 'y':deckPos.y};
        cardsDB[cardID].location = playersArr[playerIndex].location;
        
        if (playersArr[playerIndex].name == 'Bank' || playersArr[playerIndex].location == 'south'){
            cardsDB[cardID].access = true;
        }
        
        playerIndex += 1;

        if (playerIndex == playersArr.length){
            playerIndex = 0;
        }
    })  
}


function dealDeckCards(timing){
    const bankPlayer = Object.values(filterPlayers('name', ['Bank'], false));
    const nonBankPlayers = Object.values(filterPlayers('name', ['Bank']));
    
    addDeckCardsToPlayers(players);

    // Calculate Card Positions //
    Object.values(players).forEach(player =>{
        if (player.name == 'Bank'){
            calcCardPositions(player, stacked=false);
        }else{
            calcCardPositions(player);
        }  
    })
    

    handOutDeckCards(nonBankPlayers, timing);
    setTimeout(()=>{
        handOutDeckCards(bankPlayer, timing);
    },(cardsInGame + 1) * timing);
}


//////////////////////////// GAME LOGIC /////////////////////////////////

function checkCardSwapSum(cardsInHand, cardIn, cardOut){
    const cardIDs = Object.keys(cardsInHand);
    cardIDs.push(cardIn);
    const newcardIDs = cardIDs.filter(cardID => cardID != cardOut)
    const newCardsSwap = Object.keys(cardsInHand).filter((cardID) => newcardIDs.includes(cardID));
    newCardsSwap[cardIn] = null;
    const sum = calculateHand(newCardsSwap);
    return sum;
}



function playerPass(cardsInHand,lowerSumPassLimit){
    const handValue = calculateHand(cardsInHand);
    if (handValue > lowerSumPassLimit){
        return 'Player Pass';
    }
    return 'Keep Playing';
}

function findCardMatch(cardsInHand, cardsInBank, attr){
    const sortedCardInHandIDs = sortCardByValue(cardsInHand, true) // true returns array of cardIDs only
    let pickBankCard = 'None';
    let keepHandCard = 'None';
    let dropHandCard = 'None';
    let cardsValue = 0;

    Object.keys(cardsInHand).forEach(handCardID =>{
        Object.keys(cardsInBank).forEach(bankCardID=>{
            if (cardsDB[handCardID][attr] == cardsDB[bankCardID][attr]){
                let calcValue = cardsDB[handCardID].value + cardsDB[bankCardID].value;
                if (calcValue > cardsValue){
                    pickBankCard = bankCardID;
                    keepHandCard = handCardID;
                    cardsValue = calcValue;
                }
            }
        })
    })

    if (pickBankCard != 'None'){
        dropHandCard = sortedCardInHandIDs[2];
        if (keepHandCard == dropHandCard){
            dropHandCard = sortedCardInHandIDs[1];
        }
    }

    return [pickBankCard, dropHandCard];
}


function findCardMatch2(cardsInHand, cardsInBank, attr){
    let dropHandCard = 'None';
    let pickBankCard = 'None';
    let dropCardAttrInHand = 'None';
    let cardsValue = 0;

    const attrCount = cardAttrCount(cardsInHand, attr);
    const chaseAttr = returnAttrFromCount(attrCount, 2, 'min') 
    const dropCardAttr = returnAttrFromCount(attrCount, 1, 'max');

    if (dropCardAttr != 'None'){
        dropCardAttrInHand = findCardIdByAttr(cardsInHand, dropCardAttr, 'low');
    }

    Object.keys(cardsInBank).forEach(bankCardID =>{
        if (cardsDB[bankCardID][attr] == chaseAttr){
            let calcValue = cardsDB[bankCardID].value;
            if (calcValue > cardsValue){
                pickBankCard = bankCardID;
                dropHandCard = dropCardAttrInHand;
                cardsValue = calcValue;
            } 
        }
    })

    return [pickBankCard, dropHandCard];
}


function findCardMatch3(cardsInHand, cardsInBank, attr){
    // console.log('findCardMatch3')
    let pickBankCard = 'None';
    let dropHandCard = 'None';
    let cardsValue = 0;

    Object.keys(cardsInHand).forEach(handCardID =>{
        Object.keys(cardsInBank).forEach(bankCardID=>{
            if (cardsDB[handCardID][attr] == cardsDB[bankCardID][attr]){
                if (cardsDB[bankCardID].value > cardsDB[handCardID].value && cardsDB[bankCardID].value > cardsValue){
                    pickBankCard = bankCardID;
                    dropHandCard = handCardID;
                    cardsValue = cardsDB[bankCardID].value;
                } 
            }
        })
    })

    return [pickBankCard, dropHandCard];
}


function autoPickACard(cardsInHand, cardsInBank){
    const handIconsCount = cardAttrCount(cardsInHand, 'icon');
    const handSymbolsCount = cardAttrCount(cardsInHand, 'symbol');
    const iconCount = Object.keys(handIconsCount).length;
    const symbolCount = Object.keys(handSymbolsCount).length;
    const sortedCardInHandIDs = sortCardByValue(cardsInHand, true) // true returns array of cardIDs only
    const sortedCardInBankIDs = sortCardByValue(cardsInBank, true) // true returns array of cardIDs only
    
    const cardsInHandScore = calculateHand(cardsInHand);
    const cardsInBankScore = calculateHand(cardsInBank);
    
    if (cardsInBankScore > cardsInHandScore && cardsInBankScore > minBankScore){
        return ['Take Bank', cardsInBank]
    }

    // 3 unique symbols and 3 unique icons (chase symbols first);
    if (iconCount == 3 && symbolCount == 3){
        // Loop through cards in hand and loop through cards in bank to find the highst score combination by symbol
        let cardsPicked = findCardMatch(cardsInHand, cardsInBank, 'symbol');
        let cardPicked = cardsPicked[0];
        let dropCardInHand = cardsPicked[1];

        // If no matching symbol in bank chase (any) icon
        if (cardPicked == 'None'){
            cardsPicked = findCardMatch(cardsInHand, cardsInBank, 'icon');
            cardPicked = cardsPicked[0];
            dropCardInHand = cardsPicked[1];
        }

        // If no matching icon in bank either chase highest bank card
        if (cardPicked == 'None'){
            cardPicked = sortedCardInBankIDs[0];
            dropCardInHand = sortedCardInHandIDs[2];
        }

        return [cardPicked, dropCardInHand]
    }

    // 1 unique symbol (score 24 - 31) (1 unique icon == 30.5)
    if (iconCount == 1 || symbolCount == 1){
        
        if (cardsInHandScore == 30.5){
            return ['Player Pass', cardsInHand]
        }
        const cardsPicked = findCardMatch3(cardsInHand, cardsInBank, 'symbol');
        const cardPicked  = cardsPicked[0];
        const dropCardInHand = cardsPicked[1];

        // if playerScore > X => take a Gamble ? //
        if (cardPicked  == 'None'){
            return ['Player Pass', cardsInHand]
        }

        return [cardPicked , dropCardInHand]
    }

    // 2 unique symbols or 2 unique icons (chase icons first)
    if (iconCount == 2 || symbolCount == 2){
        // Chase Icons first
        let cardsPicked = findCardMatch2(cardsInHand, cardsInBank, 'icon');
        let cardPicked = cardsPicked[0];
        let dropCardInHand = cardsPicked[1];
        
        // If no matching icon in bank chase symbol
        if (cardPicked == 'None'){
            cardsPicked = findCardMatch2(cardsInHand, cardsInBank, 'symbol');
            cardPicked = cardsPicked[0];
            dropCardInHand = cardsPicked[1];
        }

        // If no matching icon in bank either, chase highest bank card
        if (cardPicked == 'None'){
            cardPicked = sortedCardInBankIDs[0];
            // Find which card to drop //
            let dropCardAttr = [];
            if (Object.keys(handSymbolsCount).length < Object.keys(handIconsCount).length){
                dropCardAttr = returnAttrFromCount(handSymbolsCount, 1, 'max');
                dropCardInHand = findCardIdByAttr(cardsInHand, dropCardAttr, 'low');
            }else{ // Favour Icons //
                dropCardAttr = returnAttrFromCount(handIconsCount, 1, 'max');
                dropCardInHand = findCardIdByAttr(cardsInHand, dropCardAttr, 'low');
            }
        }

        return [cardPicked, dropCardInHand];
    }
        
}

////////////////////////// GAME MECHANICS HELPER FUNCTIONS /////////////////////////////////

function activateDeactivatePlayer(){
    let activePlayer = null;
    let nextActivePlayer = null;
    
    Object.entries(players).forEach(([playerID, player])=>{
        if (player.active){
            if (playerID == 3){
                activePlayer = players[playerID];
                nextActivePlayer = players[0];
            }
            if (playerID < 3){
                activePlayer = players[playerID];
                nextActivePlayer = players[Number(playerID)+1];
            }
        }
    })
    
    activePlayer.active = false;
    nextActivePlayer.active = true;
}


function flipAllCards(){
    Object.values(players).forEach((player)=>{
        const location = player.location;
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

            const cardsInHand = player['cards-in-hand'];
            const cardIDS = Object.keys(cardsInHand);
            calcCardPositions(player, stacked=false);
            
            cardIDS.forEach(cardID => {
                const cardElem = cardsDB[cardID].elem;
                const position = cardsInHand[cardID];

                // Scaling 1.001 to keep imgaes crisp //
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
            calcCardPositions(player, stacked=false);
            repositionCards([player]);
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


function addCardToCardDB(cardID, cardElem){
    let splitID = cardID.split('_');
    let cardSymbol = splitID[0];
    let cardIcon = splitID[1];
    let cardValue = Number(cardIcon);

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
            return Object.fromEntries(Object.keys(players).filter((playerID) => !valuesArr.includes(playerID)));
        }
        else{
            return Object.fromEntries(Object.keys(players).filter((playerID) => valuesArr.includes(playerID)));
        }
    }
    
    if (filterOut){
        return Object.fromEntries(Object.values(players).filter((player) => !valuesArr.includes(player[fieldValue])));
    } else {
        return Object.fromEntries(Object.values(players).filter((player) => valuesArr.includes(player[fieldValue])));
    }
}


function createRandomDeckValues(numCards, minValue='2', maxValue='ace'){
    const cardValues = ['2','3','4','5','6','7','8','9','10','jack', 'queen', 'king', 'ace'];
    const cardSymbols = ['club', 'diamond', 'heart', 'spade'];

    const min = cardValues.indexOf(minValue);
    const max = cardValues.indexOf(maxValue)+1;
    const cardRange = cardValues.slice(min, max);

    let randomIndex = 0;

    // Can be miss-aligned //
    if (cardRange.length > numCards){
        console.log('Card Value Range not inline with Number of Playing Cards per Player')
    }

    const cardsInGame = [];

    cardRange.forEach(value => {
        cardSymbols.forEach(symbol => {
            cardsInGame.push(`${symbol}_${value}`);
        })
    })

    // Randomize cards //
    for (let index = cardsInGame.length - 1; index > 0; index--){
        
        randomIndex = Math.floor(Math.random() * (index + 1));
        [cardsInGame[index], cardsInGame[randomIndex]] = [cardsInGame[randomIndex], cardsInGame[index]]
        
      }
    // console.log(cardsInGame);
    const pickIndex = Math.floor(Math.random() * (cardsInGame.length - numCards));
    const cardsInDeck = cardsInGame.slice(pickIndex, pickIndex + numCards);
    
    // console.log(cardsInDeck);

    return cardsInDeck;
}


function repositionCards(playersArr=[]){
    let zIndex = 1;

    playersArr.forEach(player=> {
        const orientation = player.orientation;
        const cardsID = Object.keys(player['cards-in-hand'])

        cardsID.forEach(cardID =>{
            const cardElem = cardsDB[cardID].elem;
            const cardPos = player['cards-in-hand'][cardID];

            // Scaling 1.001 to keep images crisp //
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


function calcWinnerBadgePos(player){
    let emptySpaceX = ((cssViewPort.width * viewPortDimension.width) - winnerBadge.width - winnerBadge.border) / 2;
    let emptySpaceY = ((cssViewPort.height * viewPortDimension.height) - winnerBadge.height - winnerBadge.border) / 2 ;
    let badgePos = []

    if (player.location == 'south'){
        badgePos = [emptySpaceX,zonesPos.south + (cardDimensions.height - winnerBadge.height - 2 * winnerBadge.border) / 2] 
    }
    if (player.location == 'west'){
        badgePos = [zonesPos.west, emptySpaceY] 
    }
    if (player.location == 'north'){
        badgePos = [emptySpaceX,zonesPos.north + (cardDimensions.height - winnerBadge.height - 2 * winnerBadge.border) / 2] 
    }
    if (player.location == 'east'){
        badgePos = [zonesPos.east, emptySpaceY] 
    }

    return badgePos;
}


function calcCardPositions(player, stacked=true){
    let cardsInHand = player['cards-in-hand'];
    let widthHand = 0;
    let cardOffSet = 0;

    if (stacked){
        widthHand = handWidth.stacked;
        cardOffSet = offset.stacked;
    }
    else{
        widthHand = handWidth.unstacked;
        cardOffSet = cardDimensions.width;
    }
    
    let emptySpaceX = ((cssViewPort.width * viewPortDimension.width) - widthHand) / 2;
    let emptySpaceY = ((cssViewPort.height * viewPortDimension.height) - widthHand) / 2 - offset.stacked;

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



////////////////////////////// LOGIC HELPER FUNCTIONS /////////////////////////////////////

function cardAttrCount(cardsInHand, attr){
    const cardAttr = Object.keys(cardsInHand).map((cardID)=> cardsDB[cardID][attr]);
    const attrCount = {};

    cardAttr.forEach(item => {
        if (Object.hasOwn(attrCount, item)){
            attrCount[item] += 1;
        } else{
            attrCount[item] = 1;
        }

    })

    return attrCount;
}


function returnAttrFromCount(attrCount, countValue, minMax){
    const countKeys = []
    Object.entries(attrCount).forEach(([k,v]) =>{
            if (minMax == 'min' && v >= countValue){
                countKeys.push(k);
            }
            if (minMax == 'max' && v <= countValue){
                countKeys.push(k);
            }
        }) 
    return countKeys.length > 0 ? countKeys[0] : 'None';
}


function findCardIdByAttr(cardsInHand, matchAttr, lowHigh){
    let cardFoundID = 'None';
    let attr = 'icon';
    let currentValue = 0;
    let newValue = 0;
    const cardSymbols = ['club', 'diamond', 'heart', 'spade'];

    if(cardSymbols.includes(matchAttr)){
        attr = 'symbol';
    }

    Object.keys(cardsInHand).forEach(cardID =>{
        if (cardsDB[cardID][attr] == matchAttr){
            if (cardFoundID == 'None'){
                cardFoundID = cardID;
            } else{
                currentValue = cardsDB[cardFoundID].value;
                newValue = cardsDB[cardID].value;
                if (lowHigh == 'high'){
                    if (newValue > currentValue){
                        cardFoundID = cardID;
                    }
                }
                if (lowHigh == 'low'){
                    if (newValue < currentValue){
                        cardFoundID = cardID;
                    }
                }  
            } 
        }
    })

    return cardFoundID;
}


function calculateHand(cardsInHand){

    const iconCount = cardAttrCount(cardsInHand, 'icon');
    const symbolCount = cardAttrCount(cardsInHand, 'symbol');
    
    if (Object.keys(iconCount).length == 1){
        // If 3 identical icons //
        return 30.5;
    }
    else{
        let identicalSymbol = returnAttrFromCount(symbolCount, 2, 'min');
        let sum = 0;

          Object.keys(cardsInHand).forEach(cardID =>{
            if (cardsDB[cardID].symbol == identicalSymbol){
                sum += cardsDB[cardID].value;
            }
            if (identicalSymbol == 'None'){
                if(cardsDB[cardID].value > sum){
                    sum = cardsDB[cardID].value;
                    }
            }
        })

        return sum
    }

}


function filterCardsDB(cardsInHand, filterOut=false){
    const cardIdArr = Object.keys(cardsInHand)
    if (filterOut){
        return Object.fromEntries(Object.entries(cardsDB).filter(([k,v]) => !cardIdArr.includes(k)));
    }
    else{
        return Object.fromEntries(Object.entries(cardsDB).filter(([k,v]) => cardIdArr.includes(k)));
    }
}




function sortCardByValue(cardsInHand, keyOnly=false){
    const cardIDs = filterCardsDB(cardsInHand)
    const sortedCards = Object.fromEntries(Object.entries(cardIDs).sort(([,a],[,b]) => b.value-a.value));
    
    if (keyOnly){
        return Object.keys(sortedCards);
    }
    
    return sortedCards;
}

function filterPlayers(field, valuesArr, filterOut=true){

    if (field.toLowerCase() == 'key'){
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


function shiftArray(arr, index){
    const firstPart = arr.slice(index);
    const secondPart = arr.slice(0, index);
    const shiftedArray = firstPart.concat(secondPart);
    return shiftedArray;
}


/////////////////////////////// CREATE ELEMENTS /////////////////////////////////

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

    playerDisplay.style = `width: ${infoDisplay.width}px; font-size: ${infoDisplay.font}em; padding: ${infoDisplay.padding}px; border-radius: ${infoDisplay.padding}px; transform: translate(${displayPos.x}px, ${displayPos.y}px);`
}


function displayGameResults(names, score){
    const winnerDisplay = createElem('div', ['player-display'], 'winner-display');
    
    const winnerLabel = createElem('div', ['player-label', 'full-width'], 'winner-label');
    const winnerLabelText = document.createTextNode('The Winner !');
    addChildElement(winnerLabel, winnerLabelText);
    addChildElement(winnerDisplay, winnerLabel);
    
    names.forEach((name, index)=>{
        const winnerName = createElem('input', ['player-name', 'full-width'], `winner-name-${index}`);
        winnerName.type = 'text';
        
        winnerName.value = `${name} with a score of: ${score}`;
        winnerName.readonly = 'true';

        addChildElement(winnerDisplay, winnerName);
        })
    

    const restartGameBtn = createElem('div', ['game-btn'], 're-start-game-btn');
    
    restartGameBtn.addEventListener('click', ()=>{
        resetGame();
        });

    const newGameTextElem = createElem('div');
    addChildElement(restartGameBtn, newGameTextElem);
    const newGameText = document.createTextNode('New Game');
    addChildElement(newGameTextElem, newGameText);
    
    addChildElement(winnerDisplay, restartGameBtn);
    addChildElement(backgroundElem, winnerDisplay);

    winnerDisplay.style = `width: ${infoDisplay.width}px; font-size: ${infoDisplay.font}em; padding: ${infoDisplay.padding}px; border-radius: ${infoDisplay.padding}px; transform: translate(${displayPos.x}px, ${displayPos.y}px);`
}



function createHoldCardsBtn(x,y){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'hold-cards-btn');
    btnElem.style = `width: ${btnDimensions.width}px; font-size: ${btnDimensions.font}em; border-radius: ${btnDimensions.padding}em; padding-top: ${btnDimensions.padding}em; padding-bottom: ${btnDimensions.padding}em; transform: translate(${x}px,${y}px);`;
    const btnText = document.createTextNode('Hold');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    playerHoldEvent(btnElem);

    return btnElem;
}


function createPlayCardsBtn(x,y){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'play-cards-btn');
    btnElem.style = `width: ${btnDimensions.width}px; font-size: ${btnDimensions.font}em; border-radius: ${btnDimensions.padding}em; padding-top: ${btnDimensions.padding}em; padding-bottom: ${btnDimensions.padding}em; transform: translate(${x}px,${y}px);`;
    const btnText = document.createTextNode('Play Cards');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    playCardsEvent(btnElem);

    return btnElem;
}


function createSwapBankBtn(x,y){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'swap-bank-btn');
    btnElem.style = `width: ${btnDimensions.width}px; font-size: ${btnDimensions.font}em; border-radius: ${btnDimensions.padding}em; padding-top: ${btnDimensions.padding}em; padding-bottom: ${btnDimensions.padding}em; transform: translate(${x}px,${y}px);`;
    const btnText = document.createTextNode('Swap Bank');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    swapBankEvent(btnElem, true);
    
    return btnElem;
}


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

        // Scaling 1.001 to keep images crisp //
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
            ); width: ${cardDimensions.width}px; height: ${cardDimensions.height}px;`; 
        
        // add hover mouse event //
        mouseOverEvent(cardElem);
        // add click card event //
        cardClickEvent(cardElem);

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


function createWinnerBadgeElem(){
    const badgeElem = document.createElement('div');
    addClassToElement(badgeElem, 'badge');
    addIdToElement(badgeElem, 'winner-badge');
    const badgeText = document.createTextNode('31');
    addChildElement(badgeElem, badgeText);
    addChildElement(playFieldElem, badgeElem);
    return badgeElem;
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

//////////////////////////// CREATE EVENTS //////////////////////////////////

function mouseOverEvent(elem){

    elem.addEventListener(
        "mouseenter",
        (event) => {
            // Hover UP //
            const cardID = findCardID(elem);
            if (cardsDB[cardID].access && players[0].active && !cardsDB[cardID].picked){
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
            if (cardsDB[cardID].access && players[0].active && !cardsDB[cardID].picked){
                event.target.style = cardHoverEffect(event.target, reverse=true);
            }
        },
        false,
      );
}


function cardClickEvent(elem){
    elem.addEventListener('click', (event)=>{
        const cardID = findCardID(event.target.parentElement.parentElement);
    
        if (cardsDB[cardID].access && players[0].active){
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
    elem.addEventListener('click',()=> {
        playerAction('playCards');
    });
}


function playerHoldEvent(elem){
    elem.addEventListener('click',()=> {
        playerAction('playerHold');
    });
}


function swapBankEvent(elem, pass){
    elem.addEventListener('click',()=> {
        playerAction('swapBank');
    });
}


function pickCardEffect(pickedElem){
    const cardID = findCardID(pickedElem);
    const location = cardsDB[cardID].location;
    let pickCardArray = [];

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
    const matrix3D = targetStyle.slice(1, targetStyle.length-6);
    const trailing = targetStyle.slice(targetStyle.length -6);

    let hoverX = offset.hoverx;
    let hoverY = offset.hovery;

    if (reverse){
        // If card did not recieved a mouseenter event //
        if (Number.parseInt(matrix3D[13]) == parseInt(deckPos.y) || Number.parseInt(matrix3D[13]) == parseInt(zonesPos.south)){
            hoverX = 0;
            hoverY = 0;
        }else{
            hoverX = -1 * hoverX;
            hoverY = -1 * hoverY;
        }
        
    }

    matrix3D[12] = Number(matrix3D[12]) - hoverX;
    matrix3D[13] = Number(matrix3D[13]) - hoverY;

    matrixStr = `${transform} ${matrix3D.toString()} ${trailing.toString().replace(/,/g, ' ')}}`;
    return matrixStr;
}

// Card Pick Should leave card in Hover UP state //
function mouseLeaveEffect(elem){
    const hoverDown = new Event("mouseleave");
    elem.dispatchEvent(hoverDown);
}


///////////////////////// CREATE START POINT ////////////////////////////////
calculateVariables();
displayPlayerEntry();
